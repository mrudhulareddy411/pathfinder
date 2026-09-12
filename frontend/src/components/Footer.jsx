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
      className="mt-5 pt-5 pb-4 no-print position-relative"
      style={{
        background: "rgba(255, 255, 255, 0.5)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        color: "#475569",
        borderTop: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="container" style={{ maxWidth: "1250px" }}>
        <div className="row g-4 mb-4">
          {/* COLUMN 1: PATHFINDER AI */}
          <div className="col-12 col-md-6 col-lg-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-3 text-dark fw-bold d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", fontSize: "16px" }}
              >
                P
              </div>
              <span className="fw-bold fs-5" style={{ color: "#0f172a", letterSpacing: "-0.02em" }}>Pathfinder AI</span>
            </div>
            <p className="small mb-4" style={{ maxWidth: "300px" }}>
              Empowering students and professionals to navigate their career paths with intelligent, data-driven insights and AI-powered tools.
            </p>
          </div>

          {/* COLUMN 2: ABOUT ME (COMPACT PERSONAL PROFILE) */}
          <div className="col-12 col-md-6 col-lg-3">
            <h6 className="fw-bold text-dark small text-uppercase tracking-wider mb-3">About Me</h6>
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
                  className="rounded-circle text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm"
                  style={{
                    width: "72px",
                    height: "72px",
                    background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
                    fontSize: "28px",
                  }}
                >
                  {firstInitial}
                </div>
              )}
              <div className="overflow-hidden">
                <div className="fw-bold text-dark small text-truncate">{fullName}</div>
                <div className="extra-small" style={{ color: "#64748b", lineHeight: "1.3" }}>
                  B.Tech / Computer Science & Engineering Student
                </div>
              </div>
            </div>

            <p className="extra-small mb-3" style={{ color: "#64748b", lineHeight: "1.5" }}>
              Computer Science student interested in software development, artificial intelligence, machine learning and building practical technology solutions.
            </p>

            <div className="d-flex flex-wrap gap-2">
              {linkedinUrl && (
                <a
                  href={normalizeExternalUrl(linkedinUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-sm px-2.5 py-1 text-dark text-decoration-none fw-semibold extra-small d-inline-flex align-items-center gap-1 rounded-2"
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
                  className="btn btn-sm px-2.5 py-1 text-dark text-decoration-none fw-semibold extra-small d-inline-flex align-items-center gap-1 rounded-2"
                  style={{ backgroundColor: "#334155", border: "1px solid rgba(255, 255, 255, 0.15)" }}
                >
                  GitHub ↗
                </a>
              )}
            </div>
          </div>

          <div className="col-6 col-md-3">
              <h5 className="fw-bold mb-3" style={{ color: "#0f172a" }}>Product</h5>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><Link to="/career-pathfinder" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Career Pathfinder</Link></li>
                <li><Link to="/assessment" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Skills Assessment</Link></li>
                <li><Link to="/skills" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Skill Gap Analysis</Link></li>
                <li><Link to="/resume/templates" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Resume Builder</Link></li>
              </ul>
            </div>
            <div className="col-6 col-md-3">
              <h5 className="fw-bold mb-3" style={{ color: "#0f172a" }}>Resources</h5>
              <ul className="list-unstyled d-flex flex-column gap-2 small">
                <li><Link to="/resources" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Learning Hub</Link></li>
                <li><Link to="/projects" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Project Ideas</Link></li>
                <li><Link to="/challenges" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Challenges</Link></li>
                <li><Link to="/calendar" className="text-decoration-none transition-all" style={{ color: "#475569" }}>Events Calendar</Link></li>
              </ul>
            </div>
        </div>

        {/* BOTTOM FOOTER */}
        <div className="border-top mt-5 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center" style={{ borderColor: "rgba(0, 0, 0, 0.05) !important" }}>
          <p className="small mb-2 mb-md-0" style={{ color: "#64748b" }}>
            &copy; {new Date().getFullYear()} Pathfinder AI. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            <Link to="/settings" className="text-decoration-none" style={{ color: "#64748b" }}>
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
