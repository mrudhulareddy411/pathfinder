import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Footer({ user: propUser }) {
  const [user, setUser] = useState(propUser || null);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const fetchUser = async () => {
        try {
          const meRes = await api.get("/auth/me");
          if (meRes.data) {
            setUser(meRes.data);
          }
        } catch {
          // Soft fallback for guest
        }
      };
      fetchUser();
    }
  }, [propUser]);

  const normalizeExternalUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    const trimmed = url.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const fullName = user?.fullName || "Kondreddy Mrudhula";
  const firstInitial = (fullName.trim()[0] || "K").toUpperCase();
  const rawPhoto = user?.profileImage || user?.profilePhoto || null;
  const userPhoto = rawPhoto
    ? /^https?:\/\//i.test(rawPhoto)
      ? rawPhoto
      : `http://localhost:5000${rawPhoto}`
    : null;
  const linkedinUrl = user?.linkedinUrl || user?.linkedin || "";
  const githubUrl = user?.githubUrl || user?.github || "";

  return (
    <footer
      className="mt-5 pt-5 pb-4 no-print"
      style={{
        backgroundColor: "#0F172A",
        color: "#F8FAFC",
        borderTop: "1px solid rgba(255, 255, 255, 0.10)",
      }}
    >
      <div className="container" style={{ maxWidth: "1250px" }}>
        <div className="row g-4 mb-4">
          {/* COLUMN 1: PATHFINDER AI */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-3 text-white fw-bold d-flex align-items-center justify-content-center"
                style={{ width: "34px", height: "34px", backgroundColor: "#3B82F6", fontSize: "16px" }}
              >
                P
              </div>
              <span className="fw-bold fs-5 text-white" style={{ letterSpacing: "-0.01em" }}>
                Pathfinder AI
              </span>
            </div>
            <p className="small mb-0" style={{ color: "#94A3B8", lineHeight: "1.6" }}>
              AI-powered career guidance and job-readiness platform designed to help students understand their career options, identify skill gaps, build projects, improve their resumes, and prepare for employment.
            </p>
          </div>

          {/* COLUMN 2: ABOUT ME (COMPACT PERSONAL PROFILE) */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="fw-bold text-white small text-uppercase tracking-wider mb-3">About Me</h6>
            <div className="d-flex align-items-center gap-3 mb-2">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={fullName}
                  className="rounded-circle flex-shrink-0"
                  style={{
                    width: "72px",
                    height: "72px",
                    objectFit: "cover",
                    border: "2px solid #3B82F6",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div
                  className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{
                    width: "72px",
                    height: "72px",
                    backgroundColor: "#3B82F6",
                    fontSize: "28px",
                  }}
                >
                  {firstInitial}
                </div>
              )}
              <div className="overflow-hidden">
                <div className="fw-bold text-white small text-truncate">{fullName}</div>
                <div className="extra-small" style={{ color: "#94A3B8", lineHeight: "1.3" }}>
                  B.Tech / Computer Science & Engineering Student
                </div>
              </div>
            </div>

            <p className="extra-small mb-3" style={{ color: "#94A3B8", lineHeight: "1.5" }}>
              Computer Science student interested in software development, artificial intelligence, machine learning and building practical technology solutions.
            </p>

            <div className="d-flex flex-wrap gap-2">
              {linkedinUrl && (
                <a
                  href={normalizeExternalUrl(linkedinUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm px-2.5 py-1 text-white text-decoration-none fw-semibold extra-small d-inline-flex align-items-center gap-1 rounded-2"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  View LinkedIn Profile ↗
                </a>
              )}
              {githubUrl && (
                <a
                  href={normalizeExternalUrl(githubUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm px-2.5 py-1 text-white text-decoration-none fw-semibold extra-small d-inline-flex align-items-center gap-1 rounded-2"
                  style={{ backgroundColor: "#334155", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>

          {/* COLUMN 3: PLATFORM */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="fw-bold text-white small text-uppercase tracking-wider mb-3">Platform</h6>
            <div className="d-flex flex-column gap-2 small">
              <Link to="/dashboard" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Dashboard
              </Link>
              <Link to="/assessment" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Assessment
              </Link>
              <Link to="/career-pathfinder" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Career Pathfinder
              </Link>
              <Link to="/skills" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Skills Gap
              </Link>
              <Link to="/resources" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Learning Hub
              </Link>
            </div>
          </div>

          {/* COLUMN 4: CAREER TOOLS */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="fw-bold text-white small text-uppercase tracking-wider mb-3">Career Tools</h6>
            <div className="d-flex flex-column gap-2 small">
              <Link to="/resumes" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Resume Builder
              </Link>
              <Link to="/projects" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Projects
              </Link>
              <Link to="/challenges" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Challenges
              </Link>
              <Link to="/academics" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Academic Tracker
              </Link>
              <Link to="/profile" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Profile
              </Link>
              <Link to="/settings" className="text-decoration-none" style={{ color: "#94A3B8" }}>
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div
          className="pt-3 mt-4 d-flex flex-column flex-sm-row justify-content-between align-items-center extra-small gap-2"
          style={{ borderTop: "1px solid rgba(255, 255, 255, 0.10)", color: "#94A3B8" }}
        >
          <div>
            © 2026 <span className="text-white fw-semibold">Pathfinder AI</span> • Designed & Developed by <strong className="text-white">{fullName}</strong>
          </div>
          <div className="d-flex gap-3">
            <Link to="/settings" className="text-decoration-none" style={{ color: "#94A3B8" }}>
              Privacy
            </Link>
            <Link to="/settings" className="text-decoration-none" style={{ color: "#94A3B8" }}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
