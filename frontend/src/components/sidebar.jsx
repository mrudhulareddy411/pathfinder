import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const links = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/assessment", label: "Pathfinder Assessment", icon: "🧭" },
    { path: "/career-pathfinder", label: "Career Pathfinder", icon: "🎯" },
    { path: "/career-journey", label: "Career Journey Map", icon: "🗺️" },
    { path: "/skills", label: "Skills & Skill Gap", icon: "🧠" },
    { path: "/resources", label: "Learning Hub", icon: "📚" },
    { path: "/projects", label: "Project Explorer", icon: "💻" },
    { path: "/challenges", label: "Daily Challenges", icon: "⚔️" },
    { path: "/academics", label: "Academic Tracker", icon: "🎓" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { path: "/admin", label: "Admin Data Management", icon: "🛠️" },
  ];

  return (
    <div className="p-3 border-end border-secondary border-opacity-25 text-light min-vh-100" style={{ background: "rgba(11, 23, 41, 0.95)", width: "260px" }}>
      <div className="fw-bold fs-5 text-teal mb-4 d-flex align-items-center gap-2 px-2" style={{ color: "#2dd4bf" }}>
        <span>⚡ Pathfinder AI</span>
      </div>

      <div className="d-flex flex-column gap-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none small transition ${
                isActive ? "bg-teal  text-teal fw-bold border-start border-3 border-teal" : "text-light opacity-75 hover-opacity-100"
              }`}
              style={isActive ? { color: "#2dd4bf", background: "rgba(45, 212, 191, 0.15)" } : {}}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
