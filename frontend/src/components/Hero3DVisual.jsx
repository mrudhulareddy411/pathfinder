import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function Hero3DVisual() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 30; // degrees
    const y = (clientY / innerHeight - 0.5) * -30;
    setMousePos({ x, y });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const floatingCards = [
    { title: "Career Match", val: "92%", color: "#06b6d4", icon: "🎯", top: "10%", left: "5%" },
    { title: "Daily Streak", val: "🔥 7 Days", color: "#f59e0b", icon: "⚡", top: "15%", right: "8%" },
    { title: "Skill Mastery", val: "86%", color: "#6366f1", icon: "🧠", bottom: "25%", left: "0%" },
    { title: "Resume ATS", val: "84 / 100", color: "#10b981", icon: "📄", bottom: "18%", right: "2%" },
    { title: "Gamified XP", val: "Level 5", color: "#ec4899", icon: "⭐", top: "50%", right: "-5%" },
  ];

  return (
    <div
      className="position-relative w-100 d-flex justify-content-center align-items-center py-5"
      style={{ perspective: "1000px", minHeight: "480px" }}
    >
      <motion.div
        animate={{
          rotateY: mousePos.x,
          rotateX: mousePos.y,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        className="position-relative d-flex justify-content-center align-items-center"
      >
        {/* Central Pathfinder Glowing 3D Sphere Core */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="rounded-circle d-flex flex-column justify-content-center align-items-center text-center p-4"
          style={{
            width: "220px",
            height: "220px",
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)",
            boxShadow: "0 0 60px rgba(79, 70, 229, 0.6), 0 0 100px rgba(6, 182, 212, 0.4)",
            border: "4px solid rgba(255, 255, 255, 0.4)",
            transform: "translateZ(50px)",
          }}
        >
          <span className="fs-1 mb-1">🚀</span>
          <h5 className="fw-extrabold text-white mb-0" style={{ letterSpacing: "1px" }}>
            PATHFINDER AI
          </h5>
          <span className="extra-small text-white opacity-75 fw-semibold">Career Core</span>
        </motion.div>

        {/* Orbiting Floating Metric Cards */}
        {floatingCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: [0, -12, 0],
            }}
            transition={{
              y: { repeat: Infinity, duration: 4 + idx, ease: "easeInOut" },
              opacity: { duration: 0.5, delay: idx * 0.1 },
            }}
            whileHover={{ scale: 1.1, translateZ: "80px" }}
            className="position-absolute glass-panel p-3 rounded-4"
            style={{
              top: card.top,
              bottom: card.bottom,
              left: card.left,
              right: card.right,
              borderColor: `${card.color}55`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${card.color}33`,
              minWidth: "150px",
              transform: `translateZ(${30 + idx * 10}px)`,
              cursor: "pointer",
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className="fs-5">{card.icon}</span>
              <span className="text-secondary extra-small fw-semibold">{card.title}</span>
            </div>
            <div className="fw-extrabold fs-6" style={{ color: card.color }}>
              {card.val}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default Hero3DVisual;
