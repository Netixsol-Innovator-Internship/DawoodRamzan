/* eslint-disable*/
/* eslint-disable prefer-const */

import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Match, MatchDocument } from './schemas/match.schema';
import {
  Conversation,
  ConversationDocument,
} from '../schema/conversation.schema';
import { Summary, SummaryDocument } from '../schema/summary.schema';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class MatchesService {
  private readonly logger = new Logger(MatchesService.name);

  constructor(
    @InjectModel(Match.name) private matchModel: Model<MatchDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Summary.name) private summaryModel: Model<SummaryDocument>,
    private readonly gemini: GeminiService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  // ---------------- Node 1: Relevancy Checker ----------------
  async relevancyCheck(question: string): Promise<boolean> {
    const prompt = `
Decide if the following user question is about cricket matches, players, or cricket statistics.
Return only "true" or "false".

Question: "${question}"
    `.trim();

    try {
      const resp = await this.gemini.ask(prompt);
      return resp.toLowerCase().includes('true');
    } catch (err) {
      this.logger.error(
        'Gemini relevancy check failed, defaulting to false',
        err,
      );
      return false;
    }
  }

  // ---------------- Node 2: Memory Retriever ----------------
  async retrieveMemory(
    userId: string,
  ): Promise<{ history: Conversation[]; summary: string }> {
    try {
      const history = await this.conversationModel
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(10)
        .exec();

      let summaryDoc = await this.summaryModel.findOne({ userId }).exec();
      let summary = summaryDoc?.summary || '';

      if (history.length > 5 && !summary) {
        summary = await this.createSummary(userId, history);
      }

      return { history: history.reverse(), summary };
    } catch (err) {
      this.logger.error('Error retrieving memory', err);
      return { history: [], summary: '' };
    }
  }

  // ---------------- Summarizer ----------------
  async createSummary(
    userId: string,
    history: Conversation[],
  ): Promise<string> {
    const recentConversations = history
      .slice(0, 5)
      .map((conv) => `Q: ${conv.question} A: ${conv.answer}`)
      .join('\n');

    const prompt = `
Based on the following conversation history, create a short summary (2–3 sentences) of key facts to remember.
Focus only on cricket-related details.

Conversation History:
${recentConversations}
    `.trim();

    try {
      const summary = await this.gemini.ask(prompt);
      await this.summaryModel
        .findOneAndUpdate(
          { userId },
          { summary, updatedAt: new Date() },
          { upsert: true, new: true },
        )
        .exec();
      return summary;
    } catch (err) {
      this.logger.error('Error creating summary', err);
      return 'No summary available.';
    }
  }

  // ---------------- Detect format ----------------
  detectFormat(question: string): 'TEST' | 'ODI' | 'T20' | null {
    const q = question.toUpperCase();
    if (q.includes('TEST')) return 'TEST';
    if (q.includes('ODI')) return 'ODI';
    if (q.includes('T20') || q.includes('TWENTY20')) return 'T20';
    return null;
  }

  // ---------------- Utility: extract teams and year fallback ----------------
  private commonTeams = [
    'Australia',
    'England',
    'Pakistan',
    'India',
    'New Zealand',
    'South Africa',
    'Sri Lanka',
    'West Indies',
    'Bangladesh',
    'Zimbabwe',
    'Afghanistan',
    'Ireland',
    'Scotland',
    'Netherlands',
  ];

  private detectTeamsAndYear(question: string) {
    const q = question.toLowerCase();

    const teamsFound: string[] = [];
    for (const t of this.commonTeams) {
      if (q.includes(t.toLowerCase())) teamsFound.push(t);
    }

    // year - prefer 4-digit years 1877-2019
    const yearMatch = q.match(/(18|19|20)\d{2}/);
    const year = yearMatch ? parseInt(yearMatch[0], 10) : null;

    return { teams: teamsFound, year };
  }

  // ---------------- Utility: sanitize/normalize generated queries ----------------
  private tryParseJSONSafely(text: string) {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }

  /**
   * Recursively normalize filters and EJSON-like shapes into Mongo-friendly objects.
   * Handles:
   *  - {$regularExpression: {pattern, options}} --> {$regex: pattern, $options: options}
   *  - {"$numberInt":"20"} --> 20
   *  - { "$date": "..." } --> "..."
   *  - ISODate("...") occurrences already stripped in generateMongoQueries; but double-protect here
   */
  private normalizeValue(v: any): any {
    if (v === null || v === undefined) return v;

    // convert string like ISODate("1992-01-01T00:00:00Z") -> "1992-01-01T..."
    if (typeof v === 'string') {
      const isoDateRegex = /ISODate\(["']?(.*?)["']?\)/i;
      const m = v.match(isoDateRegex);
      if (m) return m[1];
      return v;
    }

    if (Array.isArray(v)) {
      return v.map((el) => this.normalizeValue(el));
    }

    if (typeof v === 'object') {
      // extended number parsing {$numberInt: "20"} or {"$numberLong":"12345"}
      if ('$numberInt' in v) {
        return parseInt(v['$numberInt'], 10);
      }
      if ('$numberLong' in v) {
        const val = Number(v['$numberLong']);
        return Number.isNaN(val) ? v : val;
      }
      // {$date: "...."}
      if ('$date' in v && typeof v['$date'] === 'string') {
        return v['$date'];
      }
      // {$regex: ..., $options: ...} - leave as-is
      if ('$regex' in v) {
        // ensure pattern is string
        return {
          $regex:
            typeof v['$regex'] === 'object' && v['$regex']?.pattern
              ? v['$regex'].pattern
              : v['$regex'],
          $options: v['$options'] || v['$options'] === '' ? v['$options'] : 'i',
        };
      }
      // $regularExpression (some LLM produce this)
      if (
        '$regularExpression' in v &&
        typeof v['$regularExpression'] === 'object'
      ) {
        const re = v['$regularExpression'];
        return { $regex: re.pattern, $options: re.options || 'i' };
      }

      // If object looks like {pattern: "...", options:"i"} (sometimes nested), convert to regex
      if ('pattern' in v && 'options' in v) {
        return { $regex: v.pattern, $options: v.options || 'i' };
      }

      // handle nested $gte/$lte where values may be {"$date": "..."} or ISO strings
      const out: any = {};
      for (const [k, vv] of Object.entries(v)) {
        if (
          (k === '$gte' || k === '$lte' || k === '$gt' || k === '$lt') &&
          typeof vv === 'object' &&
          '$date' in (vv as any)
        ) {
          out[k] = (vv as any)['$date'];
        } else {
          out[k] = this.normalizeValue(vv);
        }
      }
      return out;
    }

    return v;
  }

  private normalizeFilterRecursive(filter: any): any {
    if (filter === null || filter === undefined) return {};
    if (typeof filter === 'string') {
      // return simple regex search
      return { $regex: filter, $options: 'i' };
    }
    if (Array.isArray(filter)) {
      return filter.map((f) => this.normalizeFilterRecursive(f));
    }
    if (typeof filter === 'object') {
      const out: any = {};
      for (const [k, v] of Object.entries(filter)) {
        const key = k;
        const val = v;

        // normalize embedded unusual keys (like "$regularExpression")
        if (key === '$regularExpression' && typeof val === 'object') {
          // direct convert
          const conv = this.normalizeValue(val);
          // merge into out as a $regex? This is unlikely top-level; keep safe
          out['$regex'] = conv['$regex'];
          out['$options'] = conv['$options'] || 'i';
          continue;
        }

        // If val is object, normalize recursively
        if (val && typeof val === 'object') {
          // If object itself is a regex-like container produced by LLM:
          if ('$regularExpression' in val) {
            out[key] = this.normalizeValue(val);
            continue;
          }
          if ('$regex' in val) {
            out[key] = this.normalizeValue(val);
            continue;
          }
          // If date object like { $gte: "1992-..", $lte: "1992-.." } or objects containing $date
          if (
            ('$gte' in val || '$lte' in val || '$gt' in val || '$lt' in val) &&
            (typeof val['$gte'] === 'string' || typeof val['$lte'] === 'string')
          ) {
            // normalize $gte/$lte values, possibly removing $date wrapper
            const normObj: any = {};
            for (const op of ['$gte', '$lte', '$gt', '$lt']) {
              if (op in val) {
                const raw = (val as any)[op];
                if (raw && typeof raw === 'object' && '$date' in raw)
                  normObj[op] = raw['$date'];
                else if (typeof raw === 'string') normObj[op] = raw;
                else normObj[op] = this.normalizeValue(raw);
              }
            }
            out[key] = normObj;
            continue;
          }

          // Generic object: recurse into it
          out[key] = this.normalizeFilterRecursive(val);
          continue;
        }

        // primitive string -> convert to regex search
        if (typeof val === 'string') {
          out[key] = { $regex: val, $options: 'i' };
          continue;
        }

        // else copy raw
        out[key] = val;
      }
      return out;
    }

    // fallback
    return filter;
  }

  private sanitizeQueryObject(q: any, formatHint?: string) {
    const sanitized: any = {};
    sanitized.collection = q.collection || formatHint || 'any';

    // filter
    const rawFilter = q.filter ?? {};
    const normalizedFilterCandidate = this.normalizeFilterRecursive(rawFilter);
    sanitized.filter = normalizedFilterCandidate || {};

    // projection
    if (q.projection === null || q.projection === undefined)
      sanitized.projection = undefined;
    else sanitized.projection = q.projection;

    // sort
    if (q.sort === null || q.sort === undefined) sanitized.sort = undefined;
    else sanitized.sort = q.sort;

    // limit - normalize extended JSON numbers
    let limit = 20;
    if (q.limit === undefined || q.limit === null) limit = 20;
    else if (typeof q.limit === 'number') limit = q.limit;
    else if (typeof q.limit === 'string' && /^\d+$/.test(q.limit))
      limit = parseInt(q.limit, 10);
    else if (typeof q.limit === 'object') {
      if ('$numberInt' in q.limit) limit = parseInt(q.limit['$numberInt'], 10);
      else if ('$numberLong' in q.limit) limit = Number(q.limit['$numberLong']);
      else if ('limit' in q.limit && typeof q.limit.limit === 'number')
        limit = q.limit.limit;
      else limit = 20;
    }
    sanitized.limit = limit;

    // agg
    sanitized.agg = Array.isArray(q.agg) && q.agg.length ? q.agg : undefined;

    return sanitized;
  }

  private sanitizeGeneratedQueries(gen: any, formatHint?: string) {
    // Accept many forms: string, array, single object
    if (!gen)
      return [{ collection: formatHint || 'any', filter: {}, limit: 20 }];

    if (typeof gen === 'string') {
      // try parse
      const tryParsed = this.tryParseJSONSafely(gen);
      if (tryParsed)
        return this.sanitizeGeneratedQueries(tryParsed, formatHint);
      // fallback: fallback generator
      return [this.fallbackQueryFromQuestion(gen, formatHint)];
    }

    if (Array.isArray(gen)) {
      return gen.map((g) => this.sanitizeQueryObject(g, formatHint));
    }

    // object
    return [this.sanitizeQueryObject(gen, formatHint)];
  }

  // ---------------- Fallback query generator ----------------
  private fallbackQueryFromQuestion(question: string, formatHint?: string) {
    const { teams, year } = this.detectTeamsAndYear(question);

    const makeRegex = (team: string) => ({
      Team: { $regex: team, $options: 'i' },
    });

    const baseFilter: any = {};
    if (teams.length >= 2) {
      // both teams present => either direction
      baseFilter.$or = [
        {
          Team: { $regex: teams[0], $options: 'i' },
          Opposition: { $regex: teams[1], $options: 'i' },
        },
        {
          Team: { $regex: teams[1], $options: 'i' },
          Opposition: { $regex: teams[0], $options: 'i' },
        },
      ];
    } else if (teams.length === 1) {
      baseFilter.$or = [
        { Team: { $regex: teams[0], $options: 'i' } },
        { Opposition: { $regex: teams[0], $options: 'i' } },
      ];
    } else {
      // no teams: match anything
    }

    if (year) {
      // produce simple year regex (match both 1992 and 92)
      const y = String(year);
      const yShort = y.slice(-2);
      baseFilter.Date = { $regex: `(${y}|${yShort})`, $options: 'i' };
    }

    const collection = formatHint || 'any';
    return { collection, filter: baseFilter, limit: 200 };
  }

  // ---------------- Node 3: Query Generator (with sanitization + fallback) ----------------
  async generateMongoQueries(
    question: string,
    memory: { history: Conversation[]; summary: string },
    formatHint?: string,
  ) {
    const schema = {
      collectionFields: {
        Format: 'string',
        Team: 'string',
        Opposition: 'string',
        Ground: 'string',
        Runs: 'string',
        Overs: 'number',
        Wickets: 'number',
        RPO: 'number',
        Inns: 'number',
        Result: 'string',
        Date: 'string (format: YYYY-MM-DD)',
      },
      collections: ['TEST', 'ODI', 'T20'],
    };

    const memoryContext = memory.summary
      ? `Previous context: ${memory.summary}`
      : 'No previous context available.';
    const recentContext = memory.history
      .slice(-3)
      .map((c) => c.question)
      .join(', ');

    const prompt = `
You are an assistant that converts cricket questions into MongoDB JSON queries.

Rules:
1. Output ONLY valid JSON (no markdown, no comments).
2. Keys: { collection, filter, projection, sort, limit, agg }.
3. Dates MUST be plain ISO 8601 strings. DO NOT use ISODate(). Example:
   { "Date": { "$gte": "1992-01-01T00:00:00Z", "$lte": "1992-12-31T23:59:59Z" } }
4. Use regex for text matches:
   { "Team": { "$regex": "Pakistan", "$options": "i" } }
5. Sorting rules:
   - "latest"/"recent" → { Date: -1 }, limit 1.
   - "first"/"earliest" → { Date: 1 }, limit 1.
   - "top N" or "highest" → sort by numeric field desc, limit N.
   - "lowest" → sort by numeric field asc, limit N.
6. Default: limit 20, sort null.
7. Matches are between 1877–2019.
8. Provide at least 2 different valid query options.
9. Sample query is:
{
  "collection": "TEST",
  "filter": {
    "$and": [
      {
        "$or": [
          { "Team": { "$regex": "Pakistan", "$options": "i" }, "Opposition": { "$regex": "England", "$options": "i" } },
          { "Team": { "$regex": "England", "$options": "i" }, "Opposition": { "$regex": "Pakistan", "$options": "i" } }
        ]
      },
      { "Date": { "$gte": "1992-01-01T00:00:00Z", "$lte": "1992-12-31T23:59:59Z" } }
    ]
  },
  "limit": 20
}

10. Sample data in my mongo db is:

_id:68d38bf631b0e842af5580d4
Team:Australia
RPO:10.7
Inns:1
Result:won
Opposition:New Zealand
Ground:Auckland
Date:17-Feb-05
Runs:214
Wickets:5
Overs:20
Balls:0
BallsPerOver:6
_id:
68d38bf631b0e842af5580d5
Team:
"New Zealand"
RPO:
"8.5"
Inns:
"2"
Result:
"lost"
Opposition:
"Australia"
Ground:
"Auckland"
Date:
"17-Feb-05"
Runs:
"170"
Wickets:
"10"
Overs:
"20"
Balls:
"0"
BallsPerOver:
"6"
_id:
68d38bf631b0e842af5580d6
Team:
"England"
RPO:
"8.95"
Inns:
"1"
Result:
"won"
Opposition:
"Australia"
Ground:
"Southampton"
Date:
"13-Jun-05"
Runs:
"179"
Wickets:
"8"
Overs:
"20"
Balls:
"0"
BallsPerOver:
"6"


Context: ${memoryContext}
Recent: ${recentContext || 'None'}
Schema: ${JSON.stringify(schema)}
Question: "${question}"
Return an array of JSON queries.
    `.trim();

    const resp = await this.gemini.ask(prompt);

    // Try to make sense of Gemini output robustly:
    try {
      let clean = (resp || '').toString();

      // remove markdown fences
      clean = clean.replace(/```json/gi, '').replace(/```/g, '');

      // Convert ISODate("...") to "..."
      clean = clean.replace(/ISODate\((['"`]?)([^'")]+)\1\)/gi, '"$2"');

      
      clean = clean.replace(/,(\s*[}\]])/g, '$1');

      // Some LLMs output keys without quotes; attempt to quote keys - too risky to do globally, so try parse first
      let parsed = null;
      try {
        parsed = JSON.parse(clean);
      } catch (e) {
        // try one more pass: try to detect single quotes and replace with double quotes
        const tryDouble = clean.replace(/'/g, '"');
        try {
          parsed = JSON.parse(tryDouble);
        } catch (e2) {
          parsed = null;
        }
      }

      if (!parsed) {
        // as last attempt, attempt to extract JSON blocks with regex
        const jsonBlockMatch = clean.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
        if (jsonBlockMatch) {
          const block = jsonBlockMatch[0];
          const tryParseAgain = this.tryParseJSONSafely(
            block.replace(/'/g, '"'),
          );
          if (tryParseAgain) parsed = tryParseAgain;
        }
      }

      if (!parsed) {
        this.logger.warn(
          'Gemini produced unparsable query JSON; using fallback generator.',
        );
        return [this.fallbackQueryFromQuestion(question, formatHint)];
      }

      // sanitize parsed queries into normalized queries
      const sanitized = this.sanitizeGeneratedQueries(parsed, formatHint);
      // final safety: if sanitized returns empty, fallback
      if (!sanitized || (Array.isArray(sanitized) && sanitized.length === 0)) {
        return [this.fallbackQueryFromQuestion(question, formatHint)];
      }
      return sanitized;
    } catch (err) {
      this.logger.error('Failed to parse/sanitize Gemini output', err);
      this.logger.debug('Gemini raw response: ' + resp);
      return [this.fallbackQueryFromQuestion(question, formatHint)];
    }
  }

  // ---------------- Node 4: Query Executor ----------------
  
  async executeMongoQuery(genQuery: any): Promise<any[]> {
    const db = this.connection.db;
    if (!db) throw new Error('MongoDB not connected');

    // Helper to convert ISO-range into a regex that matches either the four-digit year or two-digit suffix
    const convertIsoRangeToYearRegex = (rangeObj: any) => {
      try {
        const maybeGte = rangeObj.$gte;
        const maybeLte = rangeObj.$lte;
        const parseYear = (s: any) => {
          if (!s) return null;
          if (typeof s === 'string') {
            const d = new Date(s);
            if (!isNaN(d.getTime())) return d.getUTCFullYear();
            // maybe $date object e.g. {"$date":"1992-01-01T..."}
            if (typeof s === 'string') {
              const yearMatch = s.match(/(18|19|20)\d{2}/);
              if (yearMatch) return parseInt(yearMatch[0], 10);
            }
            return null;
          }
          return null;
        };

        const g = parseYear(maybeGte);
        const l = parseYear(maybeLte);
        const pickYear = l || g;
        if (!pickYear) return null;
        const yFull = String(pickYear);
        const yShort = yFull.slice(-2);
        // match either 1992 or 92 (some DBs use 2-digit years like "92")
        return { $regex: `(${yFull}|${yShort})`, $options: 'i' };
      } catch {
        return null;
      }
    };

    // normalize a filter object before passing to Mongo
    const normalizeForMongo = (filter: any): any => {
      if (!filter) return {};
      if (Array.isArray(filter)) return filter.map((f) => normalizeForMongo(f));
      if (typeof filter !== 'object') return filter;

      const out: any = {};
      for (const [k, v] of Object.entries(filter)) {
        // If nested special operators ($and, $or), recurse
        if (k === '$and' || k === '$or' || k === '$nor') {
          out[k] = (v as any[]).map((el) => normalizeForMongo(el));
          continue;
        }

        // If key is Date and value is object with $gte/$lte => convert to year-regex fallback
        if (k.toLowerCase() === 'date' && v && typeof v === 'object') {
          // If it's already a regex, just use it
          if ('$regex' in v) {
            out[k] = v;
            continue;
          }
          // If contains $gte/$lte as strings, convert range to year-regex fallback
          if ('$gte' in v || '$lte' in v) {
            const converted = convertIsoRangeToYearRegex(v);
            if (converted) {
              out[k] = converted;
              continue;
            }
          }

          // if v is raw string then convert to regex
          if (typeof v === 'string') {
            out[k] = { $regex: v, $options: 'i' };
            continue;
          }

          // otherwise try to normalize recursively
          out[k] = normalizeForMongo(v);
          continue;
        }

        // For common objects that represent regex (sanitized earlier),
        // keep $regex as-is; if plain string -> make regex
        if (typeof v === 'string') {
          out[k] = { $regex: v, $options: 'i' };
          continue;
        }
        if (v && typeof v === 'object') {
          // If object contains $regex or $options - keep it
          if ('$regex' in v) {
            out[k] = v;
            continue;
          }
          // otherwise recurse
          out[k] = normalizeForMongo(v);
          continue;
        }

        out[k] = v;
      }
      return out;
    };

    const runQuery = async (collName: string) => {
      const collection = db.collection(collName);
      try {
        if (
          genQuery.agg &&
          Array.isArray(genQuery.agg) &&
          genQuery.agg.length
        ) {
          return collection.aggregate(genQuery.agg).toArray();
        }
        const rawFilter = genQuery.filter || {};
        const mongoFilter = normalizeForMongo(rawFilter);
        const cursor = collection.find(mongoFilter);

        if (genQuery.projection) cursor.project(genQuery.projection);
        if (genQuery.sort) cursor.sort(genQuery.sort);
        if (genQuery.limit) cursor.limit(Number(genQuery.limit) || 20);

        return cursor.toArray();
      } catch (err) {
        this.logger.error('Error running query on collection ' + collName, err);
        return [];
      }
    };

    let results: any[] = [];
    if (!genQuery.collection || genQuery.collection === 'any') {
      const perCollLimit = Math.max(genQuery.limit || 10, 10);
      const queries = ['TEST', 'ODI', 'T20'].map((c) => runQuery(c));
      results = (await Promise.all(queries)).flat().slice(0, perCollLimit * 3);
    } else {
      results = await runQuery(genQuery.collection);
    }

    if (!results || results.length === 0) {
      this.logger.warn('No results found. Retrying fallback.');
      for (const coll of ['TEST', 'ODI', 'T20']) {
        const fallback = await db.collection(coll).find({}).limit(10).toArray();
        if (fallback.length > 0) {
          results = fallback;
          break;
        }
      }
    }
    return results;
  }

  // ---------------- Node 5: Answer Formatter ----------------
  async formatAnswer(
    question: string,
    rawResults: any[],
    memory: { history: Conversation[]; summary: string },
  ): Promise<any> {
    if (!rawResults || rawResults.length === 0) {
      return { type: 'text', text: 'No matching records found.', summary: '' };
    }

    if (rawResults.length === 1) {
      const doc = rawResults[0];
      const prompt = `
Question: "${question}"
Context: ${memory.summary || ''}
Document: ${JSON.stringify(doc)}
Write a single plain-text one-line cricket summary.
      `.trim();
      const resp = await this.gemini.ask(prompt);
      return { type: 'text', text: resp.trim(), summary: resp.trim() };
    }

    // build table response
    const keys = new Set<string>();
    rawResults.forEach((r) => Object.keys(r).forEach((k) => keys.add(k)));
    const prefer = [
      'Date',
      'Team',
      'Opposition',
      'Ground',
      'Runs',
      'Overs',
      'RPO',
      'Inns',
      'Result',
      'Format',
    ];
    const columns = prefer
      .filter((p) => keys.has(p))
      .concat([...keys].filter((k) => !prefer.includes(k)));

    const rows = rawResults.map((r) =>
      columns.map((c) =>
        r[c] !== undefined && r[c] !== null ? String(r[c]) : '',
      ),
    );

    const summaryPrompt = `
Question: "${question}"
Context: ${memory.summary || ''}
Sample rows: ${JSON.stringify(rawResults.slice(0, 3))}
Write a 2–3 sentence summary (plain text).
    `.trim();
    const summary = await this.gemini.ask(summaryPrompt);

    return {
      type: 'table',
      columns,
      rows,
      text: summary.trim(),
      summary: summary.trim(),
    };
  }

  // ---------------- Node 6: Memory Saver ----------------
  async saveMemory(
    userId: string,
    question: string,
    answer: string | { text: string; summary?: string },
    mongoQueries?: any[],
    mongoResponse?: any[],
    finalSummary?: string,
  ) {
    if (!userId) {
      this.logger.error('saveMemory called without userId');
      return false;
    }
    try {
      const conversation = new this.conversationModel({
        userId,
        question,
        answer: typeof answer === 'string' ? answer : answer.text,
        mongoQueries: mongoQueries || [],
        mongoResponse: mongoResponse || [],
        summary:
          finalSummary || (typeof answer === 'object' ? answer.summary : ''),
        timestamp: new Date(),
      });
      await conversation.save();

      console.log(conversation.answer);
      console.log(conversation.mongoResponse);

      const count = await this.conversationModel.countDocuments({ userId });
      if (count % 3 === 0) {
        const recent = await this.conversationModel
          .find({ userId })
          .sort({ timestamp: -1 })
          .limit(5)
          .exec();
        await this.createSummary(userId, recent);
      }
      return true;
    } catch (err) {
      this.logger.error('Error saving memory', err);
      return false;
    }
  }

  // ---------------- Node 7: Orchestrator ----------------
  async answerQuestion(userId: string, question: string) {
    const relevant = await this.relevancyCheck(question);
    if (!relevant) {
      const response = {
        type: 'text' as const,
        text: 'Sorry, only cricket questions supported.',
        summary: '',
      };
      await this.saveMemory(userId, question, response);
      return response;
    }

    const memory = await this.retrieveMemory(userId);
    const formatHint = this.detectFormat(question);
    const genQueries = await this.generateMongoQueries(
      question,
      memory,
      formatHint || undefined,
    );
    this.logger.debug(
      'Generated and sanitized queries: ' + JSON.stringify(genQueries, null, 2),
    );

    let allResults: any[] = [];
    for (const q of genQueries) {
      try {
        const res = await this.executeMongoQuery(q);
        allResults = allResults.concat(res);
      } catch (err) {
        this.logger.error('Error executing query', err);
      }
    }

    const response = await this.formatAnswer(question, allResults, memory);

    await this.saveMemory(
      userId,
      question,
      { text: response.text || '', summary: response.summary },
      genQueries,
      allResults,
      response.summary,
    );

    return {
      ...response,
      memory: {
        hasHistory: memory.history.length > 0,
        summary: memory.summary,
        recentQuestions: memory.history.slice(-3).map((c) => c.question),
      },
    };
  }

  // ---------------- History APIs ----------------
  async getConversationHistory(userId: string): Promise<Conversation[]> {
    return this.conversationModel
      .find({ userId })
      .sort({ timestamp: 1 })
      .exec();
  }
  async getSummary(userId: string): Promise<string> {
    const summaryDoc = await this.summaryModel.findOne({ userId }).exec();
    console.log(summaryDoc?.summary);
    return summaryDoc?.summary || 'No summary available.';
  }
  async clearUserMemory(userId: string): Promise<boolean> {
    try {
      await this.conversationModel.deleteMany({ userId }).exec();
      await this.summaryModel.deleteOne({ userId }).exec();
      return true;
    } catch (err) {
      this.logger.error('Error clearing memory', err);
      return false;
    }
  }
  async getDetailedConversationHistory(userId: string): Promise<any[]> {
    return this.conversationModel
      .find({ userId })
      .select('question answer mongoQueries mongoResponse summary timestamp')
      .sort({ timestamp: -1 })
      .exec();
  }
  async getConversationDetails(
    conversationId: string,
  ): Promise<Conversation | null> {
    return this.conversationModel
      .findById(conversationId)
      .select('question answer mongoQueries mongoResponse summary timestamp')
      .exec();
  }
}
