import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function SplashIntro({ onComplete, videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-996-large.mp4" }) {
  const DURATION_SEC = 4;
  const [timeLeft, setTimeLeft] = useState(DURATION_SEC);
  const canvasRef = useRef(null);

  // 30-Second Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onComplete]);

  // Splash Intro has been updated to use a glass overlay so the 3D background shows through!

  const progressPercent = Math.round(((DURATION_SEC - timeLeft) / DURATION_SEC) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.5 }}
        className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column justify-content-between p-4 p-md-5"
        style={{
          zIndex: 99999,
          background: "rgba(5, 11, 20, 0.4)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          overflow: "hidden",
        }}
      >
        {/* Transparent glass overlay allowing 3D background to show through */}

        {/* Top Bar */}
        <div className="d-flex justify-content-between align-items-center position-relative" style={{ zIndex: 3 }}>
          <div className="d-flex align-items-center gap-2">
            <span className="fs-3">⚡</span>
            <span className="fw-extrabold text-dark fs-4 brand-font" style={{ letterSpacing: "-0.5px" }}>
              PATHFINDER AI
            </span>
          </div>

          <button
            onClick={onComplete}
            className="btn btn-outline-light btn-sm rounded-pill px-4 py-2 fw-semibold"
            style={{ backdropFilter: "blur(12px)", background: "rgba(255, 255, 255, 0.15)", border: "1px solid rgba(255, 255, 255, 0.3)" }}
          >
            Skip Intro ({timeLeft}s) →
          </button>
        </div>

        {/* Central Flashing Screen Core */}
        <div className="d-flex flex-column justify-content-center align-items-center text-center position-relative my-auto" style={{ zIndex: 3 }}>
          {/* Flashing Neon Pulsing Core */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.8, 1, 0.8],
              rotate: [0, 8, -8, 0],
            }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-lg"
            style={{
              width: "150px",
              height: "150px",
              background: "linear-gradient(135deg, #00f2fe 0%, #4f46e5 50%, #7c3aed 100%)",
              boxShadow: "0 0 60px rgba(0, 242, 254, 0.8), 0 0 100px rgba(124, 58, 237, 0.6)",
              border: "4px solid rgba(255, 255, 255, 0.6)",
            }}
          >
            <span className="display-4 text-dark">🚀</span>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="badge neon-badge px-4 py-2 rounded-pill mb-3 fw-bold fs-6 animate-pulse">
              ⚡ Initializing 3D Environment
            </span>
            <h1 className="fw-extrabold text-dark display-4 mb-3" style={{ letterSpacing: "-1px" }}>
              Preparing your <span className="text-gradient-indigo">Career Path</span>
            </h1>
            <p className="text-light opacity-90 fs-5" style={{ maxWidth: "680px", margin: "0 auto", lineHeight: "1.6" }}>
              Pathfinder AI is establishing secure connections to your learning data, rendering the 3D environment, and configuring your personalized AI career recommendations.
            </p>
          </motion.div>

          {/* Highlights Badge Strip */}
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <span className="badge bg-black  text-cyan border border-info border-opacity-40 px-3.5 py-2 fs-6">
              🎯 Career Match Engine
            </span>
            <span className="badge bg-black  text-indigo border border-indigo border-opacity-40 px-3.5 py-2 fs-6" style={{ color: "#6366f1" }}>
              🧠 Skill Assessment
            </span>
            <span className="badge bg-black  text-purple border border-purple border-opacity-40 px-3.5 py-2 fs-6" style={{ color: "#a855f7" }}>
              📄 ATS Resume Builder
            </span>
            <span className="badge bg-black  text-warning border border-warning border-opacity-40 px-3.5 py-2 fs-6">
              🔥 Daily Streaks & XP
            </span>
          </div>
        </div>

        <div className="w-100 position-relative" style={{ zIndex: 3 }}>
          <div className="d-flex justify-content-between text-light opacity-75 extra-small mb-1 font-monospace">
            <span>⚡ INITIALIZING PATHFINDER AI ENGINE...</span>
            <span>{timeLeft}s remaining ({progressPercent}%)</span>
          </div>
          <div className="progress rounded-pill bg-black " style={{ height: "8px", border: "1px solid rgba(0, 242, 254, 0.3)" }}>
            <motion.div
              className="progress-bar rounded-pill"
              style={{
                width: `${progressPercent}%`,
                background: "linear-gradient(90deg, #00f2fe 0%, #4f46e5 50%, #7c3aed 100%)",
                boxShadow: "0 0 15px rgba(0, 242, 254, 0.8)",
                transition: "width 1s linear",
              }}
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default SplashIntro;
