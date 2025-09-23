"use client";
import { useState } from "react";
import axios from "axios";
import * as mammoth from "mammoth";

interface QuestionInputProps {
  onAnswer: (data: any) => void;
  onLoading: (loading: boolean) => void;
}

export default function QuestionInput({
  onAnswer,
  onLoading,
}: QuestionInputProps) {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ---- Extract text from DOCX ----
  const extractDocxText = async (file: File): Promise<string> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      console.error("DOCX extraction error:", error);
      throw new Error(
        `Failed to extract text from DOCX: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  // ---- Handle File Upload ----
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    setUploading(true);
    try {
      let extractedText = "";
      const fileName = file.name.toLowerCase();
      const fileSizeMB = file.size / (1024 * 1024);

      // Validate file size (max 10MB)
      if (fileSizeMB > 10) {
        alert("File size too large. Please upload a file smaller than 10MB.");
        setUploading(false);
        return;
      }

      // Validate file type
      if (fileName.endsWith(".docx")) {
        extractedText = await extractDocxText(file);
      } else {
        alert("Unsupported file type. Please upload DOCX.");
        setUploading(false);
        return;
      }

      // Validate extracted text
      if (!extractedText.trim()) {
        alert(
          "No text content could be extracted from the file. The file might be empty, corrupted, or contain only images."
        );
        setUploading(false);
        return;
      }

      const payload = {
        title: file.name.replace(/\.(pdf|docx)$/i, ""),
        content: extractedText,
        topic: file.name.replace(/\.(pdf|docx)$/i, ""),
        author: "",
        source: "Uploaded File",
      };

      const response = await axios.post(
        "https://multi-reasearch-agent-backend.vercel.app/upload",
        payload,
        {
          timeout: 30000, // 30 second timeout
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Document uploaded successfully: " + response.data.id);
      setFile(null);

      // Reset file input
      const fileInput = document.querySelector(
        'input[type="file"]'
      ) as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error: any) {
      console.error("Error uploading file:", error);

      if (error.response) {
        // Server responded with error status
        alert(
          `Upload failed: ${
            error.response.data?.message || error.response.statusText
          }`
        );
      } else if (error.request) {
        // Request made but no response received
        alert(
          "Upload failed: Cannot connect to server. Please make sure the backend is running."
        );
      } else if (error.message.includes("Failed to extract text")) {
        // Text extraction error
        alert(`Upload failed: ${error.message}`);
      } else {
        // Other errors
        alert("Upload failed: " + (error.message || "Unknown error occurred"));
      }
    } finally {
      setUploading(false);
    }
  };

  // Handle file selection with validation
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile) {
      const fileName = selectedFile.name.toLowerCase();
      const validTypes = [".pdf", ".docx"];

      if (!validTypes.some((type) => fileName.endsWith(type))) {
        alert("Please select a PDF or DOCX file.");
        e.target.value = "";
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size must be less than 10MB.");
        e.target.value = "";
        return;
      }
    }

    setFile(selectedFile);
  };

  return (
    <div className="space-y-8">
      {/* Question Form */}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!question.trim()) return;
          onLoading(true);
          try {
            const response = await axios.post(
              "https://multi-reasearch-agent-backend.vercel.app/ask",
              {
                question: question.trim(),
              },
              {
                timeout: 30000,
              }
            );
            onAnswer(response.data);
            setQuestion("");
          } catch (err: any) {
            console.error(err);
            alert(
              "Error processing question: " + (err.message || "Unknown error")
            );
          } finally {
            onLoading(false);
          }
        }}
        className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-800">
          Ask a Research Question
        </h2>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a research question (e.g., Compare SQL vs NoSQL databases)"
          rows={4}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-3"
        />
        <button
          type="submit"
          disabled={!question.trim()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Research
        </button>
      </form>

      {/* File Upload */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-4 border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Upload PDF or DOCX
        </h2>
        <div className="space-y-2">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <p className="text-sm text-gray-500">
            Maximum file size: 10MB. Supported formats: DOCX
          </p>
        </div>
        <button
          onClick={handleFileUpload}
          disabled={!file || uploading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Upload Document"
          )}
        </button>
      </div>
    </div>
  );
}
