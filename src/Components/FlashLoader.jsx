import React, { useEffect, useState, useRef } from "react";
import Typewriter from "typewriter-effect";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import "./FlashLoader.css";
import clickFlash from "../assets/click-flash.mp3";

const FlashLoader = ({ onComplete = () => {} }) => {
  const [showFinalText, setShowFinalText] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const flashPhaseRef = useRef(true);

  useEffect(() => {
    const flashPhaseDuration = 2600;

    const interval = setInterval(() => {
      if (!flashPhaseRef.current) return;

      const flash = document.createElement("div");
      flash.className = "flash-text";
      flash.textContent = "MRUCHA";
      flash.style.left = `${Math.random() * 90}%`;
      flash.style.top = `${Math.random() * 90}%`;
      flash.style.fontSize = `${32 + Math.random() * 40}px`;

      document.getElementById("flash-container")?.appendChild(flash);

      setTimeout(() => flash.remove(), 400);

      if (audioUnlocked && !isMuted) {
        try {
          const flashAudio = new Audio(clickFlash);
          flashAudio.volume = 1;
          flashAudio.play().catch(() => {
            console.warn("🛑 Flash audio play blocked");
          });
        } catch (err) {
          console.error("⚠️ Flash audio error:", err);
        }
      }
    }, 200);

    const switchToTyping = setTimeout(() => {
      flashPhaseRef.current = false;
      clearInterval(interval);
      setShowFinalText(true);
    }, flashPhaseDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(switchToTyping);
    };
  }, [isMuted, audioUnlocked]);

  return (
    <div className="loader-bg">
      {/* 🔈 Audio Unlocker Layer */}
      {!audioUnlocked && (
        <div
          className="audio-unlocker"
          onClick={() => setAudioUnlocked(true)}
          onTouchStart={() => setAudioUnlocked(true)}
        />
      )}

      <div id="flash-container" className="flash-container" />

      {showFinalText && (
        <div className="typewriter-box">
          <Typewriter
            options={{ delay: 120, cursor: "|" }}
            onInit={(typewriter) => {
              typewriter
                .typeString("Mrucha, who?")
                .pauseFor(500)
                .callFunction(() => {
                  setTimeout(() => {
                    onComplete();
                  }, 300); // extra buffer to avoid abrupt cut
                })
                .start();
            }}
          />
        </div>
      )}

      {/* 🔊 SOUND TOGGLE */}
      <div className="sound-wrap">
        <span className="sound-text font-inter pr-6">Tap to experience</span>
        <button
          className="sound-toggle"
          onClick={() => setIsMuted(!isMuted)}
          aria-label="Toggle Sound"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
    </div>
  );
};

export default FlashLoader;



