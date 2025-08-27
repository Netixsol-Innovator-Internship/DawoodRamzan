"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import toast, { Toaster } from "react-hot-toast";
import { listComments } from "./lib/api";
import { getSocket } from "./lib/socket";
import CommentList from "./components/commentList";
import CommentForm from "./components/commentsForm";

interface User {
  token: string;
  id: string;
  username: string;
  followers: string[]; // follower IDs
}

interface Comment {
  _id: string;
  author: { _id: string; username: string };
  content: string;
  createdAt: string;
}

interface NotificationPayload {
  type: string;
  [key: string]: any;
}

async function fetcher(): Promise<Comment[]> {
  return listComments();
}

// --- Follow/Unfollow API calls ---
async function followUser(token: string, targetUserId: string) {
  await fetch(`http://localhost:4000/users/${targetUserId}/follow`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function unfollowUser(token: string, targetUserId: string) {
  await fetch(`http://localhost:4000/users/${targetUserId}/unfollow`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// --- FollowButton Component ---
interface FollowButtonProps {
  user: User;
  targetUserId: string;
  token: string;
  onUpdate: () => void;
}

function FollowButton({
  user,
  targetUserId,
  token,
  onUpdate,
}: FollowButtonProps) {
  const [loading, setLoading] = useState(false);
  const isFollowing = user.followers?.includes(targetUserId);

  const handleClick = async () => {
    setLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(token, targetUserId);
        toast.success("Unfollowed");
      } else {
        await followUser(token, targetUserId);
        toast.success("Followed");
      }

      // Refresh user data
      const res = await fetch(`http://localhost:4000/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json());
      console.log(res);
      onUpdate(); // refresh comments if needed
      localStorage.setItem("auth", JSON.stringify(res)); // update localStorage
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-3 py-1 rounded-lg font-semibold transition ${
        isFollowing
          ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

// --- Main Component ---
export default function Home() {
  const { data, mutate } = useSWR<Comment[]>("comments", fetcher, {
    refreshInterval: 0,
  });
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("auth");
    if (raw) setUser(JSON.parse(raw) as User);
  }, []);

  useEffect(() => {
    if (user) {
      const socket = getSocket(user.id);
      socket.on("comment:new", () => {
        toast.success("New comment posted");
        mutate();
      });
      socket.on("notification", (n: { payload?: NotificationPayload }) => {
        toast(() => <span>Notification: {n.payload?.type}</span>);
      });
      return () => {
        socket.off("comment:new");
        socket.off("notification");
      };
    }
  }, [user, mutate]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-20">
      <Toaster position="top-right" />
      <h1 className="text-4xl font-extrabold text-center mb-10 text-blue-600">
        Realtime Comments
      </h1>

      {/* Login/Sign Up Trigger */}
      {!user && !showAuth && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAuth(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Login / Sign Up
          </button>
        </div>
      )}

      {/* Auth Panel */}
      {!user && showAuth && (
        <AuthPanel
          onLogin={(u) => {
            localStorage.setItem("auth", JSON.stringify(u));
            setUser(u);
            setShowAuth(false);
          }}
        />
      )}

      {/* Signed-in info */}
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

      {/* Comments Section — visible only when logged in */}
      {user && (
        <div className="grid md:grid-cols-1 gap-8">
          <CommentForm user={user} onPosted={() => mutate()} />
          <CommentList
            comments={data || []}
            mutate={mutate}
            user={user}
            FollowButton={FollowButton} // pass FollowButton to CommentList
          />
        </div>
      )}
    </div>
  );
}

// ---------------- AuthPanel ----------------
interface AuthPanelProps {
  onLogin: (user: User) => void;
}

function AuthPanel({ onLogin }: AuthPanelProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [mode, setMode] = useState<"login" | "register">("login");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const baseUrl = "http://localhost:4000";

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
          followers: res.user.followers || [],
        });
      } else {
        toast.error("Login failed");
      }
    } else {
      const res = await (
        await fetch(`${baseUrl}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, username }),
        })
      ).json();

      if (res._id) toast.success("Registered — log in now");
    }
  }

  return (
    <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg mx-auto mb-8 transition">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        {mode === "login" ? "Login" : "Sign Up"}
      </h2>
      <form onSubmit={submit} className="space-y-5">
        {mode === "register" && (
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
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
