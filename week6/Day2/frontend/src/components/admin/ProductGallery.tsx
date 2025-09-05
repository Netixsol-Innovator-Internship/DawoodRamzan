"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  completed: boolean;
}

const ProductGallery = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      completed: false,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((newFile) => {
      const interval = setInterval(() => {
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          const fileIndex = updatedFiles.findIndex(
            (f) =>
              f.file.name === newFile.file.name &&
              f.file.size === newFile.file.size
          );

          if (updatedFiles[fileIndex].progress < 100) {
            updatedFiles[fileIndex] = {
              ...updatedFiles[fileIndex],
              progress: updatedFiles[fileIndex].progress + 10,
            };
          } else {
            updatedFiles[fileIndex] = {
              ...updatedFiles[fileIndex],
              completed: true,
            };
            clearInterval(interval);
          }
          return updatedFiles;
        });
      }, 300);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
    },
    multiple: true,
  });

  const removeFile = (fileName: string) => {
    setFiles((files) => files.filter((file) => file.file.name !== fileName));
    files.forEach((file) => {
      if (file.file.name === fileName) {
        URL.revokeObjectURL(file.preview);
      }
    });
  };

  return (
    <div className="w-full">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer mb-6 ${
          isDragActive ? "border-[#003F62] bg-[#f0f8ff]" : "border-[#BCBCBC]"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-[#BCBCBC]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          {isDragActive ? (
            <p className="font-rubik font-medium text-[#003F62]">
              Drop the files here ...
            </p>
          ) : (
            <>
              <p className="font-rubik font-medium text-[#232321]">
                Drop your images here, or browse
              </p>
              <p className="font-rubik text-sm text-[#BCBCBC]">
                Jpeg, png are allowed
              </p>
            </>
          )}
        </div>
      </div>

      {/* Preview Files */}
      <div className="space-y-4">
        {files.map((file, index) => (
          <div
            key={`${file.file.name}-${file.file.size}-${index}`}
            className="border border-[#E9E9EA] rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded overflow-hidden">
                  <img
                    src={file.preview}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-rubik font-medium text-sm text-[#232321] truncate max-w-[180px]">
                  {file.file.name}
                </span>
              </div>
              {file.completed ? (
                <div className="w-5 h-5 rounded-full bg-[#003F62] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              ) : (
                <button
                  onClick={() => removeFile(file.file.name)}
                  className="text-[#BCBCBC] hover:text-[#232321]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
            <div className="w-full bg-[#E9E9EA] rounded-full h-2">
              <div
                className="bg-[#003F62] h-2 rounded-full"
                style={{ width: `${file.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
