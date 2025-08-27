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
  RawDraftContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";
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

// Helper: Convert Draft.js raw content to HTML (BOLD, ITALIC, headers, lists, code)
function draftRawToHtml(raw: RawDraftContentState): string {
  const blocks = raw.blocks;

  let html = "";
  let listStack: string[] = [];

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    let blockText = block.text;

    // Inline styles
    block.inlineStyleRanges.forEach((range) => {
      const { offset, length, style } = range;
      const before = blockText.slice(0, offset);
      const middle = blockText.slice(offset, offset + length);
      const after = blockText.slice(offset + length);

      if (style === "BOLD") blockText = `${before}<b>${middle}</b>${after}`;
      else if (style === "ITALIC")
        blockText = `${before}<i>${middle}</i>${after}`;
    });

    switch (block.type) {
      case "header-one":
        html += `<h1>${blockText}</h1>`;
        break;
      case "header-two":
        html += `<h2>${blockText}</h2>`;
        break;
      case "header-three":
        html += `<h3>${blockText}</h3>`;
        break;
      case "unordered-list-item":
        if (listStack[listStack.length - 1] !== "ul") {
          html += "<ul>";
          listStack.push("ul");
        }
        html += `<li>${blockText}</li>`;
        if (!blocks[i + 1] || blocks[i + 1].type !== "unordered-list-item") {
          html += "</ul>";
          listStack.pop();
        }
        break;
      case "ordered-list-item":
        if (listStack[listStack.length - 1] !== "ol") {
          html += "<ol>";
          listStack.push("ol");
        }
        html += `<li>${blockText}</li>`;
        if (!blocks[i + 1] || blocks[i + 1].type !== "ordered-list-item") {
          html += "</ol>";
          listStack.pop();
        }
        break;
      case "code-block":
        html += `<pre><code>${blockText}</code></pre>`;
        break;
      default:
        html += `<p>${blockText}</p>`;
        break;
    }
  }

  return html;
}

export default function CommentForm({ user, onPosted }: CommentFormProps) {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

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
      const html = draftRawToHtml(raw);

      await createComment(user.token, html);

      // Reset editor safely with correct changeType
      setEditorState(
        EditorState.push(
          editorState,
          ContentState.createFromText(""),
          "remove-range" // just use the string literal
        )
      );

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
          onClick={() => toggleBlockType("header-one")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => toggleBlockType("header-two")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => toggleBlockType("header-three")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-semibold"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => toggleBlockType("unordered-list-item")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          UL
        </button>
        <button
          type="button"
          onClick={() => toggleBlockType("ordered-list-item")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          OL
        </button>
        <button
          type="button"
          onClick={() => toggleBlockType("code-block")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-mono"
        >
          Code
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
