import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function LevelMap({ currentLevel = 1, careerTitle = "General Career Journey" }) {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const levels = [
    {
      levelNumber: 1,
      title: "Discover Yourself",
      description: "Complete your profile, interest assessment, & education background.",
      icon: "🧭",
      requiredXP: 100,
      activities: ["Profile Setup", "Stream Selection"],
      details: "In Stage 1, you establish your core education parameters, interests, and baseline skills to generate matched career options.",
    },
    {
      levelNumber: 2,
      title: "Explore Careers",
      description: "Search verified career databases, compare options, and pick a target.",
      icon: "🔍",
      requiredXP: 300,
      activities: ["Explore Careers", "Save Target Career"],
      details: "In Stage 2, you analyze market demand, growth rate, and required skill profiles for verified software engineering and tech careers.",
    },
    {
      levelNumber: 3,
      title: "Assess Skill Gaps",
      description: "Analyze matching vs missing skills against real industry standards.",
      icon: "🧠",
      requiredXP: 600,
      activities: ["Skill Assessment", "Skill Gap Matrix"],
      details: "In Stage 3, the engine compares your baseline skills against job market data to highlight your high-priority missing technical competencies.",
    },
    {
      levelNumber: 4,
      title: "Build Foundation",
      description: "Complete verified learning resources and core programming tutorials.",
      icon: "📚",
      requiredXP: 1000,
      activities: ["MDN / NPTEL Docs", "Core Skill Practice"],
      details: "In Stage 4, you engage with hand-curated documentation and verified learning paths to master foundational concepts.",
    },
    {
      levelNumber: 5,
      title: "Build Projects",
      description: "Construct portfolio-grade software & engineering projects.",
      icon: "💻",
      requiredXP: 1500,
      activities: ["Portfolio Project 1", "GitHub Repository"],
      details: "In Stage 5, you build real-world software applications and push source code to GitHub to construct a compelling developer portfolio.",
    },
    {
      levelNumber: 6,
      title: "Career Preparation",
      description: "Prepare resume, practice interview questions, & review aptitude.",
      icon: "💼",
      requiredXP: 2200,
      activities: ["Resume Prep", "Technical Interview Questions"],
      details: "In Stage 6, you build an ATS-friendly resume using Pathfinder's Resume Builder and prepare for technical screening rounds.",
    },
    {
      levelNumber: 7,
      title: "Career Ready",
      description: "Master required competencies & land internships / full-time roles.",
      icon: "🏆",
      requiredXP: 3000,
      activities: ["Final Assessment", "Career Execution Plan"],
      details: "In Stage 7, you satisfy all technical skill metrics and complete application tracking for internship and job opportunities.",
    },
  ];

  const getStatus = (lvlNum) => {
    if (lvlNum < currentLevel) return "COMPLETED";
    if (lvlNum === currentLevel) return "IN_PROGRESS";
    return "LOCKED";
  };

  return (
    <div className="glass-panel p-4 mb-4" style={{ background: "rgba(255, 255, 255, 0.92)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-primary border-opacity-15">
        <div>
          <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
            <span>🗺️</span> <span className="text-gradient-indigo">Interactive Career Journey Path</span>
          </h4>
          <p className="text-secondary small mb-0">{careerTitle}</p>
        </div>
        <span className="badge neon-badge px-3 py-2 rounded-pill fw-bold fs-6">
          ⚡ Level {currentLevel} Active
        </span>
      </div>

      <div className="d-flex flex-column align-items-center gap-3 py-2" style={{ position: "relative" }}>
        {levels.map((lvl, idx) => {
          const status = getStatus(lvl.levelNumber);

          let nodeStyle = {};
          let cardStyle = {};
          let statusBadge = null;

          if (status === "COMPLETED") {
            nodeStyle = {
              background: "linear-gradient(135deg, #10b981, #059669)",
              border: "3px solid #34d399",
              boxShadow: "0 0 20px rgba(52, 211, 153, 0.4)",
            };
            cardStyle = {
              background: "rgba(16, 185, 129, 0.08)",
              borderColor: "rgba(52, 211, 153, 0.4)",
            };
            statusBadge = <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-25 px-3 py-1">🟢 Completed</span>;
          } else if (status === "IN_PROGRESS") {
            nodeStyle = {
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              border: "4px solid #ffffff",
              boxShadow: "0 0 30px rgba(37, 99, 235, 0.6)",
            };
            cardStyle = {
              background: "rgba(37, 99, 235, 0.08)",
              borderColor: "rgba(37, 99, 235, 0.4)",
              boxShadow: "0 10px 30px rgba(37, 99, 235, 0.15)",
            };
            statusBadge = <span className="badge neon-badge px-3 py-1 fw-bold">⚡ Current Goal</span>;
          } else {
            nodeStyle = {
              background: "rgba(226, 232, 240, 0.9)",
              border: "2px solid rgba(148, 163, 184, 0.5)",
            };
            cardStyle = {
              background: "rgba(248, 250, 252, 0.6)",
              borderColor: "rgba(203, 213, 225, 0.6)",
              opacity: 0.7,
            };
            statusBadge = <span className="badge bg-secondary bg-opacity-20 text-secondary border border-secondary border-opacity-25 px-3 py-1">🔒 Locked</span>;
          }

          return (
            <div key={lvl.levelNumber} className="w-100" style={{ maxWidth: "740px" }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedLevel(lvl)}
                className={`p-3.5 rounded-4 border d-flex align-items-center gap-3.5 transition-all cursor-pointer ${
                  status === "IN_PROGRESS" ? "node-pulse-active" : ""
                }`}
                style={cardStyle}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fs-3 flex-shrink-0 text-white"
                  style={{ width: "64px", height: "64px", ...nodeStyle }}
                >
                  {lvl.icon}
                </div>

                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="fw-bold text-dark mb-0">
                      Level {lvl.levelNumber}: {lvl.title}
                    </h5>
                    {statusBadge}
                  </div>
                  <p className="text-secondary small mb-2">{lvl.description}</p>
                  <div className="d-flex flex-wrap gap-2 extra-small align-items-center text-muted">
                    <span className="text-gradient-indigo fw-bold">⚡ {lvl.requiredXP} XP Required</span>
                    <span>•</span>
                    <span className="text-dark opacity-75">Activities: {lvl.activities.join(", ")}</span>
                  </div>
                </div>
              </motion.div>

              {/* Connecting Line */}
              {idx < levels.length - 1 && (
                <div className="d-flex justify-content-center my-1.5">
                  <div
                    style={{
                      width: "4px",
                      height: "26px",
                      borderRadius: "2px",
                      background:
                        lvl.levelNumber < currentLevel
                          ? "linear-gradient(180deg, #10b981, #2563eb)"
                          : "rgba(203, 213, 225, 0.8)",
                      boxShadow: lvl.levelNumber < currentLevel ? "0 0 10px rgba(37, 99, 235, 0.3)" : "none",
                    }}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Level Detail Modal Drawer */}
      <AnimatePresence>
        {selectedLevel && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 rounded-4 bg-white border border-primary border-opacity-30 shadow-lg"
          >
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <span>{selectedLevel.icon}</span> Level {selectedLevel.levelNumber}: {selectedLevel.title}
              </h5>
              <button
                className="btn btn-link text-secondary p-0 text-decoration-none fs-5"
                onClick={() => setSelectedLevel(null)}
              >
                ✕
              </button>
            </div>
            <p className="text-secondary small mb-3">{selectedLevel.details}</p>
            <div className="d-flex justify-content-between align-items-center extra-small">
              <span className="text-gradient-indigo fw-bold">⚡ Milestone Reward: +{selectedLevel.requiredXP / 2} XP</span>
              <span className="badge neon-badge px-3 py-1">Required Competencies: {selectedLevel.activities.length}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LevelMap;
