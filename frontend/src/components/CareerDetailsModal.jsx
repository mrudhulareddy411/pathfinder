import React from "react";

function CareerDetailsModal({ career, onClose }) {
  if (!career) return null;

  // Generate career-specific 8-Level Roadmap
  const getRoadmapLevels = (c) => {
    const title = c.title || "Software Engineering";
    const skills = c.requiredSkills || ["Problem Solving", "Computer Science"];

    return [
      {
        level: 1,
        title: "Level 1: Foundation",
        desc: `Master core computational logic, discrete mathematics, and fundamental computer science principles.`,
        topics: ["Mathematics & Logic", "Computer Organization", "Basic Programming Concepts"],
      },
      {
        level: 2,
        title: "Level 2: Core Skills",
        desc: `Build fluency in primary programming languages and essential data handling for ${title}.`,
        topics: skills.slice(0, 3),
      },
      {
        level: 3,
        title: "Level 3: Tools & Technologies",
        desc: `Master industry-standard software tools, frameworks, version control, and development environments.`,
        topics: skills.length > 3 ? skills.slice(3) : ["Git & GitHub", "REST APIs", "Linux Environment"],
      },
      {
        level: 4,
        title: "Level 4: Portfolio Projects",
        desc: `Design and build end-to-end practical portfolio applications demonstrating technical competence.`,
        topics: [`${title} Prototype Project`, "Database Integration", "Unit Testing"],
      },
      {
        level: 5,
        title: "Level 5: Advanced Engineering",
        desc: `Learn system design, scalability, security best practices, and performance optimization.`,
        topics: ["System Design", "Cloud Infrastructure", "Performance Tuning"],
      },
      {
        level: 6,
        title: "Level 6: Resume & Portfolio Preparation",
        desc: `Format your ATS-optimized resume highlighting verified projects, skills matrix, and O*NET alignment.`,
        topics: ["ATS Resume Builder", "GitHub Portfolio Polish", "Project Provenance Linking"],
      },
      {
        level: 7,
        title: "Level 7: Technical Interview Readiness",
        desc: `Practice data structures, algorithm challenges, system architecture whiteboard sessions, and behavioral prep.`,
        topics: ["LeetCode / HackerRank Practice", "Mock Technical Interviews", "Behavioral HR Prep"],
      },
      {
        level: 8,
        title: "Level 8: Job Placement Readiness",
        desc: `Apply to verified software engineering opportunities, track applications, and secure job offers.`,
        topics: ["Target Company Applications", "Recruiter Outreach", "Offer Evaluation"],
      },
    ];
  };

  const roadmap = getRoadmapLevels(career);

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(12px)", zIndex: 1060 }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content rounded-5 border border-primary border-opacity-20 shadow-lg">
          {/* Modal Header */}
          <div className="modal-header border-bottom p-4 bg-light rounded-top-5">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-primary  text-primary border border-primary border-opacity-20 extra-small">
                  O*NET 28.0 Occupation Record
                </span>
                {career.onetCode && (
                  <span className="badge bg-dark text-dark font-monospace extra-small">
                    O*NET-SOC {career.onetCode}
                  </span>
                )}
              </div>
              <h3 className="fw-extrabold text-dark mb-0">{career.title}</h3>
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body p-4 p-md-5 bg-white">
            {/* Career Overview */}
            <div className="mb-4">
              <h6 className="fw-extrabold text-dark mb-2">Occupational Description</h6>
              <p className="text-secondary small leading-relaxed">{career.description}</p>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-4 border">
                  <div className="fw-bold text-dark extra-small mb-1">Required Education</div>
                  <div className="small text-secondary">
                    {Array.isArray(career.educationRequirements)
                      ? career.educationRequirements.join(" • ")
                      : career.educationRequirements || "B.Tech Computer Science / Information Technology"}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-3 bg-light rounded-4 border">
                  <div className="fw-bold text-dark extra-small mb-1">Verified Salary Range (India / Global)</div>
                  <div className="small fw-bold text-primary font-monospace">
                    {typeof career.salaryRange === "object"
                      ? `₹${career.salaryRange.minLPA || 6}LPA - ₹${career.salaryRange.maxLPA || 22}LPA`
                      : career.salaryRange || "₹6.0 LPA - ₹22.0 LPA"}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Technologies Matrix */}
            <div className="mb-5">
              <h6 className="fw-extrabold text-dark mb-3">Required Technical Skills & Technologies</h6>
              <div className="d-flex flex-wrap gap-2">
                {(career.requiredSkills || ["Problem Solving", "Computer Science", "SQL"]).map((sk) => (
                  <span key={sk} className="badge bg-primary  text-primary border border-primary border-opacity-25 px-3 py-2 rounded-pill small fw-semibold">
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            <hr className="my-4" />

            {/* 8-LEVEL DYNAMIC CAREER ROADMAP */}
            <div>
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2">
                  <span>🗺️</span> 8-Level Career Development Roadmap
                </h5>
                <span className="badge bg-success  text-success border border-success border-opacity-30 extra-small font-monospace">
                  Career Specific Progression
                </span>
              </div>

              <div className="row g-3">
                {roadmap.map((lvl) => (
                  <div className="col-12 col-md-6" key={lvl.level}>
                    <div className="p-3 bg-white rounded-4 border border-secondary border-opacity-20 shadow-sm h-100">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className="badge bg-primary text-dark font-monospace rounded-circle p-2" style={{ width: "28px", height: "28px" }}>
                          {lvl.level}
                        </span>
                        <h6 className="fw-bold text-dark mb-0">{lvl.title}</h6>
                      </div>
                      <p className="extra-small text-muted mb-2">{lvl.desc}</p>
                      <div className="d-flex flex-wrap gap-1">
                        {lvl.topics.map((t) => (
                          <span key={t} className="badge bg-light text-dark border extra-small">
                            • {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top p-3 bg-light rounded-bottom-5">
            <button type="button" className="btn btn-secondary px-4 rounded-3 fw-bold" onClick={onClose}>
              Close Overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerDetailsModal;
