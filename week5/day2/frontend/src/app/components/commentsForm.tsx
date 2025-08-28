/* eslint-disable prefer-const */
"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";
import draftToHtml from "draftjs-to-html";
import { createComment } from "../lib/api";

interface User {
  token: string;
  id: string;
  username: string;
}

interface CommentFormProps {
  user: User | null;
  onPosted: () => void;
}

export default function CommentForm({ user, onPosted }: CommentFormProps) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  // Handle built-in Cmd/Ctrl + B / I etc.
  const handleKeyCommand = (command: string) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const toggleInlineStyle = (style: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return toast.error("Please login");

    const content = editorState.getCurrentContent();
    if (!content.hasText()) return toast.error("Comment cannot be empty");

    try {
      const raw = convertToRaw(content);

      // Convert Draft raw -> HTML (handles inline + block styles)
      const html = draftToHtml(raw);

      // send html to backend
      await createComment(user.token, html);

      // Reset editor to empty
      setEditorState(EditorState.createEmpty());

      toast.success("Comment posted");
      onPosted();
    } catch (err) {
      console.error(err);
      toast.error("Failed to post comment");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-white p-5 rounded-2xl shadow-md w-full max-w-xl mx-auto transition hover:shadow-lg"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          onClick={() => toggleInlineStyle("BOLD")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => toggleInlineStyle("ITALIC")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 italic"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => toggleInlineStyle("UNDERLINE")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 underline"
        >
          U
        </button>

        <button
          type="button"
          onClick={() => toggleInlineStyle("STRIKETHROUGH")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 line-through"
        >
          S
        </button>

        <button
          type="button"
          onClick={() => toggleInlineStyle("CODE")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-mono"
        >
          {"</>"}
        </button>
      </div>

      {/* Editor */}
      <div className="border border-gray-300 rounded-xl p-3 min-h-[150px] cursor-text">
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder={user ? "Write a comment..." : "Login to post a comment"}
          readOnly={!user}
        />
      </div>

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={!user}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-xl font-semibold transition"
        >
          Post
        </button>
      </div>
    </form>
  );
}
