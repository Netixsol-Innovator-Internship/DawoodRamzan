"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, FileText, BarChart } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export default function Home() {
  return (
    <div
      className={`${poppins.className} min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100`}
    >
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            AI Assignment Checker
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-700 mb-12 max-w-2xl mx-auto"
          >
            Automatically evaluate student assignments with AI-powered analysis.
            Save time and ensure consistent grading across all submissions.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex gap-6 justify-center"
          >
            <Link
              href="/assignments"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-md hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              View Assignments
            </Link>
            <Link
              href="/assignments/new"
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 hover:shadow-md transition-all"
            >
              Create Assignment
            </Link>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          <FeatureCard
            icon={<Brain className="w-10 h-10 text-blue-600" />}
            title="AI-Powered Evaluation"
            description="Uses advanced AI to analyze content relevance, structure, and topic alignment"
          />
          <FeatureCard
            icon={<FileText className="w-10 h-10 text-indigo-600" />}
            title="Flexible Grading Modes"
            description="Choose between strict and loose marking based on your requirements"
          />
          <FeatureCard
            icon={<BarChart className="w-10 h-10 text-purple-600" />}
            title="Automated Reports"
            description="Generate detailed mark sheets in Excel or CSV format instantly"
          />
        </motion.div>

        {/* Footer Call to Action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-24 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Ready to simplify grading?
          </h2>
          <Link
            href="/assignments/new"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-xl hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Get Started
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}
