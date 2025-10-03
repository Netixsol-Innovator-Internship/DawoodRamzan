"use client";
import { useState, useEffect, useRef } from "react";

export function useSpeechToText() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.continuous = true; // keep listening
      recognition.interimResults = true; // get words as user speaks
      recognition.lang = "en-US"; // set language

      recognition.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          finalTranscript += event.results[i][0].transcript;
        }
        setTranscript(finalTranscript);
      };

      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => recognitionRef.current?.start();
  const stopListening = () => recognitionRef.current?.stop();

  return { transcript, listening, startListening, stopListening };
}
