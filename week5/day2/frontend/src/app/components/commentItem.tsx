/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  likeComment,
  replyComment,
  toggleFollow,
  getUserDetails,
} from "../lib/api";
import type { Comment, PublicUser } from "./types";
import ReplyList from "./replyList";
import UserModal from "./userModal";
import DOMPurify from "dompurify";

interface UserLocal {
  token: string;
  id: string;
  username: string;
  followers?: string[];
}

interface CommentItemProps {
  c: Comment;
  user: UserLocal | null;
  mutate: () => void;
  authorFollowersMap: Record<string, string[]>;
  setAuthorFollowersMap: React.Dispatch<
    React.SetStateAction<Record<string, string[]>>
  >;
  socket?: any;
}

export default function CommentItem({
  c,
  user,
  mutate,
  authorFollowersMap,
  setAuthorFollowersMap,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [modalUserDetails, setModalUserDetails] = useState<PublicUser | null>(
    null
  );

  const authorId = c.author?._id;

  // Fetch author's followers if not cached
  useEffect(() => {
    async function fetchAuthorFollowers() {
      if (authorId && !authorFollowersMap[authorId]) {
        try {
          const details = await getUserDetails(authorId);
          setAuthorFollowersMap((prev) => ({
            ...prev,
            [authorId]: details?.followers || [],
          }));
        } catch (err) {
          console.error("Failed to fetch author followers", err);
        }
      }
    }
    fetchAuthorFollowers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorId]);

  const authorFollowers = authorId ? authorFollowersMap[authorId] || [] : [];
  const isFollowing = user ? authorFollowers.includes(user.id) : false;

  const initials = c.author?.username
    ? c.author.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  async function handleToggleLike() {
    if (!user) return toast.error("Login first");
    try {
      await likeComment(user.token, c._id);
      mutate();
    } catch (err) {
      console.error(err);
      toast.error("Failed to like");
    }
  }

  async function handleSubmitReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return toast.error("Login first");
    if (!replyText.trim()) return toast.error("Reply cannot be empty");

    try {
      await replyComment(user.token, c._id, replyText.trim());
      setReplyText("");
      setShowReply(true);
      mutate();
      toast.success("Replied ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  }

  async function handleFollowToggle() {
    if (!user || !authorId)
      return toast.error("Cannot follow/unfollow this user");

    try {
      await toggleFollow(user.token, authorId);
      const details = await getUserDetails(authorId);
      const updatedFollowers: string[] = details?.followers || [];

      setAuthorFollowersMap((prev) => ({
        ...prev,
        [authorId]: updatedFollowers,
      }));

      toast.success(
        updatedFollowers.includes(user.id)
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
      setModalUserDetails({
        ...details,
        followers: details?.followers || [],
      });
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

      {/* Render sanitized HTML.
          We trust content is HTML produced by our editor conversion,
          still sanitize it before inserting into DOM. */}
      <div
        className="mt-3 text-gray-900 prose max-w-full break-words"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(c.content, {
            USE_PROFILES: { html: true },
          }),
        }}
      ></div>

      <div className="flex gap-4 mt-3 text-sm">
        <button
          onClick={handleToggleLike}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition font-medium"
        >
          👍 ({c.likes?.length || 0})
        </button>
        <button
          onClick={() => setShowReply(!showReply)}
          className="flex items-center gap-1 text-green-600 hover:text-green-800 transition font-medium"
        >
          💬 Reply ({(c.replies && c.replies.length) || 0})
        </button>
      </div>

      {showReply && (
        <>
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

          <ReplyList replies={c.replies} />
        </>
      )}

      {showUserModal && modalUserDetails && (
        <UserModal
          user={user}
          modalUserDetails={modalUserDetails}
          setModalUserDetails={setModalUserDetails}
          setAuthorFollowersMap={setAuthorFollowersMap}
          onClose={() => setShowUserModal(false)}
        />
      )}
    </div>
  );
}
