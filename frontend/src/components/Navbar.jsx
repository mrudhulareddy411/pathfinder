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
    <nav className="navbar navbar-expand-xl sticky-top px-3 border-bottom">
      <div className="container-fluid px-2 d-flex align-items-center justify-content-between">
        <Link className="navbar-brand fw-bold text-light fs-5 d-flex align-items-center gap-2 me-3 text-decoration-none" to="/dashboard">
          <div
            className="rounded-3 text-light fw-bold d-flex align-items-center justify-content-center"
            style={{ width: "34px", height: "34px", background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", fontSize: "16px", boxShadow: "0 2px 10px rgba(14, 165, 233, 0.3)" }}
          >
            P
          </div>
          <span style={{ letterSpacing: "-0.01em" }}>Pathfinder AI</span>
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
                style={{ cursor: "pointer", borderColor: "rgba(255, 255, 255, 0.1)", background: "rgba(255, 255, 255, 0.05)" }}
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
                    className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
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
                  className="rounded-4 p-3 position-absolute pf-card"
                  style={{
                    display: "block",
                    top: "calc(100% + 12px)",
                    right: "0",
                    width: "300px",
                    maxWidth: "92vw",
                    maxHeight: "80vh",
                    overflowY: "auto",
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
                          className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center flex-shrink-0"
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
                        <div className="fw-bold text-light lh-sm">{fullName}</div>
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
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-medium small text-light d-flex align-items-center gap-2"
                      style={{ transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      👤 View Profile
                    </Link>

                    <Link
                      to="/profile/edit"
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-medium small text-light d-flex align-items-center gap-2"
                      style={{ transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      ✏️ Edit Profile
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-medium small text-light d-flex align-items-center gap-2"
                      style={{ transition: "all 0.2s" }}
                      onMouseOver={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"; }}
                      onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                    >
                      ⚙️ Settings
                    </Link>

                    <hr className="my-1 border-secondary border-opacity-15" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item rounded-2 py-1.5 px-2.5 fw-semibold small text-danger d-flex align-items-center gap-2 w-100 text-start"
                      style={{ transition: "all 0.2s", background: "transparent", border: "none" }}
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
                        : "text-muted"
                      }`}
                    style={
                      isActive
                        ? {
                          color: "var(--pf-primary-2)",
                          background: "rgba(37, 99, 235, 0.1)",
                          border: "1px solid rgba(37, 99, 235, 0.2)",
                          fontWeight: "600",
                        }
                        : { color: "var(--pf-muted)" }
                    }
                    onMouseOver={(e) => { if (!isActive) e.currentTarget.style.color = "var(--pf-primary-2)"; }}
                    onMouseOut={(e) => { if (!isActive) e.currentTarget.style.color = "var(--pf-muted)"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;
