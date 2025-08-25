"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import { createComment, listComments, type Comment } from "@/app/lib/api";
import { getSocket } from "@/app/lib/socket";

export default function Page() {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const { data, mutate } = useSWR<Comment[]>("comments", () => listComments());
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    const handler = (incoming: Comment) => {
      mutate(
        (prev) => {
          if (!prev) return [incoming];
          if (prev.some((c) => c.id === incoming.id)) return prev;
          return [...prev, incoming];
        },
        { revalidate: false }
      );

      if (incoming.author && incoming.author !== author) {
        toast(`${incoming.author} commented: "${incoming.text}"`);
      }

      setTimeout(
        () => listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" }),
        50
      );
    };

    socket.on("new_comment", handler);
    return () => {
      socket.off("new_comment", handler);
    };
  }, [mutate, author]);

  const canSubmit = useMemo(() => author.trim() && text.trim(), [author, text]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload = { text: text.trim(), author: author.trim() };
    try {
      const created = await createComment(payload);

      mutate(
        (prev) => {
          if (!prev) return [created];
          if (prev.some((c) => c.id === created.id)) return prev;
          return [...prev, created];
        },
        { revalidate: false }
      );

      setText("");
      setTimeout(
        () => listRef.current?.scrollTo({ top: 1e9, behavior: "smooth" }),
        50
      );
    } catch (err) {
      toast.error("Failed to post");
    }
  };

  return (
    <main className="max-w-2xl mx-auto my-10 px-4 font-sans">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-blue-600">
        💬 Realtime Comments
      </h1>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-3 mb-6">
        <input
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={50}
          className="w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <div className="flex gap-2">
          <input
            placeholder="Write a comment..."
            value={text}
            maxLength={500}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button
            disabled={!canSubmit}
            className={`px-5 py-2 rounded-lg font-semibold shadow transition-colors ${
              canSubmit
                ? "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Post
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div
        ref={listRef}
        className="border rounded-xl p-4 h-96 overflow-y-auto bg-gray-50 shadow-inner space-y-3"
      >
        {(data || []).map((c) => (
          <div
            key={c.id}
            className="bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-xs text-gray-500 mb-1">
              {new Date(c.createdAt).toLocaleString()}
            </div>
            <div className="font-semibold text-indigo-700 break-words">
              {c.author}
            </div>
            <div className="text-gray-800 break-words whitespace-pre-wrap">
              {c.text}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
