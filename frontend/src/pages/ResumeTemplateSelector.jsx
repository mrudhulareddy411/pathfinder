import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import Navbar from "../components/Navbar";

// Visual Miniature Mockup Renderer for Template Selector
function MiniTemplateMockup({ code, accent }) {
  switch (code) {
    case "MODERN":
      return (
        <div className="p-2.5 rounded-4 bg-white border border-secondary border-opacity-20 shadow-sm overflow-hidden" style={{ minHeight: "150px" }}>
          <div className="row g-0 h-100 rounded-3 overflow-hidden border">
            {/* Left Sidebar */}
            <div className="col-4 p-2 text-white d-flex flex-column justify-content-between" style={{ background: accent }}>
              <div>
                <div className="rounded-circle bg-white bg-opacity-30 mx-auto mb-1" style={{ width: "22px", height: "22px" }}></div>
                <div className="bg-white bg-opacity-80 rounded mx-auto mb-1" style={{ height: "4px", width: "80%" }}></div>
                <div className="bg-white bg-opacity-50 rounded mx-auto" style={{ height: "3px", width: "60%" }}></div>
              </div>
              <div className="d-flex flex-column gap-1">
                <div className="bg-white bg-opacity-30 rounded px-1 py-0.5 extra-small" style={{ fontSize: "7px" }}>SKILLS</div>
                <div className="bg-white bg-opacity-30 rounded px-1 py-0.5 extra-small" style={{ fontSize: "7px" }}>LANGUAGES</div>
              </div>
            </div>
            {/* Right Main Area */}
            <div className="col-8 p-2 bg-light d-flex flex-column gap-1.5">
              <div className="fw-bold text-dark extra-small" style={{ fontSize: "9px" }}>SUMMARY</div>
              <div className="bg-secondary bg-opacity-20 rounded" style={{ height: "3px", width: "100%" }}></div>
              <div className="bg-secondary bg-opacity-20 rounded" style={{ height: "3px", width: "85%" }}></div>
              <div className="fw-bold text-dark extra-small mt-1" style={{ fontSize: "9px" }}>EXPERIENCE & PROJECTS</div>
              <div className="p-1 rounded bg-white border">
                <div className="bg-dark bg-opacity-60 rounded" style={{ height: "4px", width: "70%" }}></div>
                <div className="bg-secondary bg-opacity-20 rounded mt-1" style={{ height: "3px", width: "90%" }}></div>
              </div>
            </div>
          </div>
        </div>
      );

    case "ATS":
      return (
        <div className="p-3 rounded-4 bg-white border border-secondary border-opacity-20 shadow-sm text-dark font-sans" style={{ minHeight: "150px" }}>
          <div className="text-center border-bottom border-dark pb-1 mb-2">
            <div className="fw-bold text-dark" style={{ fontSize: "10px" }}>STUDENT NAME</div>
            <div className="text-muted extra-small" style={{ fontSize: "7px" }}>Email | Phone | Location | LinkedIn</div>
          </div>
          <div className="fw-bold text-dark extra-small border-bottom border-dark pb-0.5 mb-1" style={{ fontSize: "8px" }}>EDUCATION</div>
          <div className="bg-secondary bg-opacity-20 rounded mb-2" style={{ height: "4px", width: "95%" }}></div>
          <div className="fw-bold text-dark extra-small border-bottom border-dark pb-0.5 mb-1" style={{ fontSize: "8px" }}>TECHNICAL SKILLS</div>
          <div className="d-flex gap-1 flex-wrap mb-2">
            <span className="badge bg-dark text-white p-1" style={{ fontSize: "7px" }}>React</span>
            <span className="badge bg-dark text-white p-1" style={{ fontSize: "7px" }}>Node.js</span>
            <span className="badge bg-dark text-white p-1" style={{ fontSize: "7px" }}>Python</span>
          </div>
          <div className="text-end text-success extra-small fw-bold" style={{ fontSize: "8px" }}>✓ 100% ATS Parseable</div>
        </div>
      );

    case "VERTICAL":
      return (
        <div className="p-3 rounded-4 bg-white border border-secondary border-opacity-20 shadow-sm text-dark" style={{ minHeight: "150px" }}>
          <div className="d-flex align-items-center gap-2 border-bottom pb-1.5 mb-2">
            <div className="rounded-circle bg-primary" style={{ width: "20px", height: "20px" }}></div>
            <div>
              <div className="fw-bold extra-small" style={{ fontSize: "9px" }}>Student Name</div>
              <div className="text-muted extra-small" style={{ fontSize: "7px" }}>Vertical Timeline Layout</div>
            </div>
          </div>
          <div className="ps-2" style={{ borderLeft: `2px solid ${accent}` }}>
            <div className="mb-1.5 ps-2">
              <div className="fw-bold text-primary extra-small" style={{ fontSize: "8px" }}>● Education</div>
              <div className="bg-light p-1 rounded border extra-small" style={{ fontSize: "7px" }}>B.Tech CSE (2024-2027)</div>
            </div>
            <div className="ps-2">
              <div className="fw-bold text-success extra-small" style={{ fontSize: "8px" }}>● Skills Matrix</div>
              <div className="d-flex gap-1">
                <span className="badge bg-success bg-opacity-15 text-success" style={{ fontSize: "6px" }}>JavaScript</span>
                <span className="badge bg-success bg-opacity-15 text-success" style={{ fontSize: "6px" }}>SQL</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "CREATIVE":
      return (
        <div className="p-2.5 rounded-4 bg-white border border-secondary border-opacity-20 shadow-sm" style={{ minHeight: "150px" }}>
          <div className="p-2 rounded-3 text-white mb-2" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0284c7 100%)" }}>
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-white text-primary fw-bold d-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px", fontSize: "10px" }}>P</div>
              <div>
                <div className="fw-bold" style={{ fontSize: "9px" }}>Creative Portfolio</div>
                <div className="opacity-75" style={{ fontSize: "7px" }}>Visual Avatar Header</div>
              </div>
            </div>
          </div>
          <div className="d-flex gap-1 mb-1">
            <span className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: "6px" }}>UI/UX</span>
            <span className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: "6px" }}>React</span>
            <span className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: "6px" }}>Design</span>
          </div>
          <div className="row g-1">
            <div className="col-6">
              <div className="p-1 rounded bg-light border extra-small" style={{ fontSize: "7px" }}>🎓 Education</div>
            </div>
            <div className="col-6">
              <div className="p-1 rounded bg-light border extra-small" style={{ fontSize: "7px" }}>💻 Projects</div>
            </div>
          </div>
        </div>
      );

    case "DEVELOPER":
      return (
        <div className="p-3 rounded-4 bg-white border border-secondary border-opacity-20 shadow-sm font-monospace" style={{ minHeight: "150px" }}>
          <div className="border-bottom border-dark pb-1 mb-2">
            <div className="text-success fw-bold" style={{ fontSize: "7px" }}>// DEVELOPER_PROFILE.JSON</div>
            <div className="fw-bold text-dark" style={{ fontSize: "9px" }}>&lt;Developer /&gt;</div>
          </div>
          <div className="text-primary fw-bold mb-1" style={{ fontSize: "7px" }}>// TECHNICAL_SKILL_STACK</div>
          <div className="d-flex gap-1 mb-2">
            <span className="badge bg-dark text-success" style={{ fontSize: "6px" }}>React</span>
            <span className="badge bg-dark text-success" style={{ fontSize: "6px" }}>Node.js</span>
            <span className="badge bg-dark text-success" style={{ fontSize: "6px" }}>MongoDB</span>
          </div>
          <div className="p-1 bg-light rounded border text-secondary" style={{ fontSize: "7px" }}>
            &gt; repo_1: Pathfinder AI Platform
          </div>
        </div>
      );

    case "PROFILE":
      return (
        <div className="p-2.5 rounded-4 bg-white border border-secondary border-opacity-20 shadow-sm" style={{ minHeight: "150px" }}>
          <div className="p-2 rounded-3 bg-light border mb-2 d-flex align-items-center gap-2">
            <div className="rounded-circle bg-primary" style={{ width: "22px", height: "22px" }}></div>
            <div>
              <div className="fw-bold text-dark" style={{ fontSize: "9px" }}>Personal Portfolio</div>
              <div className="text-muted" style={{ fontSize: "7px" }}>Profile Card & Bio</div>
            </div>
          </div>
          <div className="fw-bold text-primary mb-1" style={{ fontSize: "8px" }}>Technical & Core Skills</div>
          <div className="d-flex gap-1 flex-wrap mb-1">
            <span className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: "6px" }}>Full Stack</span>
            <span className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: "6px" }}>JavaScript</span>
            <span className="badge bg-primary bg-opacity-15 text-primary" style={{ fontSize: "6px" }}>Python</span>
          </div>
          <div className="p-1 rounded bg-light border extra-small" style={{ fontSize: "7px" }}>
            ⭐ Featured Projects & Academic Achievements
          </div>
        </div>
      );

    case "CLASSIC":
    default:
      return (
        <div className="p-3 rounded-4 bg-white border border-secondary border-opacity-20 shadow-sm text-dark font-serif" style={{ minHeight: "150px" }}>
          <div className="text-center border-bottom pb-1 mb-2">
            <div className="fw-bold text-dark" style={{ fontSize: "10px", fontFamily: "Georgia, serif" }}>FULL NAME</div>
            <div className="text-uppercase text-muted" style={{ fontSize: "7px" }}>Software Engineering Student</div>
            <div className="text-secondary" style={{ fontSize: "6px" }}>email@student.edu • +91 98765 43210</div>
          </div>
          <div className="fw-bold text-dark border-bottom pb-0.5 mb-1" style={{ fontSize: "8px", fontFamily: "Georgia, serif" }}>EDUCATION</div>
          <div className="bg-secondary bg-opacity-20 rounded mb-2" style={{ height: "3px", width: "90%" }}></div>
          <div className="fw-bold text-dark border-bottom pb-0.5 mb-1" style={{ fontSize: "8px", fontFamily: "Georgia, serif" }}>SKILLS & CERTIFICATIONS</div>
          <div className="bg-secondary bg-opacity-20 rounded" style={{ height: "3px", width: "80%" }}></div>
        </div>
      );
  }
}

function ResumeTemplateSelector() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedCode, setSelectedCode] = useState("CLASSIC");

  const templates = [
    {
      code: "CLASSIC",
      name: "Classic Professional",
      description: "Traditional corporate & academic layout. Times/Georgia serif typography, single column.",
      atsFriendly: true,
      icon: "📄",
      accent: "#4f46e5",
    },
    {
      code: "MODERN",
      name: "Modern Two-Column",
      description: "Sleek sidebar layout with left profile card & right detailed experience timeline.",
      atsFriendly: true,
      icon: "📊",
      accent: "#0284c7",
    },
    {
      code: "ATS",
      name: "Minimal ATS Parseable",
      description: "Maximum machine-readability for Applicant Tracking Systems. Zero photos or graphics.",
      atsFriendly: true,
      icon: "🎯",
      accent: "#059669",
    },
    {
      code: "VERTICAL",
      name: "Vertical Career Timeline",
      description: "Connected vertical timeline nodes highlighting education, skills, and portfolio projects.",
      atsFriendly: true,
      icon: "🗺️",
      accent: "#7c3aed",
    },
    {
      code: "CREATIVE",
      name: "Creative Portfolio",
      description: "Visual layout featuring profile photo avatar, modern badges, and project cards.",
      atsFriendly: false,
      icon: "🎨",
      accent: "#db2777",
    },
    {
      code: "DEVELOPER",
      name: "Developer Monospace",
      description: "Code-inspired layout with JetBrains Mono, skill progress chips, and repository links.",
      atsFriendly: true,
      icon: "⚡",
      accent: "#10b981",
    },
    {
      code: "PROFILE",
      name: "Personal Profile",
      description: "Personal presentation layout with prominent profile card and comprehensive bio.",
      atsFriendly: false,
      icon: "👤",
      accent: "#d97706",
    },
  ];

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, []);

  const handleSelectTemplate = (code) => {
    setSelectedCode(code);
    navigate(`/resume/builder?template=${code}`);
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #f0f4f9 0%, #e0e7ff 50%, #e0f2fe 100%)", minHeight: "100vh" }}>
      <Navbar user={user} />

      <div className="container py-5">
        <div className="glass-panel p-4 p-md-5 bg-white rounded-5 border border-primary border-opacity-15 shadow-sm text-center mb-5">
          <img
            src="/resume_3d.png"
            alt="3D Resume Studio"
            className="img-fluid rounded-4 mb-3 animate-float"
            style={{ maxHeight: "160px", objectFit: "contain" }}
          />
          <span className="badge neon-badge px-3.5 py-2 rounded-pill mb-3 fw-bold fs-6">
            7 ATS & Visual Formats Available
          </span>
          <h2 className="fw-extrabold text-dark display-6 mb-2">Choose Your Resume Format 📄</h2>
          <p className="text-secondary small mb-0" style={{ maxWidth: "620px", margin: "0 auto" }}>
            Select a professional resume template. Pathfinder AI automatically pre-populates your saved profile, education, skills, and projects into the selected format.
          </p>
        </div>

        <div className="row g-4">
          {templates.map((tpl) => {
            const isSelected = selectedCode === tpl.code;

            return (
              <div className="col-12 col-md-6 col-lg-4" key={tpl.code}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  onClick={() => setSelectedCode(tpl.code)}
                  className="glass-panel p-4 h-100 d-flex flex-column rounded-5 border position-relative cursor-pointer transition-all bg-white"
                  style={{
                    borderColor: isSelected ? tpl.accent : "rgba(79, 70, 229, 0.15)",
                    boxShadow: isSelected ? `0 0 25px ${tpl.accent}35` : "0 10px 30px rgba(37, 99, 235, 0.08)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="fs-2">{tpl.icon}</span>
                    <div className="d-flex gap-2 align-items-center">
                      {tpl.atsFriendly && (
                        <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-30 extra-small">
                          ✓ ATS Parseable
                        </span>
                      )}
                      {isSelected && (
                        <span className="badge bg-primary text-white extra-small">✓ Selected</span>
                      )}
                    </div>
                  </div>

                  <h5 className="fw-extrabold text-dark mb-2">{tpl.name}</h5>
                  <p className="text-secondary small mb-3">{tpl.description}</p>

                  {/* Realistic Visual Mini Template Mockup */}
                  <div className="mb-4 flex-grow-1">
                    <div className="fw-semibold text-muted extra-small mb-1.5 d-flex justify-content-between">
                      <span>LAYOUT INSIDE:</span>
                      <span style={{ color: tpl.accent }}>● {tpl.code}</span>
                    </div>
                    <MiniTemplateMockup code={tpl.code} accent={tpl.accent} />
                  </div>

                  <button
                    onClick={() => handleSelectTemplate(tpl.code)}
                    className="btn btn-cyber w-100 py-2.5 fw-bold mt-auto rounded-3"
                  >
                    Use Template →
                  </button>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ResumeTemplateSelector;
