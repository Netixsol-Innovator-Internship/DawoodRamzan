// app/assignments/[id]/upload/page.tsx
"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function UploadSubmissions() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
  });

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Extract student info from filename
        const fileName = file.name.replace(".pdf", "");
        const [studentName, rollNumber] = fileName.split("_");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("studentName", studentName || "Unknown Student");
        formData.append("rollNumber", rollNumber || `ROLL${i + 1}`);

        await axios.post(
          `https://result-checker-backend.vercel.app/assignments/${assignmentId}/upload`,
          // `http://localhost:3000/assignments/${assignmentId}/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        setProgress(((i + 1) / files.length) * 100);
      }

      toast.success("All files uploaded successfully!");
      router.push(`/assignments/${assignmentId}`);
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error("Error uploading files");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-12">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200"
        >
          <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Upload Student Submissions
          </h1>

          <div className="space-y-6">
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                isDragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-10 w-10 text-purple-500 mb-3" />
              {isDragActive ? (
                <p className="text-gray-700 font-medium">
                  Drop your PDF files here...
                </p>
              ) : (
                <p className="text-gray-600">
                  Drag & drop PDF files here, or{" "}
                  <span className="text-purple-600 font-semibold">browse</span>
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Files should be named: <br />
                <code>StudentName_RollNumber.pdf</code>
              </p>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Selected Files ({files.length})
                </h3>
                <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto divide-y divide-gray-200">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center px-4 py-2 text-sm text-gray-700"
                    >
                      <FileText className="h-4 w-4 text-purple-500 mr-2" />
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {uploading && (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Uploading... {Math.round(progress)}%
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition disabled:opacity-50"
              >
                {uploading ? "Uploading..." : "Upload Submissions"}
              </button>

              <button
                onClick={() => router.back()}
                className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
