"use client";
import { useRef } from "react";

export function useTextToSpeech() {
  const synthRef = useRef(
    typeof window !== "undefined" ? window.speechSynthesis : null
  );

  const speak = (text, lang = "en-US") => {
    if (!synthRef.current) return;
    if (!text.trim()) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1; // speed (0.5–2)
    utterance.pitch = 0.2; // pitch (0–2)
    utterance.volume = 1; // volume (0–1)

    synthRef.current.speak(utterance);
  };

  const stop = () => {
    synthRef.current?.cancel();
  };

  return { speak, stop };
}
