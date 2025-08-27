/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  likeComment,
  replyComment,
  toggleFollow,
  getUserDetails,
  createComment, // new comment API
} from "../lib/api";
import toast, { Toaster } from "react-hot-toast";

import { getSocket } from "../lib/socket";

// ---------------- Types ----------------
export interface PublicUser {
  _id: string;
  username: string;
  followers: string[];
}

interface User {
  token: string;
  id: string;
  username: string;
  followers?: string[];
}

interface Reply {
  _id: string;
  author: { username: string; _id: string; followers?: string[] };
  content: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  author?: { username: string; _id: string; followers?: string[] };
  content: string;
  createdAt: string;
  likes?: string[];
  replies?: (Reply | string)[];
}

interface CommentListProps {
  comments: Comment[] | undefined;
  mutate: () => void;
  user: User | null;
}

// ---------------- Component ----------------
export default function CommentList({
  comments,
  mutate,
  user,
}: CommentListProps) {
  const [authorFollowersMap, setAuthorFollowersMap] = useState<
    Record<string, string[]>
  >(
    () =>
      comments?.reduce((acc, c) => {
        if (c.author?._id) acc[c.author._id] = c.author.followers || [];
        return acc;
      }, {} as Record<string, string[]>) || {}
  );

  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const s = getSocket(user.id);
      setSocket(s);

      // Listen for broadcast notifications (new comment)
      s.on("comment:new", (comment: unknown) => {
        const c = comment as Comment; // type assertion
        toast.success(`New comment from ${c.author?.username || "Unknown"}`);
      });

      // Listen for personal notifications (reply)
      s.on("notification", (data: any) => {
        if (data.payload?.type === "reply") {
          toast(`Reply from ${data.payload.from}: "${data.payload.content}"`);
        }
      });
    }
  }, [user]);
  useEffect(() => {
    const interval = setInterval(() => {
      mutate(); // calls API and updates comments
    }, 5000); // every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [mutate]);

  if (!comments)
    return <div className="text-gray-500 text-center">Loading...</div>;
  if (!Array.isArray(comments))
    return (
      <div className="text-gray-500 text-center">No comments available</div>
    );

  return (
    <div className="space-y-4">
      {comments.map((c) => (
        <CommentItem
          key={c._id}
          c={c}
          user={user}
          mutate={mutate}
          authorFollowersMap={authorFollowersMap}
          setAuthorFollowersMap={setAuthorFollowersMap}
          socket={socket}
        />
      ))}
    </div>
  );
}

// ---------------- Comment Item ----------------
interface CommentItemProps {
  c: Comment;
  user: User | null;
  mutate: () => void;
  authorFollowersMap: Record<string, string[]>;
  setAuthorFollowersMap: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  socket: any;
}

function CommentItem({
  c,
  user,
  mutate,
  authorFollowersMap,
  setAuthorFollowersMap,
  socket,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUserDetails, setModalUserDetails] = useState<PublicUser | null>(
    null
  );

  const authorId = c.author?._id;
  const authorFollowers = authorId ? authorFollowersMap[authorId] || [] : [];
  const isFollowing = user && authorFollowers.includes(user.id);

  const initials = c.author?.username
    ? c.author.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  async function handleToggleLike() {
    if (!user) return toast.error("Login first");
    await likeComment(user.token, c._id);
    mutate();
  }

  async function handleSubmitReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return toast.error("Login first");

    const reply = await replyComment(user.token, c._id, replyText);
    setReplyText("");
    setShowReply(false);
    mutate();
    toast.success("Replied");

    // Notify only the original comment author
    if (socket && c.author?._id && c.author._id !== user.id) {
      socket.emit("notification", {
        payload: {
          type: "reply",
          to: c.author._id,
          from: user.username,
          commentId: c._id,
          content: replyText,
        },
      });
    }
  }

  async function handleFollowToggle() {
    if (!user || !authorId)
      return toast.error("Cannot follow/unfollow this user");

    try {
      const updatedUser = await toggleFollow(user.token, authorId);
      setAuthorFollowersMap((prev) => ({
        ...prev,
        [authorId]: updatedUser.followers || [],
      }));
      toast.success(
        updatedUser.followers?.includes(user.id)
          ? `Following ${c.author?.username ?? "Unknown"}`
          : `Unfollowed ${c.author?.username ?? "Unknown"}`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle follow");
    }
  }

  async function openUserModal() {
    if (!authorId) return;
    try {
      const details = await getUserDetails(authorId);
      setModalUserDetails(details ?? null);
      setShowUserModal(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load user details");
    }
  }

  return (
    <div className="border rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
            {initials}
          </div>
          <div>
            <p
              className="font-semibold text-gray-800 cursor-pointer hover:underline"
              onClick={openUserModal}
            >
              {c.author?.username || "Unknown"}
            </p>
            <p className="text-gray-400 text-xs">
              {new Date(c.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {authorId && user && authorId !== user.id && (
          <button
            onClick={handleFollowToggle}
            className={`text-sm px-3 py-1 rounded-xl font-medium transition ${
              isFollowing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <p className="mt-3 text-gray-900">{c.content}</p>

      <div className="flex gap-4 mt-3 text-sm">
        <button
          onClick={handleToggleLike}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
        >
          👍 Like ({c.likes?.length || 0})
        </button>
        <button
          onClick={() => setShowReply(!showReply)}
          className="flex items-center gap-1 text-green-600 hover:text-green-800 transition font-medium"
        >
          💬 Reply ({c.replies?.length || 0})
        </button>
      </div>

      {showReply && (
        <form onSubmit={handleSubmitReply} className="mt-3 flex gap-2">
          <input
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition text-sm"
          >
            Send
          </button>
        </form>
      )}

      {c.replies && c.replies.length > 0 && (
        <div className="mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
          {c.replies.map((r, idx) =>
            typeof r === "string" ? (
              <div key={idx} className="text-gray-400 text-sm italic">
                Reply ID: {r}
              </div>
            ) : (
              <div
                key={r._id}
                className="bg-gray-50 p-3 rounded-xl shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">
                    {r.author?.username || "Unknown"}
                  </span>{" "}
                  — {r.content}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>
      )}

      {/* User Modal */}
      {showUserModal && modalUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
              onClick={() => setShowUserModal(false)}
            >
              &times;
            </button>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center mx-auto font-bold text-2xl mb-3">
                {modalUserDetails.username
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold">
                {modalUserDetails.username}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Followers: {modalUserDetails.followers?.length || 0}
              </p>
              {user && user.id !== modalUserDetails._id && (
                <button
                  onClick={async () => {
                    try {
                      const updatedUser = await toggleFollow(
                        user.token,
                        modalUserDetails._id
                      );
                      setModalUserDetails(updatedUser);
                      setAuthorFollowersMap((prev) => ({
                        ...prev,
                        [modalUserDetails._id]: updatedUser.followers || [],
                      }));
                      toast.success(
                        updatedUser.followers?.includes(user.id)
                          ? `Following ${modalUserDetails.username}`
                          : `Unfollowed ${modalUserDetails.username}`
                      );
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to toggle follow");
                    }
                  }}
                  className={`mt-3 text-sm px-4 py-2 rounded-xl font-medium transition ${
                    modalUserDetails.followers?.includes(user.id)
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {modalUserDetails.followers?.includes(user.id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
