import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export function getSocket() {
  if (!socket) {
    socket = io("https://dawood-week5-day1-backend.vercel.app/comments", {
      withCredentials: true,
      transports: ["polling", "websocket"],
    });
  }
  return socket;
}
