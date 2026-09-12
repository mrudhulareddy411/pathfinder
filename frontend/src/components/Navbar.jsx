import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../services/authService";
import api from "../services/api";

function Navbar({ user: initialUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const [user, setUser] = useState(initialUser || null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Sync state if initialUser prop changes
  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  // Self-fetch user profile from MongoDB Atlas if user prop is missing
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        if (res.data && res.data.user) {
          setUser(res.data.user);
        } else {
          const meRes = await api.get("/auth/me");
          if (meRes.data) setUser(meRes.data);
        }
      } catch (err) {
        console.log("Navbar profile fetch info:", err.message);
      }
    };

    fetchUserProfile();
  }, [location.pathname]);

  // Click-outside listener to automatically close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logoutUser();
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/assessment", label: "Assessment" },
    { path: "/career-pathfinder", label: "Career Pathfinder" },
    { path: "/resumes", label: "Resume Builder" },
    { path: "/resources", label: "Learning Hub" },
    { path: "/projects", label: "Projects" },
    { path: "/challenges", label: "Challenges" },
    { path: "/skills", label: "Skills Gap" },
    { path: "/academics", label: "Academic Tracker" },
    { path: "/settings", label: "Settings" },
  ];

  const fullName = user?.fullName || "Student Profile";
  const firstInitial = fullName.trim()[0]?.toUpperCase() || "S";
  // Resolve photo URL — handle both absolute URLs and relative /uploads paths
  const rawPhoto = user?.profileImage || user?.profilePhoto || null;
  const BACKEND_BASE = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "http://localhost:5000";
  const userPhoto = rawPhoto
    ? /^https?:\/\//i.test(rawPhoto)
      ? rawPhoto
      : `${BACKEND_BASE}${rawPhoto.startsWith("/") ? "" : "/"}${rawPhoto}`
    : null;
  const userLevel = user?.levelNumber || user?.profileLevel || 1;
  const userEmail = user?.email || "";

  const education = user?.educationLevel || user?.education || "Degree";
  const course = user?.branch || user?.course || "";
  const college = user?.college || "";
  const graduationYear = user?.graduationYear || "";
  const skillsFormatted =
    Array.isArray(user?.skills) && user.skills.length > 0
      ? user.skills.slice(0, 4).join(" • ")
      : "Python • Java • SQL • React";

  // Calculate profile completion percentage
  let profileCompletion = 0;
  if (user) {
    const fields = [
      "fullName", "email", "phone", "educationLevel", "branch",
      "college", "graduationYear", "cgpa", "skills", "targetRole",
      "github", "linkedin", "portfolio", "profileImage"
    ];
    let filled = 0;
    fields.forEach(f => {
      const val = user[f];
      if (val !== null && val !== undefined) {
        if (typeof val === 'string' && val.trim().length > 0) filled++;
        else if (Array.isArray(val) && val.length > 0) filled++;
        else if (typeof val !== 'string' && !Array.isArray(val) && Boolean(val)) filled++;
      }
    });
    profileCompletion = Math.round((filled / fields.length) * 100);
  }

  return (
    <nav
      className="navbar navbar-expand-xl sticky-top px-3 border-bottom"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderColor: "rgba(0, 0, 0, 0.05)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.05)",
        zIndex: 1050,
      }}
    >
      <div className="container-fluid px-2 d-flex align-items-center justify-content-between">
        <Link className="navbar-brand fw-bold text-dark fs-5 d-flex align-items-center gap-2 me-3 text-decoration-none" to="/dashboard">
          <div
            className="rounded-3 text-dark fw-bold d-flex align-items-center justify-content-center"
            style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", fontSize: "16px", boxShadow: "0 2px 10px rgba(14, 165, 233, 0.3)" }}
          >
            P
          </div>
          <span style={{ color: "#0f172a", letterSpacing: "-0.01em" }}>Pathfinder AI</span>
        </Link>

        {/* TOP-RIGHT CLICKABLE PROFILE MENU SECTION */}
        <div className="d-flex align-items-center gap-2 order-xl-last" ref={dropdownRef}>
          {user ? (
            <div className="position-relative">
              {/* CLICKABLE PROFILE AVATAR ICON BUTTON */}
              <button
                type="button"
                id="profile-dropdown-btn"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDropdownOpen((prev) => !prev);
                }}
                className="btn p-1 rounded-circle border text-start d-flex align-items-center justify-content-center"
                style={{ cursor: "pointer", borderColor: "rgba(0, 0, 0, 0.1)", background: "rgba(255, 255, 255, 0.9)" }}
                aria-expanded={dropdownOpen}
                aria-label="Toggle user profile menu"
                title={fullName}
              >
                {/* CIRCULAR AVATAR: photo if available, else initial */}
                {userPhoto ? (
                  <img
                    src={userPhoto}
                    alt={firstInitial}
                    className="rounded-circle flex-shrink-0"
                    style={{
                      width: "38px",
                      height: "38px",
                      objectFit: "cover",
                      border: "2px solid rgba(14, 165, 233, 0.5)",
                    }}
                    onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
                  />
                ) : (
                  <div
                    className="rounded-circle text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{
                      width: "38px",
                      height: "38px",
                      fontSize: "16px",
                      backgroundColor: "#2563EB",
                    }}
                  >
                    {firstInitial}
                  </div>
                )}
              </button>

              {/* VISIBLE DROPDOWN CARD */}
              {dropdownOpen && (
                <div
                  id="profile-dropdown-card"
                  className="rounded-4 p-3 position-absolute"
                  style={{
                    display: "block",
                    top: "calc(100% + 12px)",
                    right: "0",
                    width: "300px",
                    maxWidth: "92vw",
                    maxHeight: "80vh",
                    overflowY: "auto",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1), inset 0 2px 5px rgba(255, 255, 255, 1)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    zIndex: 999999,
                  }}
                >
                  {/* HEADER */}
                  <div className="pb-3 border-bottom mb-2">
                    <div className="d-flex align-items-center gap-2.5 mb-2">
                      {userPhoto ? (
                        <img
                          src={userPhoto}
                          alt={firstInitial}
                          className="rounded-circle flex-shrink-0"
                          style={{
                            width: "44px",
                            height: "44px",
                            objectFit: "cover",
                            border: "2px solid #E5E7EB",
                          }}
                          onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; }}
                        />
                      ) : (
                        <div
                          className="rounded-circle text-dark fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "44px",
                            height: "44px",
                            fontSize: "18px",
                            backgroundColor: "#2563EB",
                          }}
                        >
                          {firstInitial}
                        </div>
                      )}
                      <div>
                        <div className="fw-bold text-dark lh-sm">{fullName}</div>
                        <div className="text-muted extra-small">{userEmail}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="text-secondary extra-small fw-semibold">ACCOUNT STATUS</span>
                          <span className="badge bg-success  text-success rounded-pill extra-small">Active</span>
                        </div>
                        <div className="progress mt-2" style={{ height: "4px" }}>
                          <div className="progress-bar bg-success" role="progressbar" style={{ width: "100%" }}></div>
                        </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div className="d-flex flex-column gap-1.5 mb-2 extra-small text-muted">
                    <div className="text-truncate"><strong className="text-dark">College:</strong> {college}</div>
                    <div><strong className="text-dark">Graduation:</strong> {graduationYear}</div>
                  </div>

                  <hr className="my-2 border-secondary border-opacity-15" />

                  {/* MENU ACTION BUTTONS */}
                  <div className="d-flex flex-column gap-1">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-medium small text-dark d-flex align-items-center gap-2"
                      style={{ transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      👤 View Profile
                    </Link>

                    <Link
                      to="/profile/edit"
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-medium small text-dark d-flex align-items-center gap-2"
                      style={{ transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      ✏️ Edit Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-medium small text-dark d-flex align-items-center gap-2"
                      style={{ transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      ⚙️ Settings
                    </Link>

                    <hr className="my-1 border-secondary border-opacity-15" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-semibold small text-danger d-flex align-items-center gap-2 w-100 text-start"
                      style={{ transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/" className="btn-primary-clean btn-sm">
              Login
            </Link>
          )}

          <button
            className="navbar-toggler border-0 ms-2"
            type="button"
            onClick={() => setNavOpen(!navOpen)}
            aria-expanded={navOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        <div className={`collapse navbar-collapse ${navOpen ? "show" : ""}`} id="navContent">
          <ul className="navbar-nav me-auto mb-2 mb-xl-0 gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li className="nav-item" key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setNavOpen(false)}
                    className={`nav-link px-2.5 py-1.5 rounded-2 small transition ${isActive
                        ? "fw-semibold"
                        : "text-secondary"
                      }`}
                    style={
                      isActive
                        ? {
                          color: "#2563eb",
                          background: "rgba(59, 130, 246, 0.1)",
                          border: "1px solid rgba(59, 130, 246, 0.2)",
                          fontWeight: "600",
                        }
                        : { color: "#475569" }
                    }
                    onMouseOver={(e) => { if (!isActive) e.currentTarget.style.color = "#0f172a"; }}
                    onMouseOut={(e) => { if (!isActive) e.currentTarget.style.color = "#475569"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* DEVELOPER & APP CREATOR PROFILE MODAL */}
      {devModalOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
          style={{
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 9999999,
          }}
          onClick={() => setDevModalOpen(false)}
        >
          <div
            className="glass-panel p-4 p-md-5 rounded-5 bg-white border border-primary border-opacity-30 shadow-lg position-relative overflow-hidden"
            style={{ maxWidth: "560px", width: "100%", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close X Button */}
            <button
              type="button"
              className="btn-close position-absolute top-0 end-0 m-4"
              aria-label="Close modal"
              onClick={() => setDevModalOpen(false)}
            ></button>

            {/* Header Badge */}
            <div className="text-center mb-4">
              <img
                src="/logo_3d.png"
                alt="Pathfinder AI Emblem"
                className="img-fluid mb-2 animate-float"
                style={{ width: "64px", height: "64px", objectFit: "contain" }}
              />
              <span className="badge neon-badge px-3 py-1.5 rounded-pill mb-2 d-block mx-auto" style={{ maxWidth: "max-content" }}>
                Developer & App Architect Profile
              </span>
              <h3 className="fw-extrabold text-dark mb-1">Pathfinder AI v2.0</h3>
              <p className="text-secondary small mb-0">Career Guidance & Job Readiness Intelligence System</p>
            </div>

            {/* Developer Details Card */}
            <div className="p-4 rounded-4 bg-light border border-primary border-opacity-20 mb-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  className="rounded-circle text-dark fw-extrabold fs-3 d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                  style={{
                    width: "56px",
                    height: "56px",
                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                  }}
                >
                  K
                </div>
                <div>
                  <h5 className="fw-extrabold text-dark mb-0">Kondreddy Mrudhula</h5>
                  <span className="badge bg-primary text-dark extra-small">Lead Full Stack & ML Developer</span>
                </div>
              </div>

              <div className="d-flex flex-column gap-2 extra-small text-muted border-top border-secondary border-opacity-15 pt-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-6">🎓</span>
                  <div>
                    <strong className="text-dark">Education:</strong> B.Tech - Computer Science & Engineering
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-6">🏫</span>
                  <div>
                    <strong className="text-dark">Institution:</strong> Saveetha Institute of Medical & Tech Sciences (SIT)
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-6">📅</span>
                  <div>
                    <strong className="text-dark">Graduation Batch:</strong> Class of 2028
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-6">🐙</span>
                  <div>
                    <strong className="text-dark">GitHub Profile:</strong>{" "}
                    <a href="https://github.com/mrudhulareddy411" target="_blank" rel="noreferrer" className="text-primary fw-bold text-decoration-none">
                      github.com/mrudhulareddy411 ↗
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-6">💼</span>
                  <div>
                    <strong className="text-dark">LinkedIn Profile:</strong>{" "}
                    <a href="https://www.linkedin.com/in/mrudhula-kondreddy-2b525a312" target="_blank" rel="noreferrer" className="text-primary fw-bold text-decoration-none">
                      linkedin.com/in/mrudhula-kondreddy-2b525a312 ↗
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-6">💻</span>
                  <div>
                    <strong className="text-dark">Tech Stack:</strong> React 19, Node.js Express, Python FastAPI, MongoDB Atlas, O*NET ML Model
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="d-flex flex-column gap-2">
              <Link
                to="/dashboard"
                onClick={() => setDevModalOpen(false)}
                className="btn btn-cyber py-2.5 rounded-3 fw-bold text-center w-100 text-decoration-none"
              >
                🚀 Go to Student Dashboard
              </Link>
              <Link
                to="/profile"
                onClick={() => setDevModalOpen(false)}
                className="btn btn-outline-primary py-2.5 rounded-3 fw-bold text-center w-100 text-decoration-none"
              >
                👤 View My Student Profile
              </Link>
              <button
                type="button"
                onClick={() => setDevModalOpen(false)}
                className="btn btn-light text-secondary py-2 rounded-3 small border w-100 mt-1"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
