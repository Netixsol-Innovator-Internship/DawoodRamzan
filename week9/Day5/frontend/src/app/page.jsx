"use client";
import { useState, useEffect, useRef } from "react";
import { authService } from "./auth";
import { useRouter } from "next/navigation";
import { useSpeechToText } from "./speech";
import { useTextToSpeech } from "./text";
import { Mic, MicOff, Send, Volume2, Pause } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ailoading, setAiLoading] = useState(false);
  const router = useRouter();

  const { transcript, listening, startListening, stopListening } =
    useSpeechToText();
  const { speak, stop } = useTextToSpeech();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  const [speakingMsgIndex, setSpeakingMsgIndex] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const sendChatMessage = async () => {
    if (!(chatInput || transcript).trim()) return;

    const textToSend = chatInput || transcript;
    const userMsg = { sender: "You", text: textToSend };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    const userId = "68d650a142f7709d2f63245f";

    try {
      setAiLoading(true);
      const res = await fetch("http://localhost:4000/ask/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, question: textToSend }),
      });
      const data = await res.json();

      let botMessages = [];

      if (data.response) {
        botMessages.push({ sender: "Bot", text: data.response });
        speak(data.response);
        setSpeakingMsgIndex(chatMessages.length + botMessages.length - 1);
      }

      if (data.products && data.products.length > 0) {
        const productMessages = data.products.map((product) => ({
          sender: "Bot",
          product,
        }));
        botMessages = [...botMessages, ...productMessages];
      }

      if (botMessages.length === 0) {
        const fallback = { sender: "Bot", text: "No response received." };
        botMessages.push(fallback);
        speak(fallback.text);
        setSpeakingMsgIndex(chatMessages.length + botMessages.length - 1);
      }

      setChatMessages((prev) => [...prev, ...botMessages]);
    } catch (error) {
      console.error("Chat error:", error);
      const errMsg = "⚠️ Error contacting AI.";
      setChatMessages((prev) => [...prev, { sender: "Bot", text: errMsg }]);
      speak(errMsg);
      setSpeakingMsgIndex(chatMessages.length);
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = () => {
    authService.clearAuthData();
    router.push("/login");
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  const fetchProducts = async (name = "") => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:4000/products${name ? `?name=${name}` : ""}`
      );
      const data = await response.json();
      setProducts(data.products);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const toggleSpeak = (msg, idx) => {
    if (speakingMsgIndex === idx) {
      stop();
      setSpeakingMsgIndex(null);
    } else {
      stop();
      speak(msg.text);
      setSpeakingMsgIndex(idx);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500/80 via-teal-300 to-green-500/80 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-white drop-shadow">
            NatureCare Remedies 🌿
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg shadow-md hover:bg-teal-700 transition"
          >
            Logout
          </button>
        </div>

        {/* Search & Chat */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <input
            type="text"
            placeholder="Search products by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:max-w-4xl px-6 py-3 rounded-xl bg-white border border-gray-300 text-sm text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Ask Our AI Assistant 🤖
          </button>
        </div>

        {/* Products Grid / Pagination */}
        {!loading && products.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-xl bg-white/70">
            <p className="text-gray-700 text-xl font-medium">
              🔍 No matching products found. Try a different search term or{" "}
              <button
                onClick={() => setIsChatOpen(true)}
                className="text-green-600 hover:text-green-700 font-bold underline"
              >
                ask the AI
              </button>
              !
            </p>
          </div>
        ) : loading ? (
          <div className="text-center py-16 animate-pulse text-white">
            Fetching products...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-6 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-green-200 hover:border-green-500 transform hover:-translate-y-1 transition"
                >
                  <h2 className="text-xl font-bold text-teal-700 leading-snug mb-2">
                    {product.name}
                  </h2>
                  {product.price && (
                    <p className="text-lg font-extrabold text-green-600">
                      ${product.price}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm italic mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-gray-600 text-sm italic mb-4 line-clamp-2">
                    Ingredients:{product.ingredients}
                  </p>
                  <p className="text-white text-sm italic mb-4 line-clamp-2 bg-blue-400 w-fit px-1.5 rounded">
                    {product.brand}
                  </p>
                </div>
              ))}
            </div>
            {products.length > productsPerPage && (
              <div className="flex justify-center items-center gap-6 mt-10">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-teal-600 text-white rounded-full shadow disabled:opacity-50"
                >
                  ⬅ Back
                </button>
                <span className="text-white font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-teal-600 text-white rounded-full shadow disabled:opacity-50"
                >
                  Forward ➡
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Chat Widget */}
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
          isChatOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="w-80 md:w-100 h-[260px] md:h-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 text-white font-bold flex justify-between items-center">
            <span className="text-lg">AI Health Assistant 🩺</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-xl p-1 rounded-full hover:bg-green-600/30"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto text-sm space-y-3 bg-gray-50 chat-scroll">
            {ailoading ? (
              <div className="animate-pulse text-gray-500">Searching...</div>
            ) : (
              chatMessages.map((msg, idx) => {
                const isUser = msg.sender === "You";
                const bgColor = isUser ? "bg-green-100" : "bg-teal-100";
                const alignClass = isUser ? "self-end" : "self-start";
                const senderColor = isUser ? "text-green-800" : "text-teal-800";

                if (msg.product) {
                  return (
                    <div
                      key={idx}
                      className={`max-w-[85%] p-4 rounded-xl shadow-md ${bgColor} ${alignClass}`}
                    >
                      <strong className={`${senderColor} mb-2 block`}>
                        {msg.sender}: Product Found!
                      </strong>
                      <p className="font-bold text-teal-900">
                        {msg.product.name}
                      </p>
                      <p className="font-bold text-teal-900">
                        Category:{msg.product.category}
                      </p>
                      <p className="font-bold text-teal-900">
                        Ingredients:{msg.product.ingredients}
                      </p>
                       <p className="font-bold text-teal-900">
                        
                        Dosage:{msg.product.dosage}
                      </p>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-3 rounded-xl shadow-sm flex items-center justify-between gap-2 ${bgColor} ${alignClass}`}
                  >
                    <div>
                      <strong className={`${senderColor} font-semibold`}>
                        {msg.sender}:
                      </strong>{" "}
                      <span className="text-gray-800">{msg.text}</span>
                    </div>
                    {msg.sender === "Bot" && (
                      <button
                        onClick={() => toggleSpeak(msg, idx)}
                        className="p-1 rounded-full hover:bg-gray-200 text-teal-600"
                      >
                        {speakingMsgIndex === idx ? (
                          <Pause size={16} />
                        ) : (
                          <Volume2 size={16} />
                        )}
                      </button>
                    )}
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input fixed at bottom */}
          <div className="border-t border-gray-200 bg-white p-2">
            <div className="flex items-center w-full bg-gray-100 rounded-full px-3 py-2 shadow-inner">
              <button
                onClick={listening ? stopListening : startListening}
                className={`mr-2 p-2 rounded-full ${
                  listening
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                {listening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input
                type="text"
                placeholder={
                  listening ? "Listening..." : "Type a message or use mic..."
                }
                className="flex-1 bg-transparent text-sm focus:outline-none px-2"
                value={chatInput || transcript}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleChatKeyDown}
              />
              <button
                onClick={sendChatMessage}
                disabled={!(chatInput || transcript).trim()}
                className="ml-2 p-2 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-white from-green-500 to-teal-500 text-white rounded-full shadow-xl flex items-center justify-center text-3xl hover:opacity-90 transition z-50"
        >
          🤖
        </button>
      )}

      <style jsx global>{`
        .chat-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background-color: #22c55e;
          border-radius: 4px;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background-color: #e5e7eb;
        }
      `}</style>
    </main>
  );
}
