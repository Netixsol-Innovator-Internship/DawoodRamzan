"use client";

import { useState } from "react";
import axios from "axios";

interface QuestionInputProps {
  onAnswer: (userQ: string, assistantAns: any) => void;
  onLoading: (loading: boolean) => void;
  disabled?: boolean; // ✅ new prop
}

export default function QuestionInput({
  onAnswer,
  onLoading,
  disabled = false,
}: QuestionInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || disabled) return; // ✅ block if disabled

    onLoading(true);
    const userId = localStorage.getItem("id");

    try {
      const res = await axios.post("http://localhost:4000/matches/ask", {
        question,
        userId,
      });

      onAnswer(question, res.data);
    } catch (err: any) {
      onAnswer(question, { text: "❌ Failed to fetch response" });
    } finally {
      onLoading(false);
      setQuestion(""); // clear input after sending
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a cricket question (e.g. highest ODI score)"
        disabled={disabled} // ✅ input also disabled while loading
        className={`flex-1 px-4 py-6 bg-gray-100 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
          disabled ? "bg-gray-100 cursor-not-allowed" : ""
        }`}
      />
      <button
        type="submit"
        disabled={disabled}
        className={`px-12 py-2 rounded-xl font-semibold shadow 
          ${
            disabled
              ? "bg-blue-400 cursor-not-allowed opacity-50"
              : "bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
          }
        `}
      >
        Ask
      </button>
    </form>
  );
}
