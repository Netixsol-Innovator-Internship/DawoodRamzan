// app/assignments/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "framer-motion";
import { Poppins } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export default function CreateAssignment() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    wordCount: 500,
    evaluationMode: "strict" as "strict" | "loose",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // "http://localhost:3000/assignments"
      // "https://result-checker-backend.vercel.app/assignments"
      await axios.post("https://result-checker-backend.vercel.app/assignments", formData);
      toast.success("Assignment created successfully!");
      router.push("/assignments");
    } catch (error) {
      console.error("Error creating assignment:", error);
      toast.error("Failed to create assignment");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.type === "number" ? parseInt(e.target.value) : e.target.value,
    }));
  };

  return (
    <div
      className={`${poppins.className} min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12`}
    >
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-2xl mx-auto px-4">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          Create New Assignment
        </motion.h1>

        {/* Form Card */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
        >
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assignment Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="e.g., Essay on Mental Health"
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="Provide detailed assignment instructions..."
              />
            </div>

            {/* Word Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Word Count
              </label>
              <input
                type="number"
                name="wordCount"
                value={formData.wordCount}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              />
            </div>

            {/* Evaluation Mode - Radio Cards */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Evaluation Mode
              </label>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Strict */}
                <label
                  className={`flex-1 p-4 border rounded-xl cursor-pointer shadow-sm transition ${
                    formData.evaluationMode === "strict"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="evaluationMode"
                    value="strict"
                    checked={formData.evaluationMode === "strict"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span>
                    <span className="block text-md font-semibold text-gray-900">
                      Strict Marking
                    </span>
                    <span className="block text-sm text-gray-600">
                      🔴 Penalizes heavily
                    </span>
                  </span>
                </label>

                {/* Loose */}
                <label
                  className={`flex-1 p-4 border rounded-xl cursor-pointer shadow-sm transition ${
                    formData.evaluationMode === "loose"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <input
                    type="radio"
                    name="evaluationMode"
                    value="loose"
                    checked={formData.evaluationMode === "loose"}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span>
                    <span className="block text-md font-semibold text-gray-900">
                      Loose Marking
                    </span>
                    <span className="block text-sm text-gray-600">
                      🟢 More flexible
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Assignment"}
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
