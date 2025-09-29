"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

export type ChatMsg = {
  id?: string | number;
  role: "user" | "assistant" | "system";
  text: string;
  meta?: any;
  type?: string; // "table" supported
  columns?: string[];
  rows?: any[][];
};

export default function ChatMessage({ msg }: { msg: ChatMsg }) {
  const isUser = msg.role === "user";

  const renderTable = () => {
    if (!msg.columns || !msg.rows) return null;

    return (
      <div className="overflow-x-auto mt-2">
        <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden text-sm shadow-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              {msg.columns.map((col, idx) => (
                <th key={idx} className="px-3 py-2 text-left font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {msg.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 border-t border-gray-200">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-2 mb-4 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* Avatar/Icon */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <Bot size={18} className="text-gray-600" />
        </div>
      )}

      <div
        className={`px-4 py-3 rounded-2xl max-w-xl shadow-md ${
          isUser
            ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
            : "bg-white border border-gray-200 text-gray-900"
        }`}
      >
        {/* Text */}
        <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>

        {/* Optional table */}
        {msg.type === "table" && renderTable()}
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <User size={18} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}
