"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import QuestionInput from "@/componenets/QuestionInput";

export type ChatMsg = {
  role: "user" | "assistant" | "system";
  text: string;
  type?: string;
  columns?: string[];
  rows?: any[][];
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ Check auth on mount + fetch history
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userId) {
      fetchHistory(userId);
    }
  }, [router]);

  // ✅ Fetch history API
  const fetchHistory = async (userId: string) => {
    try {
      const res = await axios.get(
        `https://cricket-stats-backend.vercel.app/matches/history/${userId}`
      );

      const historyMsgs: ChatMsg[] = [];

      res.data.forEach((item: any) => {
        historyMsgs.push({
          role: "user",
          text: item.question,
        });

        if (item.mongoResponse?.length > 0) {
          // 🔥 Exclude "_id" from columns
          const columns = Object.keys(item.mongoResponse[0] || {}).filter(
            (col) => col !== "_id"
          );

          const rows = item.mongoResponse.map((row: any) =>
            columns.map((col) => row[col])
          );

          historyMsgs.push({
            role: "assistant",
            text: item.answer || "",
            type: "table",
            columns,
            rows,
          });
        } else {
          historyMsgs.push({
            role: "assistant",
            text: item.answer || "No data found.",
          });
        }
      });

      setMessages(historyMsgs);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("id");
    router.push("/login");
  };

  // ✅ Add new messages (user + assistant)
  const handleNewAnswer = (userQ: string, assistantAns: any) => {
    // 🔥 Also exclude "_id" for live answers
    let cleanColumns = assistantAns?.columns?.filter(
      (col: string) => col !== "_id"
    );
    let cleanRows =
      assistantAns?.rows?.map((row: any[]) =>
        row.filter(
          (_: any, idx: number) => assistantAns?.columns[idx] !== "_id"
        )
      ) || [];

    setMessages((prev) => [
      ...prev,
      { role: "user", text: userQ },
      {
        role: "assistant",
        text: assistantAns?.text || "",
        ...assistantAns,
        columns: cleanColumns,
        rows: cleanRows,
      },
    ]);
  };

  // ✅ Delete Memory API call + Refresh
  const handleDeleteMemory = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) return;

    setLoading(true);
    try {
      await axios.delete(`https://cricket-stats-backend.vercel.app/matches/memory/${userId}`);
      window.location.reload();
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", text: "❌ Failed to clear memory." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch Summary API call
  const handleSummary = async () => {
    const userId = localStorage.getItem("id");
    if (!userId) return;

    setLoading(true);
    try {
      const res = await axios.get(
        `https://cricket-stats-backend.vercel.app/matches/summary/${userId}`
      );
      setMessages((prev) => [
        ...prev,
        { role: "system", text: "📊 Summary Report" },
        { role: "assistant", text: res.data.summary || "", ...res.data },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "system", text: "❌ Failed to fetch summary." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated: Table with margin from right (not full width)
  const renderTable = (data: ChatMsg) => {
    if (!data?.columns || !data?.rows) return null;

    return (
      <div className="overflow-x-auto min-w-full">
        {data.text && (
          <div className="mb-2 text-sm text-gray-700">{data.text}</div>
        )}

        <table className="border border-gray-300 rounded-xl overflow-hidden shadow min-w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              {data.columns.map((col: string, idx: number) => (
                <th
                  key={idx}
                  className="px-3 py-2 text-left text-sm font-semibold"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row: any[], rIdx: number) => (
              <motion.tr
                key={rIdx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: rIdx * 0.05 }}
                className={rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                {row.map((cell, cIdx: number) => (
                  <td
                    key={cIdx}
                    className="px-3 py-2 text-sm border-t border-gray-200"
                  >
                    {cell}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-start p-6">
      <div className="max-w-6xl w-full flex flex-col">
        {/* ✅ Sticky Navbar */}
        <div className="sticky top-0 z-50  p-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2">
              <button
                onClick={handleDeleteMemory}
                disabled={loading}
                className={`px-4 py-2 rounded-xl shadow font-medium cursor-pointer ${
                  loading
                    ? " cursor-not-allowed bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-yellow-600 hover:bg-yellow-700 text-white"
                }`}
              >
                🧹 Delete Memory
              </button>
              <button
                onClick={handleSummary}
                disabled={loading}
                className={`px-4 py-2 rounded-xl shadow font-medium cursor-pointer ${
                  loading
                    ? " cursor-not-allowed bg-green-600 hover:bg-green-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                📊 Summary
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-300 hover:bg-red-500 border-2 border-red-700 text-white rounded-xl shadow font-medium cursor-pointer"
            >
               Logout
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold text-blue-700 drop-shadow">
            🏏 Cricket Stats Assistant
          </h1>
          <p className="mt-3 text-lg text-gray-700 max-w-2xl mx-auto">
            Ask natural language questions about cricket stats and get instant
            answers in clean tables and summaries.
          </p>
        </motion.div>

        {/* Empty State */}
        <AnimatePresence>
          {!loading && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center py-12 px-6 mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg text-white"
            >
              <span className="text-7xl mb-4">🏟️</span>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to the Cricket Arena!
              </h2>
              <p className="max-w-md text-blue-100">
                Start by asking your cricket question below ⬇️ <br />
                We’ll fetch stats and display them beautifully for you.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conversation - Scrollable */}
        <div className="flex-1  pr-2 space-y-4 mb-24">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`p-4 rounded-2xl shadow border mb-4 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white self-end ml-auto w-fit max-w-3xl"
                  : msg.role === "system"
                  ? "bg-gray-100  text-blue-600 w-fit max-w-md self-end ml-auto text-md font-bold"
                  : "bg-white border-blue-900 text-gray-900 max-w-[95%] mr-10"
              }`}
            >
              {msg.role === "user" && <p>{msg.text}</p>}

              {msg.role === "assistant" && (
                <>
                  {msg.type === "table" ? (
                    renderTable(msg)
                  ) : typeof msg.text === "string" ? (
                    <p>{msg.text}</p>
                  ) : (
                    <pre className="text-sm bg-gray-100 p-2 rounded-xl m-10">
                      {JSON.stringify(msg, null, 2)}
                    </pre>
                  )}
                </>
              )}

              {msg.role === "system" && <p>{msg.text}</p>}
            </motion.div>
          ))}

          {/* Loading Indicator */}
          {loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatType: "mirror",
              }}
              className="text-blue-700 font-medium text-center"
            >
              Fetching stats...
            </motion.p>
          )}
        </div>

        {!loading && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className=" p-5 bg-white/90 border border-blue-200 rounded-xl shadow-sm"
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              💡 Try asking:
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Who scored the most runs in ODI cricket?</li>
              <li>Show me India’s T20 highest scores.</li>
              <li>Which bowler has the best economy in Test matches?</li>
              <li>Top 5 batting performances at Lord’s.</li>
            </ul>
          </motion.div>
        )}

        {/* ✅ Sticky Question Input */}
        <div className="sticky bottom-0 z-50  p-3">
          <QuestionInput
            onAnswer={handleNewAnswer}
            onLoading={setLoading}
            disabled={loading}
          />
        </div>
      </div>
    </main>
  );
}
