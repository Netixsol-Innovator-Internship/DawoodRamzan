"use client";

import { useState } from "react";
import QuestionInput from "../components/QuestionInput";
import AnswerDisplay from "../components/AnswerDisplay";
import TraceViewer from "../components/TraceViewer";

interface AnswerData {
  answer: string;
  traceId: string;
  contradictions: string[];
}

export default function Home() {
  const [answerData, setAnswerData] = useState<AnswerData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswer = (data: AnswerData) => {
    setAnswerData(data);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Research Team AI</h1>
        <p className="mt-3 text-lg text-gray-600">
          Ask complex questions and watch our AI team research them step by step
        </p>
      </header>

      {/* Main Content */}
      <main>
        <QuestionInput onAnswer={handleAnswer} onLoading={setLoading} />

        {loading && (
          <div className="text-center text-xl text-indigo-600 my-6 animate-pulse">
            Researching... ⏳
          </div>
        )}

        {answerData && (
          <div className="mt-8 space-y-6">
            <AnswerDisplay
              answer={answerData.answer}
              contradictions={answerData.contradictions}
            />
            <TraceViewer traceId={answerData.traceId} />
          </div>
        )}
      </main>
    </div>
  );
}
