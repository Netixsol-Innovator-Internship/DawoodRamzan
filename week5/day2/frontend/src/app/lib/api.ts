/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/api.ts
const API_BASE = "https://dawood-week5-day3-backend.vercel.app/";

// ---------------- Types ----------------
import type { Comment, PublicUser, User } from "../components/types";

export async function register(data: {
  email: string;
  password: string;
  username: string;
  bio: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Register failed");
  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function listComments(): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function createComment(
  token: string,
  content: string
): Promise<Comment> {
  const res = await fetch(`${API_BASE}/comments/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
}

export async function replyComment(
  token: string,
  parentId: string,
  content: string
): Promise<Comment> {
  const res = await fetch(`${API_BASE}/comments/reply/${parentId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Failed to reply to comment");
  return res.json();
}

export async function likeComment(token: string, id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/comments/like/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to like comment");
  return res.json();
}

export async function toggleFollow(
  token: string,
  targetId: string
): Promise<User> {
  const res = await fetch(`${API_BASE}/users/follow/${targetId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Failed to toggle follow");
  }

  return res.json();
}

export async function getUserDetails(userId: string): Promise<PublicUser> {
  const res = await fetch(`${API_BASE}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
}

/**
 * Try to fetch a comment by id. This assumes the backend exposes:
 * GET /comments/:id -> returns a Comment
 *
 * If your backend instead exposes GET /comments/thread/:parentId, change this function.
 */
export async function getCommentById(commentId: string): Promise<Comment> {
  const res = await fetch(`${API_BASE}/comments/${commentId}`);
  if (!res.ok) throw new Error("Failed to fetch comment by id");
  return res.json();
}
