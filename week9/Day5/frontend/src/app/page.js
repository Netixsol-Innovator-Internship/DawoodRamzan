"use client";
import { useState, useEffect, useRef } from "react";
import { authService } from "./auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [ailoading, setAiLoading] = useState(false);
  const router = useRouter();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: "You", text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");

    const userId = "68d650a142f7709d2f63245f";

    try {
      setAiLoading(true);
      const res = await fetch(
        "https://dawood-healthcare.vercel.app/ask/question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, question: chatInput }),
        }
      );
      const data = await res.json();

      let botMessages = [];

      if (data.response) {
        botMessages.push({ sender: "Bot", text: data.response });
      }

      if (data.products && data.products.length > 0) {
        const productMessages = data.products.map((product) => ({
          sender: "Bot",
          product,
        }));
        botMessages = [...botMessages, ...productMessages];
      }

      if (botMessages.length === 0) {
        botMessages.push({ sender: "Bot", text: "No response received." });
      }

      setChatMessages((prev) => [...prev, ...botMessages]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatMessages((prev) => [
        ...prev,
        { sender: "Bot", text: "⚠️ Error contacting AI." },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleLogout = () => {
    authService.clearAuthData();
    router.push("/login");
  };

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter") {
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
        `https://dawood-healthcare.vercel.app/products${
          name ? `?name=${name}` : ""
        }`
      );
      const data = await response.json();
      setProducts(data.products);
      setCurrentPage(1); // reset to page 1 on new fetch
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

  // Pagination logic
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

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 p-6">
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
            className="w-full md:max-w-4xl px-6 py-3 rounded-xl border border-gray-300 text-sm text-gray-800 shadow focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />

          <button
            onClick={() => setIsChatOpen(true)}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition"
          >
            Ask Our AI Assistant 🤖
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-pulse">
              <p className="text-white text-lg font-semibold drop-shadow">
                Fetching products...
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="p-6 bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-green-200 hover:border-green-500 transform hover:-translate-y-1 transition"
                >
                  <div className="flex justify-between items-baseline mb-4 border-b pb-2 border-gray-100">
                    <h2 className="text-xl font-bold text-teal-700 leading-snug">
                      {product.name}
                    </h2>
                    {product.price && (
                      <p className="text-lg font-extrabold text-green-600 ml-4">
                        ${product.price}
                      </p>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-gray-600 text-sm mb-4 italic line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="space-y-1 text-sm">
                    <p className="text-gray-700">
                      <span className="font-semibold text-teal-800">
                        Brand:
                      </span>{" "}
                      {product.brand}
                    </p>
                    <p className="text-gray-700">
                      <span className="font-semibold text-teal-800">
                        Category:
                      </span>{" "}
                      {product.category}
                    </p>
                    <p className="text-gray-700 line-clamp-1">
                      <span className="font-semibold text-teal-800">
                        Ingredients:
                      </span>{" "}
                      {product.ingredients}
                    </p>
                    <p className="text-gray-700 line-clamp-1">
                      <span className="font-semibold text-teal-800">
                        Dosage:
                      </span>{" "}
                      {product.dosage}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {products.length > productsPerPage && (
              <div className="flex justify-center items-center gap-6 mt-10">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 transition disabled:opacity-50"
                >
                  ⬅ Back
                </button>
                <span className="text-white font-semibold">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-teal-600 text-white rounded-full shadow hover:bg-teal-700 transition disabled:opacity-50"
                >
                  Forward ➡
                </button>
              </div>
            )}
          </>
        )}

        {!loading && products.length === 0 && (
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
        <div className="w-80 md:w-96 bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 px-4 py-3 text-white font-bold flex justify-between items-center">
            <span className="text-lg">AI Health Assistant 🩺</span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-xl p-1 rounded-full hover:bg-green-600/30"
            >
              ✕
            </button>
          </div>

          <div className="p-4 h-80 max-h-96 overflow-y-auto text-sm space-y-3 bg-gray-50 chat-scroll">
            {ailoading ? (
              <div className="animate-pulse text-gray-500">Searching...</div>
            ) : (
              chatMessages.map((msg, idx) => {
                const isUser = msg.sender === "You";
                const bgColor = isUser ? "bg-green-100" : "bg-teal-100";
                const alignClass = isUser ? "self-end" : "self-start";
                const senderColor = isUser ? "text-green-800" : "text-teal-800";

                if (msg.product) {
                  const p = msg.product;
                  return (
                    <div
                      key={idx}
                      className={`max-w-[85%] p-4 rounded-xl shadow-md border border-green-200 ${bgColor} ${alignClass}`}
                    >
                      <strong className={`${senderColor} text-base mb-2`}>
                        {msg.sender}: Product Found!
                      </strong>
                      <div className="text-xs space-y-1 text-gray-700">
                        <p className="font-bold text-teal-900">{p.name}</p>
                        <p>
                          <span className="font-medium">Price:</span>{" "}
                          <span className="text-green-600 font-bold">
                            ${p.price}
                          </span>
                        </p>
                        <p className="line-clamp-2">
                          <span className="font-medium">Description:</span>{" "}
                          {p.description}
                        </p>
                        <p>
                          <span className="font-medium">Brand:</span> {p.brand}
                        </p>
                        <p>
                          <span className="font-medium">Ingredient:</span>{" "}
                          {p.ingredients}
                        </p>
                        <p>
                          <span className="font-medium">Dosage:</span>{" "}
                          {p.dosage}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    className={`max-w-[85%] p-3 rounded-xl shadow-sm ${bgColor} ${alignClass}`}
                  >
                    <strong className={`${senderColor} font-semibold`}>
                      {msg.sender}:
                    </strong>{" "}
                    <span className="text-gray-800">{msg.text}</span>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-gray-300 flex items-center bg-white p-2">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 text-sm focus:outline-none"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleChatKeyDown}
            />
            <button
              onClick={sendChatMessage}
              className="px-3 py-1 text-2xl text-green-600 hover:text-teal-700 transition disabled:opacity-50"
              disabled={!chatInput.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      </div>

      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full shadow-xl flex items-center justify-center text-3xl hover:opacity-90 transition z-50"
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
