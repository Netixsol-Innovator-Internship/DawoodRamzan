const API_BASE = "http://localhost:4000";

// ---------------- Types ----------------
export interface User {
  followers: never[];
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  _id: string;
  username: string;
  email: string;
}

export interface Comment {
  _id: string;
  author: User;
  content: string;
  createdAt: string;
  likes?: string[];
  replies?: (string | Comment)[];
}

// ---------------- API Functions ----------------
export async function register(data: {
  email: string;
  password: string;
  username: string;
}): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function listComments(): Promise<Comment[]> {
  const res = await fetch(`${API_BASE}/comments`);
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
  return res.json();
}

export async function likeComment(token: string, id: string): Promise<Comment> {
  const res = await fetch(`${API_BASE}/comments/like/${id}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
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

  return res.json(); // returns the updated target user with followers array
}

export interface PublicUser {
  _id: string;
  username: string;
  followers: string[];
}

export async function getUserDetails(userId: string): Promise<PublicUser> {
  const res = await fetch(`${API_BASE}/users/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user details");
  return res.json();
}
