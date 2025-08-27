/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import { getCommentById } from "../lib/api";
import type { Comment } from "./types";

interface ReplyListProps {
  replies?: (string | Comment)[];
}

export default function ReplyList({ replies = [] }: ReplyListProps) {
  const [replyObjects, setReplyObjects] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchRepliesIfNeeded() {
      // If replies array is empty, clear and return
      if (!replies || replies.length === 0) {
        setReplyObjects([]);
        return;
      }

      // If items look like objects with _id, use them directly
      const first = replies[0];
      const looksPopulated = typeof first === "object" && (first as any)._id;

      if (looksPopulated) {
        // Type cast and set
        if (mounted)
          setReplyObjects((replies as Comment[]).map((r) => r as Comment));
        return;
      }

      // Otherwise replies are ids: fetch them
      setLoading(true);
      try {
        const results = await Promise.all(
          (replies as string[]).map((id) => getCommentById(id))
        );
        if (mounted) setReplyObjects(results);
      } catch (err) {
        console.error("Failed to fetch replies", err);
        if (mounted) setReplyObjects([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchRepliesIfNeeded();
    return () => {
      mounted = false;
    };
  }, [replies]);

  if (!replies || replies.length === 0) return null;
  if (loading && replyObjects.length === 0) {
    return (
      <div className="ml-6 mt-3 text-xs text-gray-500">Loading replies…</div>
    );
  }

  return (
    <div className="ml-6 mt-3 border-l pl-3 space-y-2">
      {replyObjects.map((r) => (
        <div key={r._id} className="p-2 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-800">
            <span className="font-semibold">
              {r.author?.username || "Unknown"}:
            </span>{" "}
            {r.content}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(r.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
