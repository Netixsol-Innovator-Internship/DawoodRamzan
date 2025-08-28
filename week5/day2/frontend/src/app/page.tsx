/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";
import { listComments } from "./lib/api";
import { getSocket } from "./lib/socket";
import CommentList from "./components/commentList";
import CommentForm from "./components/commentsForm";
import Profile from "./components/profile";
import { UserCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  token: string;
  id: string;
  username: string;
  bio?: string;
  followers: string[];
}

// Ensure author is always defined
export interface Comment {
  _id: string;
  author: { _id: string; username: string };
  content: string;
  createdAt: string;
  likes?: string[];
  replies?: Comment[];
}

interface NotificationPayload {
  type: string;
  [key: string]: unknown;
}

// Helper: normalize replies recursively
function normalizeReplies(replies: any[] | undefined): Comment[] | undefined {
  if (!replies) return undefined;
  return replies.map((r) => {
    if (typeof r === "string") {
      // plain string -> wrap as Comment
      return {
        _id: Math.random().toString(36).substring(2, 9),
        author: { _id: "unknown", username: "Unknown" },
        content: r,
        createdAt: new Date().toISOString(),
        replies: [],
        likes: [],
      };
    } else {
      return {
        _id: r._id,
        author: r.author || { _id: "unknown", username: "Unknown" },
        content: r.content,
        createdAt: r.createdAt,
        likes: r.likes || [],
        replies: normalizeReplies(r.replies),
      };
    }
  });
}

// Fetch comments and normalize
async function fetcher(): Promise<Comment[]> {
  const comments = await listComments();
  return comments.map((c) => ({
    ...c,
    author: c.author || { _id: "unknown", username: "Unknown" },
    replies: normalizeReplies(c.replies),
    likes: c.likes || [],
  }));
}

export default function Home() {
  const { data, mutate } = useSWR<Comment[]>("comments", fetcher, {
    refreshInterval: 0,
  });
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Load user from localStorage
  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) setUser(JSON.parse(raw) as User);
  }, []);

  // WebSocket notifications
  useEffect(() => {
    if (user) {
      const socket = getSocket(user.id);

      socket.on("notification", (data: unknown) => {
        const payload = data as NotificationPayload;
        if (payload?.type) {
          toast(() => <span>🔔 {payload.type}</span>);
        }
      });

      return () => {
        socket.off("comment:new");
        socket.off("notification");
      };
    }
  }, [user, mutate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 py-10 px-6 md:px-20">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight">
          💬 Realtime Comments
        </h1>

        {user && (
          <button
            onClick={() => setShowProfile(true)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-200 transition"
          >
            <UserCircle className="w-8 h-8 text-blue-600" />
          </button>
        )}
      </div>

      {!user && !showAuth && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
          >
            Login / Sign Up
          </button>
        </div>
      )}

      {!user && showAuth && (
        <AuthPanel
          onLogin={(u) => {
            localStorage.setItem("auth", JSON.stringify(u));
            setUser(u);
            setShowAuth(false);
          }}
        />
      )}

      {user && (
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-md">
            <span className="text-gray-700">
              Signed in as <b>{user.username}</b>
            </span>
            <button
              onClick={() => {
                localStorage.removeItem("auth");
                setUser(null);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg transition"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {user && (
        <div className="max-w-4xl mx-auto space-y-6">
          <CommentForm user={user} onPosted={() => mutate()} />
          <CommentList comments={data || []} mutate={mutate} user={user} />
        </div>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && user && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative"
            >
              <button
                onClick={() => setShowProfile(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              <Profile userId={user.id} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------- AuthPanel ----------------
interface AuthPanelProps {
  onLogin: (user: User) => void;
}

function AuthPanel({ onLogin }: AuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const baseUrl = "https://dawood-week5-day3-backend.vercel.app";

    if (mode === "login") {
      const res = await (
        await fetch(`${baseUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
      ).json();

      if (res.access_token) {
        onLogin({
          token: res.access_token,
          id: res.user.id,
          username: res.user.username,
          bio: res.user.bio || "",
          followers: res.user.followers || [],
        });
      } else {
        toast.error("Login failed");
        alert("login Failed");
      }
    } else {
      const res = await (
        await fetch(`${baseUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username, bio }),
        })
      ).json();

      if (res._id)
        toast.success("Registered —Click on login below and log in now");
    }
  }

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl mx-auto mb-8 transition">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={submit} className="space-y-5">
        {mode === "register" && (
          <>
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </>
        )}
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all duration-200"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>
      </form>
      <div className="text-center mt-4 text-gray-600">
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="text-blue-600 hover:underline font-medium"
        >
          {mode === "login"
            ? "Don't have an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </div>
  );
}
