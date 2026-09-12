import React from "react";

// Reusable Safe ProfilePhoto Component
function ProfilePhoto({ src, size = 90, shape = "circle", alt = "Profile Photo", className = "", style = {} }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        e.target.style.display = "none";
      }}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        objectFit: "cover",
        borderRadius: shape === "circle" ? "50%" : "12px",
        border: "3px solid #ffffff",
        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.12)",
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

function ResumePreview({ resumeData, selectedTemplate = "CLASSIC", accentColor = "#4f46e5" }) {
  if (!resumeData) return <div className="p-4 text-center text-muted">No resume data available</div>;

  const {
    personalInformation = {},
    summary = "",
    education = [],
    skills = [],
    projects = [],
    experience = [],
    internships = [],
    certifications = [],
    achievements = [],
    languages = [],
    additionalSections = [],
  } = resumeData;

  const photoSrc = personalInformation.profilePhoto || personalInformation.profileImage || personalInformation.photo || null;
  const showPhoto = personalInformation.showPhoto !== false;
  const hasPhoto = !!(photoSrc && showPhoto);

  // Helper section renderers
  const renderCertificationsList = () => (
    certifications.length > 0 && (
      <div className="mb-3">
        <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2 extra-small opacity-90">Certifications</h6>
        <ul className="extra-small text-secondary ps-3 mb-0">
          {certifications.map((c, idx) => (
            <li key={idx}>
              <strong>{c.title || c.name}</strong> {c.organization || c.issuer ? `— ${c.organization || c.issuer}` : ""} {c.year || c.date ? `(${c.year || c.date})` : ""}
            </li>
          ))}
        </ul>
      </div>
    )
  );

  const renderAchievementsList = () => (
    achievements.length > 0 && (
      <div className="mb-3">
        <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2 extra-small opacity-90">Honors & Achievements</h6>
        <ul className="extra-small text-secondary ps-3 mb-0">
          {achievements.map((a, idx) => (
            <li key={idx}>
              <strong>{a.title || a.name}</strong> {a.description ? `: ${a.description}` : ""}
            </li>
          ))}
        </ul>
      </div>
    )
  );

  const renderLanguagesList = () => (
    languages.length > 0 && (
      <div className="mb-3">
        <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2 extra-small opacity-90">Languages</h6>
        <div className="d-flex flex-wrap gap-2 extra-small text-secondary">
          {languages.map((l, idx) => (
            <span key={idx} className="badge bg-light text-dark border px-2 py-1">
              {typeof l === "object" ? `${l.language} (${l.proficiency || "Fluent"})` : l}
            </span>
          ))}
        </div>
      </div>
    )
  );

  // Render Renderer 1: CLASSIC (Traditional Corporate / Academic)
  const renderClassic = () => (
    <div className="p-4 p-md-5 bg-white text-dark shadow-sm rounded" style={{ fontFamily: "Georgia, serif", color: "#1e293b", minHeight: "1000px" }}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4" style={{ borderColor: "#cbd5e1" }}>
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: "28px", color: "#0f172a" }}>
            {personalInformation.fullName || "Your Full Name"}
          </h2>
          <div className="fw-semibold text-uppercase small text-muted mb-2" style={{ letterSpacing: "1px" }}>
            {personalInformation.title || "Software Engineering Student"}
          </div>
          <div className="d-flex flex-wrap gap-3 extra-small text-secondary">
            {personalInformation.email && <span>📧 {personalInformation.email}</span>}
            {personalInformation.phone && <span>📞 {personalInformation.phone}</span>}
            {personalInformation.location && <span>📍 {personalInformation.location}</span>}
            {personalInformation.linkedin && <span>🔗 {personalInformation.linkedin}</span>}
            {personalInformation.github && <span>💻 {personalInformation.github}</span>}
          </div>
        </div>
        {hasPhoto && <ProfilePhoto src={photoSrc} size={85} shape="circle" />}
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ color: "#0f172a", borderColor: "#cbd5e1" }}>
            Professional Summary
          </h6>
          <p className="small text-secondary mb-0" style={{ lineHeight: "1.6" }}>{summary}</p>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ color: "#0f172a", borderColor: "#cbd5e1" }}>
            Education
          </h6>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2">
              <div className="d-flex justify-content-between fw-bold small">
                <span>{edu.degree} — {edu.institution}</span>
                <span className="text-muted">{edu.startYear} - {edu.endYear || "Present"}</span>
              </div>
              <div className="extra-small text-secondary">
                {edu.branch && <span>{edu.branch} • </span>}
                {edu.score && <span>Score: {edu.score}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Experience / Internships */}
      {(experience.length > 0 || internships.length > 0) && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ color: "#0f172a", borderColor: "#cbd5e1" }}>
            Work Experience & Internships
          </h6>
          {[...experience, ...internships].map((exp, idx) => (
            <div key={idx} className="mb-3">
              <div className="d-flex justify-content-between fw-bold small">
                <span>{exp.role || exp.title} — {exp.company}</span>
                <span className="text-muted">{exp.startDate} - {exp.endDate || "Present"}</span>
              </div>
              {exp.description && <p className="extra-small text-secondary mb-0 mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ color: "#0f172a", borderColor: "#cbd5e1" }}>
            Projects
          </h6>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-3">
              <div className="d-flex justify-content-between fw-bold small">
                <span>{proj.title || proj.name}</span>
                {proj.technologies && <span className="text-muted extra-small">[{proj.technologies}]</span>}
              </div>
              {proj.description && <p className="extra-small text-secondary mb-1">{proj.description}</p>}
              {proj.link && <div className="extra-small text-primary">🔗 {proj.link}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-2" style={{ color: "#0f172a", borderColor: "#cbd5e1" }}>
            Skills
          </h6>
          <div className="d-flex flex-wrap gap-2 extra-small text-secondary">
            {skills.map((sk, idx) => (
              <span key={idx} className="badge bg-light text-dark border px-2 py-1">
                {typeof sk === "object" ? sk.name : sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {renderCertificationsList()}
      {renderAchievementsList()}
      {renderLanguagesList()}
    </div>
  );

  // Render Renderer 2: MODERN (Two-Column Sidebar Layout)
  const renderModern = () => (
    <div className="bg-white shadow-sm rounded overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "1000px" }}>
      <div className="row g-0">
        {/* Left Sidebar */}
        <div className="col-4 p-4 text-dark" style={{ background: accentColor }}>
          {hasPhoto && (
            <div className="text-center mb-4">
              <ProfilePhoto src={photoSrc} size={95} shape="circle" />
            </div>
          )}
          <h4 className="fw-extrabold mb-1">{personalInformation.fullName || "Your Full Name"}</h4>
          <p className="extra-small text-dark-50 text-uppercase fw-bold mb-4">{personalInformation.title || "Software Engineering Student"}</p>

          <div className="mb-4">
            <h6 className="fw-bold text-uppercase border-bottom border-white border-opacity-25 pb-1 mb-2 extra-small">Contact</h6>
            <div className="extra-small text-dark-75 d-flex flex-column gap-1">
              {personalInformation.email && <div>📧 {personalInformation.email}</div>}
              {personalInformation.phone && <div>📞 {personalInformation.phone}</div>}
              {personalInformation.location && <div>📍 {personalInformation.location}</div>}
              {personalInformation.linkedin && <div>🔗 {personalInformation.linkedin}</div>}
              {personalInformation.github && <div>💻 {personalInformation.github}</div>}
            </div>
          </div>

          {skills.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase border-bottom border-white border-opacity-25 pb-1 mb-2 extra-small">Skills</h6>
              <div className="d-flex flex-wrap gap-1">
                {skills.map((sk, idx) => (
                  <span key={idx} className="badge bg-white  text-dark extra-small">
                    {typeof sk === "object" ? sk.name : sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase border-bottom border-white border-opacity-25 pb-1 mb-2 extra-small">Languages</h6>
              <div className="extra-small text-dark-75">
                {languages.map((lang, idx) => (
                  <div key={idx}>{typeof lang === "object" ? `${lang.language} (${lang.proficiency || "Fluent"})` : lang}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Area */}
        <div className="col-8 p-4 p-md-5 text-dark">
          {summary && (
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ color: accentColor }}>Profile Summary</h6>
              <p className="small text-secondary mb-0" style={{ lineHeight: "1.6" }}>{summary}</p>
            </div>
          )}

          {education.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ color: accentColor }}>Education</h6>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-2">
                  <div className="fw-bold small">{edu.degree}</div>
                  <div className="extra-small text-muted">{edu.institution} ({edu.startYear} - {edu.endYear || "Present"})</div>
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div className="mb-4">
              <h6 className="fw-bold text-uppercase mb-2" style={{ color: accentColor }}>Projects</h6>
              {projects.map((proj, idx) => (
                <div key={idx} className="mb-3">
                  <div className="fw-bold small">{proj.title || proj.name}</div>
                  <p className="extra-small text-secondary mb-1">{proj.description}</p>
                </div>
              ))}
            </div>
          )}

          {renderCertificationsList()}
          {renderAchievementsList()}
        </div>
      </div>
    </div>
  );

  // Render Renderer 3: ATS (Strict Machine-Readable Format)
  const renderATS = () => (
    <div className="p-4 p-md-5 bg-white text-dark" style={{ fontFamily: "Arial, Helvetica, sans-serif", color: "#000000", minHeight: "1000px" }}>
      <div className="text-center mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: "24px", color: "#000000" }}>{personalInformation.fullName || "Your Full Name"}</h2>
        <div className="small text-uppercase mb-2" style={{ color: "#333333" }}>{personalInformation.title || "Software Engineering Student"}</div>
        <div className="small text-dark">
          {[personalInformation.email, personalInformation.phone, personalInformation.location, personalInformation.linkedin, personalInformation.github].filter(Boolean).join(" | ")}
        </div>
      </div>

      {summary && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom border-dark pb-1 mb-2">OBJECTIVE / SUMMARY</h6>
          <p className="small mb-0">{summary}</p>
        </div>
      )}

      {education.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom border-dark pb-1 mb-2">EDUCATION</h6>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2 small">
              <div className="d-flex justify-content-between fw-bold">
                <span>{edu.degree} — {edu.institution}</span>
                <span>{edu.startYear} - {edu.endYear || "Present"}</span>
              </div>
              <div>{edu.branch} {edu.score ? `| Score: ${edu.score}` : ""}</div>
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom border-dark pb-1 mb-2">PROJECTS</h6>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-2 small">
              <div className="fw-bold">{proj.title || proj.name} {proj.technologies ? `(${proj.technologies})` : ""}</div>
              <div>{proj.description}</div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom border-dark pb-1 mb-2">TECHNICAL SKILLS</h6>
          <div className="small">
            {skills.map((sk) => (typeof sk === "object" ? sk.name : sk)).join(", ")}
          </div>
        </div>
      )}

      {renderCertificationsList()}
      {renderAchievementsList()}
      {renderLanguagesList()}
    </div>
  );

  // Render Renderer 4: VERTICAL (Career Timeline Nodes)
  const renderVertical = () => (
    <div className="p-4 p-md-5 bg-white text-dark shadow-sm rounded" style={{ fontFamily: "'Outfit', sans-serif", minHeight: "1000px" }}>
      <div className="text-center border-bottom pb-4 mb-4" style={{ borderColor: "#e2e8f0" }}>
        {hasPhoto && (
          <div className="d-flex justify-content-center mb-3">
            <ProfilePhoto src={photoSrc} size={100} shape="circle" />
          </div>
        )}
        <h2 className="fw-extrabold mb-1" style={{ color: "#0f172a" }}>{personalInformation.fullName || "Your Full Name"}</h2>
        <div className="fw-bold text-uppercase small" style={{ color: accentColor }}>{personalInformation.title || "Software Engineering Student"}</div>
        <div className="extra-small text-muted mt-1">
          {[personalInformation.email, personalInformation.phone, personalInformation.location].filter(Boolean).join(" • ")}
        </div>
      </div>

      {/* Vertical Timeline Container */}
      <div className="ps-3" style={{ borderLeft: `3px solid ${accentColor}` }}>
        {summary && (
          <div className="position-relative ps-4 mb-4">
            <div className="position-absolute start-0 top-0 translate-middle-x rounded-circle" style={{ width: "14px", height: "14px", background: accentColor, border: "3px solid white" }}></div>
            <h6 className="fw-bold text-dark text-uppercase small mb-1">● Summary</h6>
            <p className="extra-small text-secondary mb-0">{summary}</p>
          </div>
        )}

        {education.length > 0 && (
          <div className="position-relative ps-4 mb-4">
            <div className="position-absolute start-0 top-0 translate-middle-x rounded-circle" style={{ width: "14px", height: "14px", background: "#0284c7", border: "3px solid white" }}></div>
            <h6 className="fw-bold text-dark text-uppercase small mb-2">● Education Timeline</h6>
            {education.map((edu, idx) => (
              <div key={idx} className="mb-2 p-3 bg-light rounded-3">
                <div className="fw-bold extra-small text-dark">{edu.degree} — {edu.institution}</div>
                <div className="extra-small text-muted">{edu.startYear} - {edu.endYear || "Present"}</div>
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="position-relative ps-4 mb-4">
            <div className="position-absolute start-0 top-0 translate-middle-x rounded-circle" style={{ width: "14px", height: "14px", background: "#7c3aed", border: "3px solid white" }}></div>
            <h6 className="fw-bold text-dark text-uppercase small mb-2">● Portfolio Projects</h6>
            {projects.map((proj, idx) => (
              <div key={idx} className="mb-2 p-3 bg-light rounded-3">
                <div className="fw-bold extra-small text-dark">{proj.title || proj.name}</div>
                <div className="extra-small text-secondary">{proj.description}</div>
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="position-relative ps-4 mb-4">
            <div className="position-absolute start-0 top-0 translate-middle-x rounded-circle" style={{ width: "14px", height: "14px", background: "#059669", border: "3px solid white" }}></div>
            <h6 className="fw-bold text-dark text-uppercase small mb-2">● Technical Competencies</h6>
            <div className="d-flex flex-wrap gap-1.5">
              {skills.map((sk, idx) => (
                <span key={idx} className="badge bg-success  text-success border border-success border-opacity-20 extra-small">
                  {typeof sk === "object" ? sk.name : sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && (
          <div className="position-relative ps-4 mb-4">
            <div className="position-absolute start-0 top-0 translate-middle-x rounded-circle" style={{ width: "14px", height: "14px", background: "#d97706", border: "3px solid white" }}></div>
            <h6 className="fw-bold text-dark text-uppercase small mb-2">● Certifications</h6>
            {certifications.map((c, idx) => (
              <div key={idx} className="mb-1 extra-small text-secondary">
                <strong>{c.title || c.name}</strong> ({c.organization || c.issuer})
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Render Renderer 5: CREATIVE (Featured Top Header Avatar 130px)
  const renderCreative = () => (
    <div className="p-4 p-md-5 bg-white text-dark shadow-sm rounded" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "1000px" }}>
      <div className="p-4 rounded-4 text-dark mb-4" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0284c7 100%)" }}>
        <div className="d-flex align-items-center gap-4">
          {hasPhoto ? (
            <ProfilePhoto src={photoSrc} size={130} shape="circle" />
          ) : (
            <div className="rounded-circle bg-white text-primary display-4 d-flex align-items-center justify-content-center fw-bold shadow" style={{ width: "110px", height: "110px", flexShrink: 0 }}>
              {(personalInformation.fullName || "P")[0]}
            </div>
          )}
          <div>
            <h1 className="fw-extrabold mb-1" style={{ fontSize: "32px" }}>{personalInformation.fullName || "Your Full Name"}</h1>
            <div className="fw-bold text-uppercase small opacity-90">{personalInformation.title || "Creative Engineering Student"}</div>
            <div className="extra-small opacity-75 mt-2">
              {[personalInformation.email, personalInformation.phone, personalInformation.location].filter(Boolean).join(" • ")}
            </div>
          </div>
        </div>
      </div>

      {summary && (
        <div className="p-3 bg-light rounded-3 border-start border-4 border-primary mb-4">
          <p className="small text-secondary mb-0">{summary}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-extrabold text-uppercase text-primary mb-2">⚡ Core Skills & Competencies</h6>
          <div className="d-flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <span key={idx} className="badge bg-primary  text-primary border border-primary border-opacity-20 px-3 py-1.5 rounded-pill extra-small fw-semibold">
                {typeof sk === "object" ? sk.name : sk}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <h6 className="fw-extrabold text-uppercase text-primary mb-3">🎓 Education</h6>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-3 p-3 bg-light rounded-3 border">
              <div className="fw-bold small">{edu.degree}</div>
              <div className="extra-small text-muted">{edu.institution}</div>
            </div>
          ))}
          {renderCertificationsList()}
        </div>

        <div className="col-12 col-md-6">
          <h6 className="fw-extrabold text-uppercase text-primary mb-3">💻 Projects & Media</h6>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-3 p-3 bg-light rounded-3 border">
              <div className="fw-bold small">{proj.title || proj.name}</div>
              <div className="extra-small text-secondary">{proj.description}</div>
            </div>
          ))}
          {renderAchievementsList()}
          {renderLanguagesList()}
        </div>
      </div>
    </div>
  );

  // Render Renderer 6: DEVELOPER (Small Circular Developer Avatar 55px)
  const renderDeveloper = () => (
    <div className="p-4 p-md-5 bg-white text-dark shadow-sm rounded" style={{ fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace", minHeight: "1000px" }}>
      <div className="d-flex align-items-center gap-3 border-bottom border-dark pb-3 mb-4">
        {hasPhoto && <ProfilePhoto src={photoSrc} size={55} shape="circle" />}
        <div>
          <div className="extra-small text-success fw-bold">// DEVELOPER_PROFILE.JSON</div>
          <h2 className="fw-bold text-dark mb-0">&lt;{personalInformation.fullName || "Developer"}&gt;</h2>
          <div className="extra-small text-muted mb-1">Role: "{personalInformation.title || "Full Stack Developer"}"</div>
          <div className="extra-small text-secondary">
            Github: {personalInformation.github || "github.com/developer"} | Email: {personalInformation.email}
          </div>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mb-4">
          <div className="extra-small text-primary fw-bold mb-2">// TECHNICAL_SKILL_STACK</div>
          <div className="d-flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <span key={idx} className="badge bg-dark text-success font-monospace px-2 py-1 border border-success border-opacity-30">
                {typeof sk === "object" ? sk.name : sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {projects.length > 0 && (
        <div className="mb-4">
          <div className="extra-small text-primary fw-bold mb-2">// REPOSITORIES_AND_PROJECTS</div>
          {projects.map((proj, idx) => (
            <div key={idx} className="p-3 bg-light rounded border mb-2 extra-small">
              <div className="fw-bold text-dark">&gt; repo_{idx + 1}: {proj.title || proj.name}</div>
              <div className="text-secondary">{proj.description}</div>
            </div>
          ))}
        </div>
      )}

      {renderCertificationsList()}
      {renderAchievementsList()}
      {renderLanguagesList()}
    </div>
  );

  // Render Renderer 7: PROFILE (Personal Profile Card Left 110px)
  const renderProfile = () => (
    <div className="p-4 p-md-5 bg-white text-dark shadow-sm rounded" style={{ fontFamily: "'Outfit', sans-serif", minHeight: "1000px" }}>
      {/* Profile Top Card */}
      <div className="row g-4 align-items-center mb-4 p-4 rounded-4 bg-light border">
        {hasPhoto && (
          <div className="col-12 col-md-3 text-center">
            <ProfilePhoto src={photoSrc} size={110} shape="circle" />
          </div>
        )}
        <div className={hasPhoto ? "col-12 col-md-9" : "col-12"}>
          <h2 className="fw-extrabold text-dark mb-1">{personalInformation.fullName || "Your Full Name"}</h2>
          <div className="fw-bold text-primary small text-uppercase mb-2">{personalInformation.title || "Software Engineering Student"}</div>
          <div className="extra-small text-muted mb-2">{summary}</div>
          <div className="d-flex flex-wrap gap-3 extra-small text-secondary">
            {personalInformation.email && <span>📧 {personalInformation.email}</span>}
            {personalInformation.phone && <span>📞 {personalInformation.phone}</span>}
            {personalInformation.location && <span>📍 {personalInformation.location}</span>}
          </div>
        </div>
      </div>

      {/* Skills Matrix */}
      {skills.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-3 text-primary">Technical & Core Skills</h6>
          <div className="d-flex flex-wrap gap-2">
            {skills.map((sk, idx) => (
              <span key={idx} className="badge bg-primary  text-primary border border-primary border-opacity-20 px-3 py-1.5 rounded-pill extra-small fw-semibold">
                {typeof sk === "object" ? sk.name : sk}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-3 text-primary">Academic Background</h6>
          {education.map((edu, idx) => (
            <div key={idx} className="mb-2 p-3 bg-light rounded-3">
              <div className="fw-bold small">{edu.degree}</div>
              <div className="extra-small text-muted">{edu.institution} ({edu.startYear} - {edu.endYear || "Present"})</div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-4">
          <h6 className="fw-bold text-uppercase border-bottom pb-1 mb-3 text-primary">Featured Projects</h6>
          {projects.map((proj, idx) => (
            <div key={idx} className="mb-3 p-3 bg-light rounded-3 border">
              <div className="fw-bold small text-dark">{proj.title || proj.name}</div>
              <p className="extra-small text-secondary mb-1">{proj.description}</p>
              {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="extra-small text-primary">🔗 {proj.link}</a>}
            </div>
          ))}
        </div>
      )}

      {renderCertificationsList()}
      {renderAchievementsList()}
      {renderLanguagesList()}
    </div>
  );

  // Route to Selected Renderer
  switch (selectedTemplate.toUpperCase()) {
    case "MODERN":
      return renderModern();
    case "ATS":
    case "ATS_MINIMAL":
      return renderATS();
    case "VERTICAL":
      return renderVertical();
    case "CREATIVE":
      return renderCreative();
    case "DEVELOPER":
      return renderDeveloper();
    case "PROFILE":
      return renderProfile();
    case "CLASSIC":
    default:
      return renderClassic();
  }
}

export default ResumePreview;
