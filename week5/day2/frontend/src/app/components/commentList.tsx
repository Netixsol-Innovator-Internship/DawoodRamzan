/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { getSocket } from "../lib/socket";
import toast from "react-hot-toast";
import { Comment } from "./types";
import CommentItem from "./commentItem";
import { getUserDetails } from "../lib/api";

interface User {
  token: string;
  id: string;
  username: string;
  followers?: string[];
}

interface CommentListProps {
  comments: Comment[] | undefined;
  mutate: () => void;
  user: User | null;
}

export default function CommentList({
  comments,

  mutate,
  user,
}: CommentListProps) {
  const [authorFollowersMap, setAuthorFollowersMap] = useState<
    Record<string, string[]>
  >({});
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    if (user) {
      const s = getSocket(user.id);
      setSocket(s);

      s.on("comment:new", async (comment: unknown) => {
        const c = comment as Comment;
        let username = "Unknown";

        // Extract authorId regardless of whether it's a string or object
        const authorId =
          typeof c.author === "string" ? c.author : (c.author as any)?._id;

        // 👇 Skip showing toast if current user is the author
        if (authorId === user.id) {
          console.log("🙅 Skipping toast: comment is from current user");
          return;
        }

        console.log("📥 Incoming comment from socket:", c);

        if (typeof c.author === "string") {
          const userDetails = await getUserDetails(c.author);
          console.log("🔎 Resolved user details:", userDetails);
          username = userDetails.username;
        } else {
          console.log("👤 Author object received:", c.author);
          username = (c.author as any)?.username || "Unknown";
        }

        console.log("✅ Final username used in toast:", username);

        toast.success(`New comment from ${username}`);
        mutate();
      });

      s.on("notification", (data: any) => {
        if (data.payload?.type === "reply") {
          toast(`Reply from ${data.payload.from}: "${data.payload.content}"`);
        }
      });

      return () => {
        s.off("comment:new");
        s.off("notification");
      };
    }
  }, [user, mutate]);

  useEffect(() => {
    const interval = setInterval(() => {
      mutate();
    }, 5000);
    return () => clearInterval(interval);
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
          socket={socket} // ✅ keep passing socket
        />
      ))}
    </div>
  );
}
