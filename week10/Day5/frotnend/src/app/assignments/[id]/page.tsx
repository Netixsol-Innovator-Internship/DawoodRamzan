// app/assignments/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

interface Assignment {
  _id: string;
  title: string;
  instructions: string;
  wordCount: number;
  evaluationMode: "strict" | "loose";
  createdAt: string;
}

interface Submission {
  _id: string;
  studentName: string;
  rollNumber: string;
  fileName: string;
  score: number;
  wordCount: number;
  remarks: string;
  status: "pending" | "processed" | "error";
  submittedAt: string;
}

export default function AssignmentDetail() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchAssignmentData();
  }, [assignmentId]);

  const fetchAssignmentData = async () => {
    try {
      const [assignmentRes, submissionsRes] = await Promise.all([
        axios.get(
          `https://result-checker-backend.vercel.app/assignments/${assignmentId}/submissions`
          // `http://localhost:3000/assignments/${assignmentId}/submissions`
        ),
        axios.get(
          `https://result-checker-backend.vercel.app/assignments/${assignmentId}/submissions`
          // `http://localhost:3000/assignments/${assignmentId}/submissions`
        ),
      ]);

      setAssignment(assignmentRes.data);
      setSubmissions(submissionsRes.data);
    } catch (error) {
      console.error("Error fetching assignment data:", error);
    } finally {
      setLoading(false);
    }
  };

  const processAllSubmissions = async () => {
    setProcessing(true);
    try {
      await axios.post(
        `https://result-checker-backend.vercel.app/assignments/${assignmentId}/process-all`
                // `http://localhost:3000/assignments/${assignmentId}/process-all`

      );
      await fetchAssignmentData();
      toast.success("All submissions processed successfully!");
    } catch (error) {
      console.error("Error processing submissions:", error);
      toast.error("Error processing submissions");
    } finally {
      setProcessing(false);
    }
  };

  const downloadMarksSheet = async (format: "excel" | "csv") => {
    try {
      const response = await axios.get(
        `https://result-checker-backend.vercel.app/assignments/${assignmentId}/marks-sheet?format=${format}`,
        // `http://localhost:3000/assignments/${assignmentId}/marks-sheet?format=${format}`,

        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `marks-sheet-${assignmentId}.${format === "excel" ? "xlsx" : "csv"}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success(
        `Marks sheet downloaded as ${format === "excel" ? "Excel" : "CSV"}`
      );
    } catch (error) {
      console.error("Error downloading marks sheet:", error);
      toast.error("Error downloading marks sheet");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-700">
          Loading assignment details...
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg font-medium text-red-600">
          Assignment not found
        </div>
      </div>
    );
  }

  const processedSubmissions = submissions.filter(
    (s) => s.status === "processed"
  );
  const pendingSubmissions = submissions.filter((s) => s.status === "pending");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12">
      {/* Toast container */}
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {assignment.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span className="bg-gray-200 px-3 py-1 rounded-full">
                Expected words: {assignment.wordCount}
              </span>
              <span className="bg-gray-200 px-3 py-1 rounded-full capitalize">
                Grading: {assignment.evaluationMode}
              </span>
              <span className="bg-gray-200 px-3 py-1 rounded-full">
                Created: {new Date(assignment.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Link
            href="/assignments"
            className="inline-flex items-center bg-gray-700 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 shadow transition"
          >
            ← Back to Assignments
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Assignment Instructions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📘 Assignment Instructions
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {assignment.instructions}
              </p>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                ⚡ Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/assignments/${assignmentId}/upload`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow transition"
                >
                  Upload Submissions
                </Link>

                <button
                  onClick={processAllSubmissions}
                  disabled={processing || pendingSubmissions.length === 0}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  {processing
                    ? "Processing..."
                    : `Process All (${pendingSubmissions.length})`}
                </button>

                <button
                  onClick={() => downloadMarksSheet("excel")}
                  disabled={processedSubmissions.length === 0}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Download Excel
                </button>

                <button
                  onClick={() => downloadMarksSheet("csv")}
                  disabled={processedSubmissions.length === 0}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Download CSV
                </button>
              </div>
            </div>

            {/* Submissions */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📝 Student Submissions ({submissions.length})
              </h2>

              {submissions.length === 0 ? (
                <p className="text-gray-500 text-center py-10 italic">
                  No submissions yet. Upload student assignments to get started.
                </p>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <SubmissionItem
                      key={submission._id}
                      submission={submission}
                      onProcessed={fetchAssignmentData}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                📊 Statistics
              </h3>
              <div className="space-y-3">
                <StatItem
                  label="Total Submissions"
                  value={submissions.length}
                />
                <StatItem
                  label="Processed"
                  value={processedSubmissions.length}
                />
                <StatItem label="Pending" value={pendingSubmissions.length} />
                <StatItem
                  label="Errors"
                  value={submissions.filter((s) => s.status === "error").length}
                />

                {processedSubmissions.length > 0 && (
                  <div className="mt-4 border-t pt-4 space-y-3">
                    <StatItem
                      label="Average Score"
                      value={`${(
                        processedSubmissions.reduce(
                          (sum, s) => sum + s.score,
                          0
                        ) / processedSubmissions.length
                      ).toFixed(1)}/10`}
                    />
                    <StatItem
                      label="Highest Score"
                      value={`${Math.max(
                        ...processedSubmissions.map((s) => s.score)
                      ).toFixed(1)}/10`}
                    />
                    <StatItem
                      label="Lowest Score"
                      value={`${Math.min(
                        ...processedSubmissions.map((s) => s.score)
                      ).toFixed(1)}/10`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Submission Item */
function SubmissionItem({
  submission,
  onProcessed,
}: {
  submission: Submission;
  onProcessed: () => void;
}) {
  const [processing, setProcessing] = useState(false);

  const processSubmission = async () => {
    setProcessing(true);
    try {
      await axios.post(
        `https://result-checker-backend.vercel.app/assignments/submissions/${submission._id}/process`
        // `http://localhost:3000/assignments/submissions/${submission._id}/process`
      );
      onProcessed();
      toast.success("Submission processed successfully!");
    } catch (error) {
      console.error("Error processing submission:", error);
      toast.error("Error processing submission");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">
            {submission.studentName}
          </h4>
          <p className="text-sm text-gray-600">
            Roll No: {submission.rollNumber}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            submission.status === "processed"
              ? "bg-green-100 text-green-800"
              : submission.status === "error"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {submission.status}
        </span>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
        <span>📄 {submission.fileName}</span>
        <span>✍️ {submission.wordCount} words</span>
      </div>

      {submission.status === "processed" && (
        <div className="mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-green-700">
              Score: {submission.score.toFixed(1)}/10
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-2 italic">
            "{submission.remarks}"
          </p>
        </div>
      )}

      {submission.status === "pending" && (
        <button
          onClick={processSubmission}
          disabled={processing}
          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow disabled:opacity-50 transition"
        >
          {processing ? "Processing..." : "Evaluate"}
        </button>
      )}
    </div>
  );
}

/* Stat Item */
function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600">{label}:</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
