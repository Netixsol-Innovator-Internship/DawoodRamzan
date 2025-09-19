"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Bot,
  User,
  Sparkles,
  MessageCircle,
  Zap,
  Loader2,
  FilePlus,
} from "lucide-react";

type Message = { role: string; content: string; id: string };

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [doc, setDoc] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- Scroll to bottom whenever new messages come ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Auto focus input ---
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // --- Load persisted chat on mount ---
  useEffect(() => {
    const savedDoc = localStorage.getItem("doc");
    const savedMessages = localStorage.getItem("messages");
    if (savedDoc) setDoc(JSON.parse(savedDoc));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // --- Save chat whenever doc or messages change ---
  useEffect(() => {
    if (doc) localStorage.setItem("doc", JSON.stringify(doc));
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [doc, messages]);

  // --- Upload file ---
  const uploadFile = async () => {
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "https://dawood-week8-chatbot-backend.vercel.app/documents/upload",
        formData
      );
      setDoc(res.data);

      // Show AI intro message after upload
      setMessages([
        {
          id: Date.now().toString(),
          role: "ai",
          content:
            "📄 Your document has been uploaded and processed! You can now ask me questions about it.",
        },
      ]);
    } catch (err) {
      alert("❌ Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForNewUpload = () => {
    setDoc(null);
    setMessages([]);
    setFile(null);
    setInput("");
    localStorage.removeItem("doc");
    localStorage.removeItem("messages");
  };

  // --- Ask a question ---
  const askQuestion = async () => {
    if (!doc || !input.trim()) return;
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);

    const question = input.trim();
    setInput("");

    try {
      const res = await axios.post(
        `https://dawood-week8-chatbot-backend.vercel.app/documents/${doc._id}/ask`,
        { question }
      );
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: res.data.answer,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "❌ Sorry, I encountered an error. Please try again!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Message Bubble ---
  const MessageBubble = ({ message }: { message: Message }) => {
    const isUser = message.role === "user";
    return (
      <div
        className={`flex gap-3 mb-6 ${
          isUser ? "flex-row-reverse" : "flex-row"
        } animate-in slide-in-from-bottom-2 duration-500`}
      >
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-gradient-to-r from-blue-500 to-purple-600"
              : "bg-gradient-to-r from-emerald-500 to-teal-600"
          }`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
        <div className={`max-w-[70%] ${isUser ? "text-right" : "text-left"}`}>
          <div
            className={`inline-block px-4 py-3 rounded-2xl ${
              isUser
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-tr-sm"
                : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
            }`}
          >
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    );
  };

  // --- Loading indicator ---
  const LoadingIndicator = () => (
    <div className="flex gap-3 mb-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex flex-col m-16">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 flex-shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Smart PDF Analyzer
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Upload a PDF & ask questions
            </p>
          </div>
        </div>

        {/* New Upload button */}
        {doc && (
          <button
            onClick={resetForNewUpload}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            <FilePlus className="w-4 h-4" />
            New Upload
          </button>
        )}
      </div>

      {/* Document Info */}
      {doc && (
        <div className="bg-white/70 border-b border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto max-h-[30vh] overflow-y-auto pr-2">
            <h2 className="font-semibold">Summary</h2>
            <p>{doc.summary}</p>
            <h3 className="font-semibold mt-2">Category</h3>
            <p>{doc.category}</p>
            <h3 className="font-semibold mt-2">Highlights</h3>
            <ul className="list-disc ml-6">
              {doc.highlights.map((h: string, i: number) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-6 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          {!doc ? (
            <div className="flex gap-3 items-center">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="flex-1 border p-2 rounded"
              />
              <button
                onClick={uploadFile}
                disabled={!file || isUploading}
                className="p-2 bg-blue-500 text-white rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          ) : (
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && askQuestion()
                  }
                  placeholder="Ask about this PDF..."
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 shadow-sm"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Zap className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <button
                onClick={askQuestion}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
