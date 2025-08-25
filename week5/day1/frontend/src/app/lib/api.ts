export const API_BASE = "https://dawood-week5-day1-backend.vercel.app/api";

export async function fetchJSON<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export function listComments() {
  return fetchJSON<Comment[]>(`${API_BASE}/comments`, {
    cache: "no-store",
  });
}

export function createComment(payload: { text: string; author: string }) {
  return fetchJSON<Comment>(`${API_BASE}/comments`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
