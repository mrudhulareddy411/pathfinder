import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BACKEND_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

/** Prepend backend origin for relative upload paths like /uploads/profiles/file.jpg */
const resolvePhotoUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return `${BACKEND_BASE}${trimmed}`;
  return null;
};

export const normalizeExternalUrl = (url) => {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

// ─── Profile Completion Calculator ───────────────────────────────────────────
// Checks each meaningful field that exists in the User schema.
// Returns { percent: number, missing: string[] }
const COMPLETION_FIELDS = [
  { key: "fullName",       label: "Full name" },
  { key: "email",          label: "Email address" },
  { key: "phone",          label: "Phone number" },
  { key: "educationLevel", label: "Degree level" },
  { key: "branch",         label: "Major / Branch" },
  { key: "college",        label: "College / University" },
  { key: "graduationYear", label: "Graduation year" },
  { key: "cgpa",           label: "CGPA / Percentage" },
  { key: "skills",         label: "Technical skills" },
  { key: "targetRole",     label: "Target role goal" },
  { key: "github",         label: "GitHub profile" },
  { key: "linkedin",       label: "LinkedIn profile" },
  { key: "portfolio",      label: "Portfolio / website" },
  { key: "profileImage",   label: "Profile photo" },
];

const isFilled = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return Boolean(value);
};

const calculateCompletion = (data) => {
  const missing = [];
  let filled = 0;

  for (const field of COMPLETION_FIELDS) {
    // For github/linkedin/portfolio check both the bare and *Url variants
    let value = data[field.key];
    if (field.key === "github")    value = data.githubUrl   || data.github   || "";
    if (field.key === "linkedin")  value = data.linkedinUrl || data.linkedin || "";
    if (field.key === "portfolio") value = data.portfolioUrl || data.portfolio || "";

    if (isFilled(value)) {
      filled++;
    } else {
      missing.push(field.label);
    }
  }

  const percent = Math.round((filled / COMPLETION_FIELDS.length) * 100);
  return { percent, missing };
};
// ─────────────────────────────────────────────────────────────────────────────

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const isEditRoute =
    location.pathname === "/profile/edit" ||
    location.pathname === "/edit-profile" ||
    Boolean(location.state?.edit);

  const [editing, setEditing] = useState(isEditRoute);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({
    type: location.state?.message ? "success" : "",
    message: location.state?.message || "",
  });
  const [newSkill, setNewSkill] = useState("");

  // Auto-switch to edit mode if route or location state changes to edit
  useEffect(() => {
    if (
      location.pathname === "/profile/edit" ||
      location.pathname === "/edit-profile" ||
      location.state?.edit
    ) {
      setEditing(true);
    }
    if (location.state?.message) {
      setSaveStatus({ type: "success", message: location.state.message });
    }
  }, [location.pathname, location.state]);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState(null); // data-URL from file picker
  const [photoFile, setPhotoFile] = useState(null);       // raw File object
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [savedPhotoUrl, setSavedPhotoUrl] = useState(null); // URL stored in MongoDB

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    educationLevel: "",
    semester: "",
    graduationYear: "",
    cgpa: "",
    targetRole: "",
    careerGoal: "",
    linkedin: "",
    linkedinUrl: "",
    github: "",
    githubUrl: "",
    portfolio: "",
    portfolioUrl: "",
    skills: [],
  });

  const fetchMe = async () => {
    try {
      setLoading(true);
      let uData = null;
      try {
        const res = await api.get("/users/profile");
        if (res.data && res.data.user) {
          uData = res.data.user;
        }
      } catch {
        const res = await api.get("/auth/me");
        uData = res.data;
      }

      if (uData) {
        setUser(uData);
        // Resolve and store the saved profile photo URL
        const resolvedPhoto = resolvePhotoUrl(uData.profileImage || uData.profilePhoto);
        setSavedPhotoUrl(resolvedPhoto);
        setPhotoPreview(null); // clear any local preview on fresh load
        setPhotoFile(null);
        setFormData({
          fullName: uData.fullName || "",
          email: uData.email || "",
          phone: uData.phone || "",
          college: uData.college || "",
          branch: uData.branch || uData.course || "",
          educationLevel: uData.educationLevel || uData.education || "B.Tech",
          semester: uData.semester || "",
          graduationYear: uData.graduationYear || "",
          cgpa: uData.cgpa || "",
          targetRole: uData.targetRole || uData.careerGoal || uData.selectedCareerDetails?.title || "",
          careerGoal: uData.careerGoal || uData.targetRole || "",
          linkedin: uData.linkedinUrl || uData.linkedin || "",
          linkedinUrl: uData.linkedinUrl || uData.linkedin || "",
          github: uData.githubUrl || uData.github || "",
          githubUrl: uData.githubUrl || uData.github || "",
          portfolio: uData.portfolioUrl || uData.portfolio || "",
          portfolioUrl: uData.portfolioUrl || uData.portfolio || "",
          skills: Array.isArray(uData.skills) ? uData.skills : [],
        });
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  // ─── Photo Handlers ───────────────────────────────────────────────────────────
  const handlePhotoSelect = (e) => {
    setPhotoError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowed.includes(file.type)) {
      setPhotoError("Please upload a JPG, JPEG, or PNG image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be smaller than 5 MB.");
      return;
    }

    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
    // Reset the file input so same file can be re-selected after remove
    e.target.value = "";
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return null;
    try {
      setPhotoUploading(true);
      const formPayload = new FormData();
      formPayload.append("photo", photoFile);
      const res = await api.post("/users/profile/photo", formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data?.photoUrl) {
        const resolved = resolvePhotoUrl(res.data.photoUrl);
        setSavedPhotoUrl(resolved);
        setPhotoPreview(null);
        setPhotoFile(null);
        return resolved;
      }
      return null;
    } catch (err) {
      setPhotoError(err.response?.data?.message || "Failed to upload photo.");
      return null;
    } finally {
      setPhotoUploading(false);
    }
  };

  const handlePhotoRemove = async () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    setPhotoError("");
    // If there is a saved photo, also clear it on the backend
    if (savedPhotoUrl) {
      try {
        await api.delete("/users/profile/photo");
        setSavedPhotoUrl(null);
        setUser((prev) => prev ? { ...prev, profileImage: null, profilePhoto: null } : prev);
        setSaveStatus({ type: "success", message: "Profile photo removed." });
        setTimeout(() => setSaveStatus({ type: "", message: "" }), 3000);
      } catch (err) {
        setSaveStatus({ type: "error", message: "Could not remove photo from server." });
      }
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setSaveStatus({ type: "error", message: "Full Name is required." });
      return false;
    }
    return true;
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaveStatus({ type: "", message: "" });

    if (!validateForm()) return;

    try {
      setSaving(true);

      // If there is a pending photo file, upload it first
      if (photoFile) {
        await handlePhotoUpload();
      }

      const rawGithub = formData.githubUrl || formData.github;
      const rawLinkedin = formData.linkedinUrl || formData.linkedin;
      const rawPortfolio = formData.portfolioUrl || formData.portfolio;

      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        college: formData.college,
        branch: formData.branch,
        educationLevel: formData.educationLevel,
        semester: formData.semester,
        graduationYear: formData.graduationYear,
        cgpa: formData.cgpa,
        targetRole: formData.targetRole || formData.careerGoal,
        careerGoal: formData.targetRole || formData.careerGoal,
        github: rawGithub,
        githubUrl: rawGithub,
        linkedin: rawLinkedin,
        linkedinUrl: rawLinkedin,
        portfolio: rawPortfolio,
        portfolioUrl: rawPortfolio,
        skills: formData.skills,
      };

      let res;
      try {
        res = await api.put("/users/profile", payload);
      } catch {
        res = await api.put("/auth/profile", payload);
      }

      if (res.data) {
        setSaveStatus({ type: "success", message: "Profile updated successfully! ✓" });
        setEditing(false);
        await fetchMe();
        setTimeout(() => setSaveStatus({ type: "", message: "" }), 4000);
      }
    } catch (err) {
      console.error("Save profile error:", err);
      setSaveStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to save profile changes. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
    }
    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const firstInitial = (formData.fullName || "K")[0].toUpperCase();

  const githubDisplay = formData.githubUrl || formData.github;
  const linkedinDisplay = formData.linkedinUrl || formData.linkedin;
  const portfolioDisplay = formData.portfolioUrl || formData.portfolio;

  // The "live" avatar to show: local preview > saved URL > null
  const liveAvatar = photoPreview || savedPhotoUrl;

  // Dynamic completion — recalculates on every formData/photo change
  const { percent: completionPercent, missing: missingFields } = calculateCompletion({
    fullName:      formData.fullName,
    email:         formData.email,
    phone:         formData.phone,
    educationLevel: formData.educationLevel,
    branch:        formData.branch,
    college:       formData.college,
    graduationYear: formData.graduationYear,
    cgpa:          formData.cgpa,
    skills:        formData.skills,
    targetRole:    formData.targetRole || formData.careerGoal,
    github:        formData.github,
    githubUrl:     formData.githubUrl,
    linkedin:      formData.linkedin,
    linkedinUrl:   formData.linkedinUrl,
    portfolio:     formData.portfolio,
    portfolioUrl:  formData.portfolioUrl,
    // Count photo as complete if there is a local preview OR a saved photo URL
    profileImage:  liveAvatar || null,
  });

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />

      <div className="container py-4" style={{ maxWidth: "1050px" }}>
        {saveStatus.message && (
          <div
            className={`clean-card p-3 mb-4 text-center fw-semibold ${
              saveStatus.type === "success"
                ? "border-success bg-success  text-success"
                : "border-danger bg-danger  text-danger"
            }`}
          >
            {saveStatus.message}
          </div>
        )}

        {/* PROFILE HEADER CARD */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-3">
              {/* Avatar: photo if available, else initial */}
              {liveAvatar ? (
                <img
                  src={liveAvatar}
                  alt="Profile"
                  className="rounded-circle flex-shrink-0"
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    border: "2px solid #2563EB",
                  }}
                  onError={(e) => { e.target.onerror = null; setSavedPhotoUrl(null); }}
                />
              ) : (
                <div
                  className="rounded-circle text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                  style={{ width: "64px", height: "64px", backgroundColor: "#2563EB", fontSize: "24px" }}
                >
                  {firstInitial}
                </div>
              )}
              <div>
                <h3 className="fw-bold text-dark mb-0">{formData.fullName || "Student Profile"}</h3>
                <p className="text-secondary small mb-1">
                  {formData.educationLevel} {formData.branch} • {formData.college}
                </p>
                <span className="badge badge-clean-blue">Target Role: {formData.targetRole || formData.careerGoal}</span>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn btn-outline-clean">
                  ✏️ Edit Profile
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving} className="btn btn-primary-clean">
                  {saving ? "Saving..." : "💾 Save Changes"}
                </button>
              )}
            </div>
          </div>

          {/* PROFILE COMPLETION PROGRESS */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between text-secondary extra-small fw-semibold mb-1">
              <span>Profile Completion</span>
              <span
                className="fw-bold"
                style={{
                  color:
                    completionPercent === 100
                      ? "#16A34A"
                      : completionPercent >= 70
                      ? "#2563EB"
                      : "#D97706",
                }}
              >
                {completionPercent}% Complete
              </span>
            </div>
            <div className="progress rounded-pill bg-light" style={{ height: "6px" }}>
              <div
                className="progress-bar rounded-pill"
                style={{
                  width: `${completionPercent}%`,
                  backgroundColor:
                    completionPercent === 100
                      ? "#16A34A"
                      : completionPercent >= 70
                      ? "#2563EB"
                      : "#D97706",
                  transition: "width 0.5s ease",
                }}
              ></div>
            </div>

            {/* Missing fields hint */}
            {missingFields.length > 0 && (
              <div
                className="mt-2 p-2 rounded"
                style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}
              >
                <p
                  className="fw-semibold mb-1 extra-small"
                  style={{ color: "#92400E" }}
                >
                  Almost there! Complete these:
                </p>
                <ul className="mb-0 ps-3 extra-small" style={{ color: "#78350F" }}>
                  {missingFields.slice(0, 5).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                  {missingFields.length > 5 && (
                    <li>+{missingFields.length - 5} more fields</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* ── PROFILE PHOTO UPLOAD CARD ─────────────────────────────────────── */}
        <div className="clean-card p-4 mb-4">
          <h5 className="fw-bold text-dark mb-3">Profile Photo</h5>
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-4">

            {/* Circular avatar preview */}
            <div className="flex-shrink-0">
              {liveAvatar ? (
                <img
                  src={liveAvatar}
                  alt="Profile preview"
                  className="rounded-circle"
                  style={{
                    width: "96px",
                    height: "96px",
                    objectFit: "cover",
                    border: "3px solid #2563EB",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.15)",
                  }}
                  onError={(e) => { e.target.onerror = null; setSavedPhotoUrl(null); setPhotoPreview(null); }}
                />
              ) : (
                <div
                  className="rounded-circle text-dark fw-bold d-flex align-items-center justify-content-center"
                  style={{
                    width: "96px",
                    height: "96px",
                    backgroundColor: "#2563EB",
                    fontSize: "36px",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.15)",
                  }}
                >
                  {firstInitial}
                </div>
              )}
            </div>

            {/* Upload controls */}
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap gap-2 mb-2">
                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  style={{ display: "none" }}
                  onChange={handlePhotoSelect}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-primary-clean btn-sm"
                  disabled={photoUploading}
                >
                  {photoPreview ? "🔄 Change Photo" : "📷 Upload Photo"}
                </button>

                {(liveAvatar) && (
                  <button
                    type="button"
                    onClick={handlePhotoRemove}
                    className="btn btn-outline-clean btn-sm"
                    style={{ color: "#DC2626", borderColor: "#FCA5A5" }}
                    disabled={photoUploading}
                  >
                    🗑 Remove
                  </button>
                )}
              </div>

              {photoPreview && !savedPhotoUrl && (
                <div className="extra-small text-secondary mb-1">
                  ⚠ Preview only — click <strong>Save Changes</strong> to apply.
                </div>
              )}
              {photoPreview && (
                <div className="extra-small fw-semibold mb-1" style={{ color: "#16A34A" }}>
                  ✓ Photo selected — ready to save.
                </div>
              )}

              {photoError && (
                <div className="extra-small fw-semibold mb-1" style={{ color: "#DC2626" }}>
                  ⚠ {photoError}
                </div>
              )}

              <div className="extra-small text-muted">
                Supported: JPG, JPEG, PNG &nbsp;•&nbsp; Max size: 5 MB
              </div>
            </div>
          </div>
        </div>
        {/* ──────────────────────────────────────────────────────────────────── */}

        {/* EDIT / VIEW SECTIONS FORM */}
        <form onSubmit={handleSave}>
          <div className="row g-4 mb-4">
            {/* 1. PERSONAL INFORMATION */}
            <div className="col-12 col-md-6">
              <div className="clean-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">Personal Information</h5>
                <div className="d-flex flex-column gap-3 extra-small">
                  <div>
                    <label className="fw-semibold text-secondary mb-1">Full Name</label>
                    {editing ? (
                      <input
                        type="text"
                        className="form-control border-subtle small"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        style={{ borderColor: "#E2E8F0" }}
                        placeholder="Your full name"
                      />
                    ) : (
                      <div className="fw-bold text-dark small">{formData.fullName || "Not specified"}</div>
                    )}
                  </div>

                  <div>
                    <label className="fw-semibold text-secondary mb-1">Email Address</label>
                    <div className="fw-bold text-dark small">{formData.email || "Not specified"}</div>
                  </div>

                  <div>
                    <label className="fw-semibold text-secondary mb-1">Phone Number</label>
                    {editing ? (
                      <input
                        type="text"
                        className="form-control border-subtle small"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        style={{ borderColor: "#E2E8F0" }}
                        placeholder="+91 98765 43210"
                      />
                    ) : (
                      <div className="fw-bold text-dark small">{formData.phone || "Not specified"}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. EDUCATION */}
            <div className="col-12 col-md-6">
              <div className="clean-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-3">Education</h5>
                <div className="d-flex flex-column gap-3 extra-small">
                  <div>
                    <label className="fw-semibold text-secondary mb-1">Degree & Major</label>
                    {editing ? (
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          value={formData.educationLevel}
                          onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
                          style={{ borderColor: "#E2E8F0" }}
                          placeholder="Degree (e.g. B.Tech)"
                        />
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          value={formData.branch}
                          onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                          style={{ borderColor: "#E2E8F0" }}
                          placeholder="Major / Branch"
                        />
                      </div>
                    ) : (
                      <div className="fw-bold text-dark small">
                        {formData.educationLevel} in {formData.branch}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="fw-semibold text-secondary mb-1">College / University</label>
                    {editing ? (
                      <input
                        type="text"
                        className="form-control border-subtle small"
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        style={{ borderColor: "#E2E8F0" }}
                        placeholder="College name"
                      />
                    ) : (
                      <div className="fw-bold text-dark small">{formData.college || "Not specified"}</div>
                    )}
                  </div>

                  <div className="d-flex gap-2">
                    <div className="flex-grow-1">
                      <label className="fw-semibold text-secondary mb-1">Semester / Year</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          value={formData.semester}
                          onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                          style={{ borderColor: "#E2E8F0" }}
                          placeholder="e.g. 5th Semester"
                        />
                      ) : (
                        <div className="fw-bold text-dark small">{formData.semester || "Not specified"}</div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <label className="fw-semibold text-secondary mb-1">Graduation Year</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          value={formData.graduationYear}
                          onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                          style={{ borderColor: "#E2E8F0" }}
                          placeholder="2027"
                        />
                      ) : (
                        <div className="fw-bold text-dark small">{formData.graduationYear || "Not specified"}</div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <label className="fw-semibold text-secondary mb-1">CGPA / Percentage</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          value={formData.cgpa}
                          onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                          style={{ borderColor: "#E2E8F0" }}
                          placeholder="8.8"
                        />
                      ) : (
                        <div className="fw-bold text-dark small">{formData.cgpa ? `${formData.cgpa}` : "Not specified"}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. TECHNICAL SKILLS */}
            <div className="col-12 col-md-6">
              <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <h5 className="fw-bold text-dark mb-3">Technical Skills</h5>
                  <div className="d-flex flex-wrap gap-1.5 mb-3">
                    {formData.skills.map((s, i) => (
                      <span key={i} className="badge badge-clean-blue d-inline-flex align-items-center gap-1">
                        {s}
                        {editing && (
                          <span
                            onClick={() => handleRemoveSkill(s)}
                            style={{ cursor: "pointer" }}
                            className="ms-1 text-danger fw-bold"
                          >
                            ×
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {editing && (
                  <div className="d-flex gap-2 pt-2 border-top">
                    <input
                      type="text"
                      className="form-control border-subtle extra-small"
                      placeholder="Add new skill..."
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      style={{ borderColor: "#E2E8F0" }}
                    />
                    <button type="button" onClick={handleAddSkill} className="btn btn-outline-clean btn-sm extra-small">
                      + Add
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 4. CAREER INTERESTS & SOCIAL LINKS (EDITABLE FORM) */}
            <div className="col-12 col-md-6">
              <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-dark mb-0">Career Interests & Social Links</h5>
                    {editing && (
                      <span className="badge badge-clean-blue extra-small">Editing Mode</span>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-3 extra-small">
                    {/* Target Role Goal */}
                    <div>
                      <label className="fw-semibold text-secondary mb-1">Target Role Goal</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          placeholder="e.g. Software Developer"
                          value={formData.targetRole || formData.careerGoal}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              targetRole: e.target.value,
                              careerGoal: e.target.value,
                            })
                          }
                          style={{ borderColor: "#E2E8F0" }}
                        />
                      ) : (
                        <div className="fw-bold text-dark small">
                          {formData.targetRole || formData.careerGoal || "Not specified"}
                        </div>
                      )}
                    </div>

                    {/* GitHub Profile */}
                    <div>
                      <label className="fw-semibold text-secondary mb-1">GitHub Profile</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          placeholder="github.com/username or https://github.com/username"
                          value={formData.githubUrl || formData.github}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              githubUrl: e.target.value,
                              github: e.target.value,
                            })
                          }
                          style={{ borderColor: "#E2E8F0" }}
                        />
                      ) : (
                        <div>
                          {githubDisplay ? (
                            <a
                              href={normalizeExternalUrl(githubDisplay)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary fw-semibold text-decoration-none"
                            >
                              {githubDisplay} ↗
                            </a>
                          ) : (
                            <span className="text-muted">Not specified</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* LinkedIn Profile */}
                    <div>
                      <label className="fw-semibold text-secondary mb-1">LinkedIn Profile</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          placeholder="linkedin.com/in/username or https://linkedin.com/in/username"
                          value={formData.linkedinUrl || formData.linkedin}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              linkedinUrl: e.target.value,
                              linkedin: e.target.value,
                            })
                          }
                          style={{ borderColor: "#E2E8F0" }}
                        />
                      ) : (
                        <div>
                          {linkedinDisplay ? (
                            <a
                              href={normalizeExternalUrl(linkedinDisplay)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary fw-semibold text-decoration-none"
                            >
                              {linkedinDisplay} ↗
                            </a>
                          ) : (
                            <span className="text-muted">Not specified</span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Portfolio / Personal Website */}
                    <div>
                      <label className="fw-semibold text-secondary mb-1">Portfolio / Personal Website</label>
                      {editing ? (
                        <input
                          type="text"
                          className="form-control border-subtle small"
                          placeholder="myportfolio.com or https://myportfolio.com"
                          value={formData.portfolioUrl || formData.portfolio}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              portfolioUrl: e.target.value,
                              portfolio: e.target.value,
                            })
                          }
                          style={{ borderColor: "#E2E8F0" }}
                        />
                      ) : (
                        <div>
                          {portfolioDisplay ? (
                            <a
                              href={normalizeExternalUrl(portfolioDisplay)}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary fw-semibold text-decoration-none"
                            >
                              {portfolioDisplay} ↗
                            </a>
                          ) : (
                            <span className="text-muted">Not specified</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="pt-3 border-top mt-3 text-end">
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="btn btn-primary-clean btn-sm"
                    >
                      {saving ? "Saving..." : "💾 Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer user={user} />
    </div>
  );
}

export default Profile;
