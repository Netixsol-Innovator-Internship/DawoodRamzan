/* eslint-disable @typescript-eslint/no-empty-object-type */
import { io, Socket } from "socket.io-client";

// Define event types (expand as needed)
interface ServerToClientEvents {
  "comment:new": (comment: unknown) => void;
  notification: (data: { payload?: { type: string } }) => void;
}

interface ClientToServerEvents {
  // If you have client → server emits, define here
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(userId: string) {
  if (!socket) {
    socket = io("https://dawood-week5-day3-backend.vercel.app/", {
      query: { userId },
    });
  }
  return socket;
}
