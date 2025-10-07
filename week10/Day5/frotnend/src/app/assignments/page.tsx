// app/assignments/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, Upload, ClipboardList } from "lucide-react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

interface Assignment {
  _id: string;
  title: string;
  instructions: string;
  wordCount: number;
  evaluationMode: "strict" | "loose";
  createdAt: string;
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        "https://result-checker-backend.vercel.app/assignments"
        // "http://localhost:3000/assignments"
      );
      setAssignments(response.data);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-lg font-medium text-gray-700"
        >
          Loading assignments...
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className={`${poppins.className} min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12`}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Assignments
          </motion.h1>
          <Link
            href="/assignments/new"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            + Create Assignment
          </Link>
        </div>

        {/* Empty State */}
        {assignments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200"
          >
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              No assignments created yet
            </h2>
            <p className="text-gray-600 mb-6">
              Create your first assignment to start evaluating student
              submissions.
            </p>
            <Link
              href="/assignments/new"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Create Your First Assignment
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {assignments.map((assignment) => (
              <AssignmentCard key={assignment._id} assignment={assignment} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AssignmentCard({ assignment }: { assignment: Assignment }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <FileText className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-700">
        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Word Count:</span>
          <span>{assignment.wordCount}</span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Grading Mode:</span>
          <span
            className={`font-semibold ${
              assignment.evaluationMode === "strict"
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {assignment.evaluationMode === "strict" ? "Strict" : "Loose"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-medium text-gray-600">Created:</span>
          <span>{new Date(assignment.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-6 line-clamp-3">
        {assignment.instructions}
      </p>

      <div className="flex gap-3">
        <Link
          href={`/assignments/${assignment._id}`}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium shadow hover:shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
        >
          View Details
        </Link>
        <Link
          href={`/assignments/${assignment._id}/upload`}
          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-center py-2 px-4 rounded-lg text-sm font-medium shadow hover:shadow-md hover:from-green-700 hover:to-emerald-700 transition-all"
        >
          Upload
        </Link>
      </div>
    </motion.div>
  );
}
