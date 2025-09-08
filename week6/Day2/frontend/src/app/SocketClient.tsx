"use client";

import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";

let socket: Socket | null = null;

export default function SocketClient() {
  useEffect(() => {
    if (!socket) {
      const url =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://dawoodweek6hackathon.vercel.app";
      socket = io(url, { transports: ["websocket"], withCredentials: false });
      socket.on("connect", () => {
        // Connected
      });
      socket.on(
        "purchase",
        (payload: { user: string; product?: string; message: string }) => {
          const text =
            payload?.message ||
            `${payload?.user} bought ${payload?.product ?? "an item"}`;
          toast.info(text, { autoClose: 3000 });
          console.log(text + "--------------------" + "*********************");
        }
      );
      socket.on(
        "add",
        (payload: { user: string; product?: string; message: string }) => {
          const text =
            payload?.message ||
            `${payload?.user} added ${payload?.product ?? "an item"}`;
          toast.info(text, { autoClose: 3000 });
          console.log(text + "--------------------" + "*********************");
        }
      );
    }
    return () => {
      // keep socket for app lifetime to avoid multiple connections
    };
  }, []);

  return null;
}
