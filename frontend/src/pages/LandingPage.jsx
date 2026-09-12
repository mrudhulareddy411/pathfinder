import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero3DVisual from "../components/Hero3DVisual";

function LandingPage() {
  const featureList = [
    {
      icon: "🧭",
      title: "Interactive Career Journey",
      desc: "Level up your skills from Discovery to Internship & Job readiness.",
      color: "#4f46e5",
    },
    {
      icon: "🧠",
      title: "Real Data Skill Gap Analysis",
      desc: "Compare your current skills against industry standard datasets.",
      color: "#0284c7",
    },
    {
      icon: "📄",
      title: "ATS-Friendly Resume Builder",
      desc: "Auto-import your verified profile into 7 clean professional templates.",
      color: "#7c3aed",
    },
    {
      icon: "🔥",
      title: "Streak & Activity Calendar",
      desc: "Track daily logins, learning milestones, and streak records.",
      color: "#d97706",
    },
  ];

  return (
    <div style={{  minHeight: "100vh", overflowX: "hidden" }}>
      {/* Background Orbs */}
      <div className="bg-ambient-orb orb-1"></div>
      <div className="bg-ambient-orb orb-2"></div>

      {/* Top Header */}
      <nav className="navbar navbar-expand-lg px-4 py-3 sticky-top" style={{ background: "rgba(255, 255, 255, 0.92)", backdropFilter: "blur(20px)", boxShadow: "0 4px 20px rgba(37, 99, 235, 0.08)" }}>
        <div className="container-fluid">
          <Link className="navbar-brand fw-extrabold text-gradient-indigo fs-3 d-flex align-items-center gap-2" to="/">
            <span>⚡</span> Pathfinder AI
          </Link>
          <div className="d-flex gap-3">
            <Link to="/" className="btn btn-outline-primary btn-sm rounded-pill px-4">
              Login
            </Link>
            <Link to="/register" className="btn btn-cyber btn-sm rounded-pill px-4 fw-bold">
              Register Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container py-5 my-3 position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center g-5">
          <div className="col-12 col-lg-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="badge neon-badge px-3.5 py-2 rounded-pill mb-3 fw-bold fs-6">
                🚀 AI-Powered Career Platform
              </span>
              <h1 className="fw-extrabold text-dark display-4 mb-3" style={{ letterSpacing: "-1.5px" }}>
                Your Career Journey <span className="text-gradient-indigo">Starts Here.</span>
              </h1>
              <p className="text-secondary fs-5 mb-4" style={{ lineHeight: "1.6" }}>
                Discover your strengths, explore verified career paths, bridge skill gaps, build projects, and unlock job readiness through a gamified 3D experience.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register" className="btn btn-cyber btn-lg px-4 py-3">
                  Start Your Journey &rarr;
                </Link>
                <Link to="/career-pathfinder" className="btn btn-outline-primary btn-lg px-4 py-3">
                  Explore Careers 🔍
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="col-12 col-lg-6">
            <Hero3DVisual />
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container py-5 position-relative" style={{ zIndex: 1 }}>
        <div className="text-center mb-5">
          <h2 className="fw-extrabold text-dark display-6 mb-2">Everything You Need To Build Your Career ⚡</h2>
          <p className="text-secondary small">Backed by real data provenance and verified learning roadmaps.</p>
        </div>

        <div className="row g-4">
          {featureList.map((ft, idx) => (
            <div className="col-12 col-md-6 col-lg-3" key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-4 h-100"
              >
                <div className="fs-1 mb-3">{ft.icon}</div>
                <h5 className="fw-bold text-dark mb-2">{ft.title}</h5>
                <p className="text-secondary small mb-0">{ft.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
