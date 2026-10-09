import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import siteConfig from "../config/siteConfig";

function Developer() {
  const dev = siteConfig.developer;

  return (
    <div className="dashboard-clean-bg min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container py-5 flex-grow-1" style={{ maxWidth: "1000px" }}>
        {/* HEADER SECTION */}
        <div className="clean-card p-4 p-md-5 mb-4 position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 p-4 opacity-10 d-none d-md-block" style={{ fontSize: "150px", lineHeight: 1, zIndex: 0 }}>
            🚀
          </div>
          <div className="d-flex flex-column flex-md-row gap-4 align-items-center align-items-md-start position-relative" style={{ zIndex: 1 }}>
            <div
              className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-lg flex-shrink-0"
              style={{
                width: "140px",
                height: "140px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
                fontSize: "56px",
                border: "4px solid white"
              }}
            >
              {dev.name.charAt(0)}
            </div>
            <div className="text-center text-md-start flex-grow-1">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-start mb-2">
                <div>
                  <h1 className="fw-bolder text-dark mb-1">{dev.name}</h1>
                  <h5 className="text-primary fw-bold mb-3">{dev.role}</h5>
                </div>
                <div className="d-flex gap-2 mb-3 mb-md-0">
                  {dev.socialLinks?.github && (
                    <a href={dev.socialLinks.github} target="_blank" rel="noreferrer" className="btn btn-dark btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-2">
                      GitHub ↗
                    </a>
                  )}
                  {dev.socialLinks?.linkedin && (
                    <a href={dev.socialLinks.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm rounded-pill px-3 shadow-sm d-flex align-items-center gap-2">
                      LinkedIn ↗
                    </a>
                  )}
                </div>
              </div>

              <p className="text-secondary fs-6 mb-4" style={{ lineHeight: "1.7" }}>
                {dev.description}
              </p>
              
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-md-start">
                <a href={`mailto:${dev.email}`} className="badge bg-light text-dark border p-2 text-decoration-none hover-primary transition-all">
                  ✉️ {dev.email}
                </a>
                <span className="badge bg-light text-dark border p-2">
                  📱 {dev.phone}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* LEFT COLUMN */}
          <div className="col-12 col-lg-8 d-flex flex-column gap-4">
            
            {/* EXPERIENCE */}
            <div className="clean-card p-4">
              <h5 className="fw-bolder text-dark mb-4 d-flex align-items-center gap-2">
                <span className="fs-4">💼</span> Professional Experience
              </h5>
              <div className="d-flex flex-column gap-4">
                {dev.experience.map((exp, idx) => (
                  <div key={idx} className="position-relative">
                    {idx !== dev.experience.length - 1 && (
                      <div className="position-absolute bg-light" style={{ width: "2px", height: "100%", left: "11px", top: "24px" }}></div>
                    )}
                    <div className="d-flex gap-3 position-relative z-1">
                      <div className="rounded-circle bg-primary mt-1 flex-shrink-0 shadow-sm" style={{ width: "24px", height: "24px", border: "4px solid white" }}></div>
                      <div>
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-1">
                          <h6 className="fw-bold text-dark mb-0 fs-5">{exp.title}</h6>
                          <span className="badge badge-clean-gray text-secondary">{exp.duration}</span>
                        </div>
                        <div className="text-primary fw-semibold mb-2">{exp.company}</div>
                        <ul className="text-secondary small ps-3 mb-0" style={{ lineHeight: "1.6" }}>
                          {exp.bullets.map((bullet, i) => (
                            <li key={i} className="mb-1">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PROJECTS */}
            <div className="clean-card p-4">
              <h5 className="fw-bolder text-dark mb-4 d-flex align-items-center gap-2">
                <span className="fs-4">🚀</span> Featured Projects
              </h5>
              <div className="row g-3">
                {dev.projects.map((proj, idx) => (
                  <div className="col-12" key={idx}>
                    <div className="p-3 bg-light rounded-3 border h-100 hover-shadow transition-all">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold text-dark mb-0">{proj.title}</h6>
                      </div>
                      <div className="text-primary extra-small fw-bold mb-2 font-monospace">{proj.tech}</div>
                      <p className="text-secondary small mb-0">{proj.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ACHIEVEMENTS */}
            <div className="clean-card p-4">
              <h5 className="fw-bolder text-dark mb-4 d-flex align-items-center gap-2">
                <span className="fs-4">🏆</span> Achievements
              </h5>
              <ul className="text-secondary small ps-3 mb-0" style={{ lineHeight: "1.8" }}>
                {dev.achievements.map((ach, idx) => (
                  <li key={idx} className="mb-2">{ach}</li>
                ))}
              </ul>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="col-12 col-lg-4 d-flex flex-column gap-4">
            
            {/* EDUCATION */}
            <div className="clean-card p-4">
              <h5 className="fw-bolder text-dark mb-4 d-flex align-items-center gap-2">
                <span className="fs-4">🎓</span> Education
              </h5>
              <div className="d-flex flex-column gap-3">
                {dev.education.map((edu, idx) => (
                  <div key={idx} className="p-3 bg-light rounded-3 border">
                    <div className="fw-bold text-dark small mb-1" style={{ lineHeight: "1.4" }}>{edu.degree}</div>
                    <div className="text-secondary extra-small mb-2">{edu.institution}</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-white text-dark border">{edu.batch}</span>
                      <span className="badge badge-clean-green">{edu.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SKILLS */}
            <div className="clean-card p-4">
              <h5 className="fw-bolder text-dark mb-4 d-flex align-items-center gap-2">
                <span className="fs-4">💻</span> Technical Skills
              </h5>
              <div className="d-flex flex-column gap-3">
                {Object.entries(dev.skills).map(([category, skills]) => (
                  <div key={category}>
                    <div className="extra-small text-muted fw-bold text-uppercase mb-2">{category}</div>
                    <div className="d-flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span key={idx} className="badge bg-light text-dark border fw-medium px-2 py-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CERTIFICATIONS */}
            <div className="clean-card p-4">
              <h5 className="fw-bolder text-dark mb-4 d-flex align-items-center gap-2">
                <span className="fs-4">📜</span> Certifications
              </h5>
              <div className="d-flex flex-column gap-2">
                {dev.certifications.map((cert, idx) => (
                  <div key={idx} className="d-flex gap-2 align-items-start">
                    <span className="text-success mt-1">✓</span>
                    <span className="text-secondary small fw-medium" style={{ lineHeight: "1.4" }}>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Developer;
