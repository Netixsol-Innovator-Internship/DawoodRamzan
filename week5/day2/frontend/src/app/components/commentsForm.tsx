"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { createComment } from "../lib/api";

interface User {
  token: string;
  id: string;
  username: string;
}

interface CommentFormProps {
  user: User | null;
  onPosted: () => void;
}

export default function CommentForm({ user, onPosted }: CommentFormProps) {
  const [text, setText] = useState<string>("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return toast.error("Please login");

    if (!text.trim()) return toast.error("Comment cannot be empty");

    await createComment(user.token, text);
    setText("");
    toast.success("Comment posted");
    onPosted();
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-5 rounded-2xl shadow-md w-full max-w-xl mx-auto transition hover:shadow-lg"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={user ? "Write a comment..." : "Login to post a comment"}
        rows={4}
        disabled={!user}
        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition text-gray-800 placeholder-gray-400"
      />
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={!user}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-xl font-semibold transition"
        >
          Post
        </button>
      </div>
    </form>
  );
}
