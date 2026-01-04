import { useState, useCallback, useRef, useEffect } from "react";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import { parseVoiceCommandToAdjustments } from "@/lib/advanced-filters";
import type { FilterAdjustments } from "@/lib/advanced-filters";

interface InstructionUpdate {
  text: string;
  adjustments: Partial<FilterAdjustments>;
  timestamp: number;
}

/**
 * Hook for live instruction listening and real-time filter adjustments
 */
export function useLiveInstructions(onAdjustmentChange: (adjustments: Partial<FilterAdjustments>) => void) {
  const [isListening, setIsListening] = useState(false);
  const [lastInstruction, setLastInstruction] = useState<string>("");
  const [listeningStatus, setListeningStatus] = useState<"idle" | "listening" | "processing">("idle");
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize audio session
  useEffect(() => {
    const initAudio = async () => {
      try {
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
        });
      } catch (error) {
        console.error("Error initializing audio:", error);
      }
    };

    initAudio();
  }, []);

  /**
   * Start listening for live instructions
   */
  const startListening = useCallback(async () => {
    try {
      setIsListening(true);
      setListeningStatus("listening");

      // Use Web Speech API for browser, or native speech recognition for mobile
      if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setListeningStatus("listening");
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
              // Process final result
              setListeningStatus("processing");
              setLastInstruction(transcript);

              // Parse instruction and apply adjustments
              const adjustments = parseVoiceCommandToAdjustments(transcript);
              if (Object.keys(adjustments).length > 0) {
                onAdjustmentChange(adjustments);
              }

              setListeningStatus("listening");
            } else {
              interimTranscript += transcript;
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setListeningStatus("idle");
        };

        recognition.onend = () => {
          setIsListening(false);
          setListeningStatus("idle");
        };

        recognitionRef.current = recognition;
        recognition.start();
      }
    } catch (error) {
      console.error("Error starting live listening:", error);
      setIsListening(false);
      setListeningStatus("idle");
    }
  }, [onAdjustmentChange]);

  /**
   * Stop listening for instructions
   */
  const stopListening = useCallback(() => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setListeningStatus("idle");
    } catch (error) {
      console.error("Error stopping live listening:", error);
    }
  }, []);

  /**
   * Toggle listening on/off
   */
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    listeningStatus,
    lastInstruction,
    startListening,
    stopListening,
    toggleListening,
  };
}
