import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://localhost:4000", {
      // Connect to your NestJS backend
      transports: ["websocket", "polling"], // websocket first, fallback to polling
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket");
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });
  }
  return socket;
};
