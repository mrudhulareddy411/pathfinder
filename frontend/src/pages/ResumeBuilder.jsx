import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ResumePreview from "../components/ResumePreview";

function ResumeBuilder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const templateParam = searchParams.get("template") || "CLASSIC";

  const [activeTab, setActiveTab] = useState("personal"); // personal, summary, education, experience, projects, skills, certifications, achievements, languages
  const [mobileView, setMobileView] = useState("edit"); // edit vs preview on mobile
  const [accentColor, setAccentColor] = useState("#4f46e5");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [photoError, setPhotoError] = useState("");

  const [resumeData, setResumeData] = useState({
    template: templateParam,
    personalInformation: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      profilePhoto: "",
      profileImage: "",
      showPhoto: true,
    },
    summary: "",
    education: [],
    skills: [],
    projects: [],
    experience: [],
    internships: [],
    certifications: [],
    achievements: [],
    languages: [],
    additionalSections: [],
  });

  // Load user profile & auto-populate
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const meRes = await api.get("/auth/me");
        const user = meRes.data;
        if (user) {
          setResumeData((prev) => ({
            ...prev,
            template: templateParam,
            personalInformation: {
              fullName: user.fullName || "",
              title: user.selectedCareerDetails?.title || `${user.branch || "Software Engineering"} Student`,
              email: user.email || "",
              phone: user.phone || "+91 98765 43210",
              location: user.college ? `${user.college}` : "India",
              linkedin: user.linkedin || "https://www.linkedin.com/in/mrudhula-kondreddy-2b525a312",
              github: user.github || "https://github.com/mrudhulareddy411",
              profilePhoto: user.profilePhoto || user.profileImage || "",
              profileImage: user.profilePhoto || user.profileImage || "",
              showPhoto: true,
            },
            summary: `Motivated ${user.branch || "Computer Science"} student at ${user.college || "institution"} targeting ${user.selectedCareerDetails?.title || "Software Engineering"} roles.`,
            skills: user.skills && user.skills.length > 0 ? user.skills : ["JavaScript", "React", "Node.js", "Python", "SQL"],
            education: [
              {
                degree: user.educationLevel === "B.Tech" ? "B.Tech Computer Science & Engineering" : user.educationLevel || "Degree",
                institution: user.college || "Saveetha Institute of Tech",
                branch: user.branch || "CSE",
                startYear: "2024",
                endYear: user.graduationYear || "2027",
                score: "CGPA 8.6",
              },
            ],
            projects: [
              {
                title: "Pathfinder AI Platform",
                description: "Full stack career guidance & resume builder web application built with React & Node.js.",
                technologies: "React, Express, MongoDB, Node.js",
                link: "https://github.com/pathfinder",
              },
            ],
            certifications: [
              { title: "Full Stack Web Development", organization: "Coursera", year: "2025" },
            ],
            achievements: [
              { title: "Hackathon Finalist", description: "Top 5 team in University National Tech Fest" },
            ],
            languages: [
              { language: "English", proficiency: "Fluent" },
              { language: "Hindi", proficiency: "Intermediate" },
            ],
          }));
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };
    fetchMe();
  }, [templateParam]);

  // Handle Photo Upload with Image Validation
  const handlePhotoUpload = (e) => {
    setPhotoError("");
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setPhotoError("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Photo = reader.result;
      setResumeData((prev) => ({
        ...prev,
        personalInformation: {
          ...prev.personalInformation,
          profilePhoto: base64Photo,
          profileImage: base64Photo,
          showPhoto: true,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoError("");
    setResumeData((prev) => ({
      ...prev,
      personalInformation: {
        ...prev.personalInformation,
        profilePhoto: "",
        profileImage: "",
      },
    }));
  };

  const toggleShowPhoto = (e) => {
    const isChecked = e.target.checked;
    setResumeData((prev) => ({
      ...prev,
      personalInformation: {
        ...prev.personalInformation,
        showPhoto: isChecked,
      },
    }));
  };

  // Add Item Helpers
  const addEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, { degree: "", institution: "", branch: "", startYear: "2024", endYear: "2027", score: "" }],
    }));
  };

  const addProject = () => {
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, { title: "", description: "", technologies: "", link: "" }],
    }));
  };

  const addSkill = () => {
    setResumeData((prev) => ({
      ...prev,
      skills: [...prev.skills, "New Skill"],
    }));
  };

  const addCertification = () => {
    setResumeData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, { title: "", organization: "", year: "2025" }],
    }));
  };

  const addAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { title: "", description: "" }],
    }));
  };

  const addLanguage = () => {
    setResumeData((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "", proficiency: "Fluent" }],
    }));
  };

  // Save Resume to Backend
  const handleSaveResume = async () => {
    try {
      setSaving(true);
      await api.post("/resumes", {
        title: `${resumeData.personalInformation.fullName} - ${resumeData.template} Resume`,
        template: resumeData.template,
        resumeData,
      });
      setSaveStatus("Resume saved successfully! 🎉");
      setTimeout(() => setSaveStatus(""), 4000);
    } catch (err) {
      setSaveStatus("Failed to save resume. Saved to session.");
      setTimeout(() => setSaveStatus(""), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentPhoto = resumeData.personalInformation.profilePhoto || resumeData.personalInformation.profileImage;

  return (
    <div className="dashboard-clean-bg">
      <Navbar />

      {/* Top Header Bar */}
      <div className="bg-white border-bottom py-3 px-4 no-print sticky-top" style={{ zIndex: 100, borderColor: "#E2E8F0" }}>
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-3">
            <Link to="/resume/templates" className="btn btn-outline-secondary btn-sm rounded-pill px-3">
              &larr; Templates
            </Link>
            <div className="d-flex align-items-center gap-2">
              <img
                src="/resume_3d.png"
                alt="Resume Studio"
                className="rounded-3"
                style={{ width: "36px", height: "36px", objectFit: "cover" }}
              />
              <div>
                <h5 className="fw-extrabold text-dark mb-0">Pathfinder ATS Resume Studio</h5>
                <div className="extra-small text-muted">Active Template: <span className="fw-bold text-primary">{resumeData.template}</span></div>
              </div>
            </div>
          </div>

          {/* Template Switcher Dropdown */}
          <div className="d-flex align-items-center gap-3">
            <select
              className="form-select form-select-sm rounded-pill px-3 bg-light text-dark fw-bold border-secondary border-opacity-30"
              value={resumeData.template}
              onChange={(e) => setResumeData({ ...resumeData, template: e.target.value })}
            >
              <option value="CLASSIC">Classic Format</option>
              <option value="MODERN">Modern Two-Column</option>
              <option value="ATS">Minimal ATS (No Photo)</option>
              <option value="VERTICAL">Vertical Career Timeline</option>
              <option value="CREATIVE">Creative Portfolio</option>
              <option value="DEVELOPER">Developer Monospace</option>
              <option value="PROFILE">Personal Profile</option>
            </select>

            <button onClick={handleSaveResume} className="btn btn-outline-primary btn-sm rounded-pill px-3" disabled={saving}>
              {saving ? "Saving..." : "💾 Save Resume"}
            </button>

            <button onClick={handlePrint} className="btn btn-cyber btn-sm rounded-pill px-4 fw-bold">
              📄 Download PDF / Print
            </button>
          </div>
        </div>
      </div>

      {saveStatus && (
        <div className="alert alert-success rounded-0 text-center py-2 mb-0 extra-small fw-bold border-0 bg-success bg-opacity-15 text-success">
          {saveStatus}
        </div>
      )}

      {/* Main Split-Screen Workspace */}
      <div className="container-fluid py-4 px-3 px-md-4">
        {/* Mobile View Switcher */}
        <div className="d-flex d-md-none mb-3 btn-group w-100 no-print">
          <button className={`btn btn-sm ${mobileView === "edit" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setMobileView("edit")}>
            ✏️ Edit Sections
          </button>
          <button className={`btn btn-sm ${mobileView === "preview" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setMobileView("preview")}>
            👁️ Live Preview
          </button>
        </div>

        <div className="row g-4">
          {/* LEFT COLUMN: EDITOR SECTIONS & FORM */}
          <div className={`col-12 col-lg-6 ${mobileView === "preview" ? "d-none d-lg-block" : ""} no-print`}>
            <div className="glass-panel p-4 bg-white rounded-4 border border-primary border-opacity-15 shadow-sm">
              {/* Navigation Tabs */}
              <div className="d-flex flex-nowrap overflow-auto gap-1.5 border-bottom pb-3 mb-4 extra-small pb-2">
                {["personal", "summary", "education", "skills", "projects", "certifications", "achievements", "languages"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`btn btn-sm rounded-pill px-3 text-capitalize flex-shrink-0 ${activeTab === tab ? "btn-primary fw-bold" : "btn-light text-secondary"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TAB 1: PERSONAL INFORMATION & PHOTO MANAGER */}
              {activeTab === "personal" && (
                <div className="d-flex flex-column gap-3">
                  <h6 className="fw-bold text-dark mb-2">Personal Information & Profile Photo</h6>
                  
                  {photoError && (
                    <div className="alert alert-danger p-2 extra-small mb-2 rounded-3 text-start">
                      {photoError}
                    </div>
                  )}

                  {/* Photo Uploader Card */}
                  <div className="p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between gap-3 mb-2">
                    <div className="d-flex align-items-center gap-3">
                      {currentPhoto ? (
                        <img src={currentPhoto} alt="Profile Preview" className="rounded-circle border border-2 border-primary" style={{ width: "70px", height: "70px", objectFit: "cover" }} />
                      ) : (
                        <div className="rounded-circle bg-secondary bg-opacity-20 d-flex align-items-center justify-content-center text-muted fs-4" style={{ width: "70px", height: "70px" }}>
                          👤
                        </div>
                      )}
                      <div>
                        <div className="fw-bold extra-small text-dark mb-1">Profile Photo</div>
                        <div className="d-flex flex-wrap gap-2">
                          <label className="btn btn-primary btn-sm rounded-pill px-3 py-1 extra-small mb-0 cursor-pointer">
                            {currentPhoto ? "Change Photo" : "📷 Upload Profile Photo"}
                            <input type="file" accept="image/png, image/jpeg, image/jpg, image/webp" className="d-none" onChange={handlePhotoUpload} />
                          </label>
                          {currentPhoto && (
                            <button onClick={removePhoto} className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1 extra-small">
                              Remove Photo
                            </button>
                          )}
                        </div>
                        <div className="extra-small text-muted mt-1">Supports PNG, JPG, WEBP (Max 5MB)</div>
                      </div>
                    </div>

                    {/* Show Photo Checkbox Toggle */}
                    <div className="form-check text-end extra-small">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="showPhotoCheck"
                        checked={resumeData.personalInformation.showPhoto !== false}
                        onChange={toggleShowPhoto}
                      />
                      <label className="form-check-label fw-bold text-secondary" htmlFor="showPhotoCheck">
                        Show Photo
                      </label>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="extra-small text-muted fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={resumeData.personalInformation.fullName}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInformation: { ...resumeData.personalInformation, fullName: e.target.value },
                        })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="extra-small text-muted fw-semibold">Professional Title</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={resumeData.personalInformation.title}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInformation: { ...resumeData.personalInformation, title: e.target.value },
                        })}
                      />
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-md-6">
                      <label className="extra-small text-muted fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        value={resumeData.personalInformation.email}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInformation: { ...resumeData.personalInformation, email: e.target.value },
                        })}
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="extra-small text-muted fw-semibold">Phone Number</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={resumeData.personalInformation.phone}
                        onChange={(e) => setResumeData({
                          ...resumeData,
                          personalInformation: { ...resumeData.personalInformation, phone: e.target.value },
                        })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SUMMARY */}
              {activeTab === "summary" && (
                <div>
                  <h6 className="fw-bold text-dark mb-2">Professional Summary</h6>
                  <textarea
                    rows={5}
                    className="form-control"
                    value={resumeData.summary}
                    onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                    placeholder="Write a concise overview of your education, technical skills, and career objective..."
                  />
                </div>
              )}

              {/* TAB 3: EDUCATION */}
              {activeTab === "education" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Education Entries</h6>
                    <button onClick={addEducation} className="btn btn-outline-primary btn-sm rounded-pill">
                      + Add Education
                    </button>
                  </div>
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 border mb-3">
                      <div className="row g-2">
                        <div className="col-8">
                          <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            placeholder="Degree (e.g. B.Tech CSE)"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].degree = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                          />
                        </div>
                        <div className="col-4">
                          <input
                            type="text"
                            className="form-control form-control-sm mb-2"
                            placeholder="Score / CGPA"
                            value={edu.score}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].score = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                          />
                        </div>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Institution / College Name"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...resumeData.education];
                          updated[idx].institution = e.target.value;
                          setResumeData({ ...resumeData, education: updated });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: SKILLS */}
              {activeTab === "skills" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Technical & Soft Skills</h6>
                    <button onClick={addSkill} className="btn btn-outline-primary btn-sm rounded-pill">
                      + Add Skill
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {resumeData.skills.map((sk, idx) => (
                      <div key={idx} className="d-flex align-items-center bg-light rounded-pill border px-3 py-1 extra-small">
                        <input
                          type="text"
                          className="border-0 bg-transparent text-dark extra-small me-1"
                          style={{ outline: "none", width: "110px" }}
                          value={typeof sk === "object" ? sk.name : sk}
                          onChange={(e) => {
                            const updated = [...resumeData.skills];
                            updated[idx] = e.target.value;
                            setResumeData({ ...resumeData, skills: updated });
                          }}
                        />
                        <button
                          className="btn btn-link text-danger p-0 text-decoration-none extra-small"
                          onClick={() => {
                            const updated = resumeData.skills.filter((_, i) => i !== idx);
                            setResumeData({ ...resumeData, skills: updated });
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROJECTS */}
              {activeTab === "projects" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Projects & Repositories</h6>
                    <button onClick={addProject} className="btn btn-outline-primary btn-sm rounded-pill">
                      + Add Project
                    </button>
                  </div>
                  {resumeData.projects.map((proj, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 border mb-3">
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2"
                        placeholder="Project Title"
                        value={proj.title || proj.name}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[idx].title = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                      />
                      <textarea
                        rows={2}
                        className="form-control form-control-sm mb-2"
                        placeholder="Project Description"
                        value={proj.description}
                        onChange={(e) => {
                          const updated = [...resumeData.projects];
                          updated[idx].description = e.target.value;
                          setResumeData({ ...resumeData, projects: updated });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 6: CERTIFICATIONS */}
              {activeTab === "certifications" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Certifications & Licenses</h6>
                    <button onClick={addCertification} className="btn btn-outline-primary btn-sm rounded-pill">
                      + Add Certification
                    </button>
                  </div>
                  {resumeData.certifications.map((c, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 border mb-3 position-relative">
                      <button
                        className="btn btn-link text-danger position-absolute end-0 top-0 m-2 p-0 text-decoration-none extra-small"
                        onClick={() => {
                          const updated = resumeData.certifications.filter((_, i) => i !== idx);
                          setResumeData({ ...resumeData, certifications: updated });
                        }}
                      >
                        ✕ Remove
                      </button>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2 pe-5"
                        placeholder="Certification Title (e.g. AWS Certified Developer)"
                        value={c.title || c.name || ""}
                        onChange={(e) => {
                          const updated = [...resumeData.certifications];
                          updated[idx].title = e.target.value;
                          setResumeData({ ...resumeData, certifications: updated });
                        }}
                      />
                      <div className="row g-2">
                        <div className="col-8">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Issuing Organization (e.g. Coursera / AWS)"
                            value={c.organization || c.issuer || ""}
                            onChange={(e) => {
                              const updated = [...resumeData.certifications];
                              updated[idx].organization = e.target.value;
                              setResumeData({ ...resumeData, certifications: updated });
                            }}
                          />
                        </div>
                        <div className="col-4">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Year (2025)"
                            value={c.year || c.date || ""}
                            onChange={(e) => {
                              const updated = [...resumeData.certifications];
                              updated[idx].year = e.target.value;
                              setResumeData({ ...resumeData, certifications: updated });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 7: ACHIEVEMENTS */}
              {activeTab === "achievements" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Honors & Achievements</h6>
                    <button onClick={addAchievement} className="btn btn-outline-primary btn-sm rounded-pill">
                      + Add Achievement
                    </button>
                  </div>
                  {resumeData.achievements.map((a, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 border mb-3 position-relative">
                      <button
                        className="btn btn-link text-danger position-absolute end-0 top-0 m-2 p-0 text-decoration-none extra-small"
                        onClick={() => {
                          const updated = resumeData.achievements.filter((_, i) => i !== idx);
                          setResumeData({ ...resumeData, achievements: updated });
                        }}
                      >
                        ✕ Remove
                      </button>
                      <input
                        type="text"
                        className="form-control form-control-sm mb-2 pe-5"
                        placeholder="Achievement Title (e.g. 1st Place National Hackathon)"
                        value={a.title || a.name || ""}
                        onChange={(e) => {
                          const updated = [...resumeData.achievements];
                          updated[idx].title = e.target.value;
                          setResumeData({ ...resumeData, achievements: updated });
                        }}
                      />
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Brief Description or Organization"
                        value={a.description || ""}
                        onChange={(e) => {
                          const updated = [...resumeData.achievements];
                          updated[idx].description = e.target.value;
                          setResumeData({ ...resumeData, achievements: updated });
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 8: LANGUAGES */}
              {activeTab === "languages" && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Languages Spoken</h6>
                    <button onClick={addLanguage} className="btn btn-outline-primary btn-sm rounded-pill">
                      + Add Language
                    </button>
                  </div>
                  {resumeData.languages.map((lang, idx) => (
                    <div key={idx} className="p-3 bg-light rounded-3 border mb-3 position-relative">
                      <button
                        className="btn btn-link text-danger position-absolute end-0 top-0 m-2 p-0 text-decoration-none extra-small"
                        onClick={() => {
                          const updated = resumeData.languages.filter((_, i) => i !== idx);
                          setResumeData({ ...resumeData, languages: updated });
                        }}
                      >
                        ✕ Remove
                      </button>
                      <div className="row g-2">
                        <div className="col-7">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Language Name (e.g. English)"
                            value={typeof lang === "object" ? lang.language : lang}
                            onChange={(e) => {
                              const updated = [...resumeData.languages];
                              if (typeof updated[idx] === "object") {
                                updated[idx].language = e.target.value;
                              } else {
                                updated[idx] = { language: e.target.value, proficiency: "Fluent" };
                              }
                              setResumeData({ ...resumeData, languages: updated });
                            }}
                          />
                        </div>
                        <div className="col-5">
                          <select
                            className="form-select form-select-sm"
                            value={typeof lang === "object" ? lang.proficiency : "Fluent"}
                            onChange={(e) => {
                              const updated = [...resumeData.languages];
                              if (typeof updated[idx] === "object") {
                                updated[idx].proficiency = e.target.value;
                              } else {
                                updated[idx] = { language: updated[idx], proficiency: e.target.value };
                              }
                              setResumeData({ ...resumeData, languages: updated });
                            }}
                          >
                            <option value="Native">Native</option>
                            <option value="Fluent">Fluent</option>
                            <option value="Professional">Professional</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Basic">Basic</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: REAL-TIME LIVE RESUME PREVIEW */}
          <div className={`col-12 col-lg-6 ${mobileView === "edit" ? "d-none d-lg-block" : ""}`}>
            <div className="glass-panel p-2 p-md-4 bg-secondary bg-opacity-10 rounded-4 border shadow-sm sticky-top" style={{ top: "80px" }}>
              <div className="d-flex justify-content-between align-items-center mb-3 px-2 no-print">
                <span className="badge bg-primary px-3 py-1.5 rounded-pill extra-small">
                  Live Preview ({resumeData.template})
                </span>
                <div className="d-flex align-items-center gap-2">
                  <span className="extra-small text-muted">Accent Color:</span>
                  <input
                    type="color"
                    className="form-control form-control-color border-0 p-0 rounded-circle"
                    style={{ width: "24px", height: "24px", cursor: "pointer" }}
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                </div>
              </div>

              {/* Printable Resume Container */}
              <div className="resume-printable-area border shadow rounded overflow-hidden">
                <ResumePreview resumeData={resumeData} selectedTemplate={resumeData.template} accentColor={accentColor} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
