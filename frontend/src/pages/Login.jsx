import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { loginUser } from "../services/authService";
import { triggerGoogleOAuthPopup } from "../services/googleAuthService";
import SplashIntro from "../components/SplashIntro";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const prefilledEmail = location.state?.email || "";
  const successMsg = location.state?.message || "";

  // Check if splash was already shown in current session
  const splashAlreadyShown = sessionStorage.getItem("pf_splash_shown") === "true";
  const [showSplash, setShowSplash] = useState(!splashAlreadyShown);

  const [formData, setFormData] = useState({ email: prefilledEmail, password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");

  // Health Status Check
  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get("/health");
        setBackendStatus("connected");
      } catch {
        setBackendStatus("offline");
      }
    };
    checkHealth();
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("pf_splash_shown", "true");
    setShowSplash(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = formData.email ? formData.email.trim() : "";
    const cleanPassword = formData.password ? formData.password : "";

    if (!cleanEmail || !cleanPassword) {
      setError("Please enter a valid email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginUser({ email: cleanEmail, password: cleanPassword });
      sessionStorage.setItem("pf_splash_shown", "true");
      navigate("/dashboard");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No account found with this email address.");
      } else if (err.response?.status === 401) {
        setError("Incorrect email or password.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (backendStatus === "offline") {
        setError("Unable to connect to Pathfinder server. Please make sure backend is running.");
      } else {
        setError(err.message || "Unable to reach the server. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setError("");
    setGoogleLoading(true);

    triggerGoogleOAuthPopup({
      onSuccess: (data) => {
        setGoogleLoading(false);
        if (data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("pf_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("pf_user", JSON.stringify(data.user));
          sessionStorage.setItem("pf_splash_shown", "true");

          if (data.requiresProfileSetup) {
            navigate("/profile/edit", {
              state: { message: "Complete Your Pathfinder Profile 🚀" },
            });
          } else {
            navigate("/dashboard");
          }
        }
      },
      onError: (msg) => {
        setGoogleLoading(false);
        setError(msg || "Google sign-in failed. Please try again.");
      },
      onCancel: (msg) => {
        setGoogleLoading(false);
        setError(msg || "Google sign-in was cancelled.");
      },
    });
  };

  const steps = [
    { title: "Discover", icon: "🎯", color: "#4f46e5" },
    { title: "Skills Assessment", icon: "🧠", color: "#0284c7" },
    { title: "Learn & Roadmap", icon: "📚", color: "#7c3aed" },
    { title: "Build Projects", icon: "💻", color: "#d97706" },
    { title: "ATS Resume", icon: "📄", color: "#059669" },
    { title: "Career Ready", icon: "🚀", color: "#db2777" },
  ];

  return (
    <>
      {showSplash && <SplashIntro onComplete={handleSplashComplete} />}

      <div style={{  minHeight: "100vh" }} className="d-flex align-items-center justify-content-center p-3 p-md-5">
        <div className="bg-ambient-orb orb-1"></div>
        <div className="bg-ambient-orb orb-2"></div>

        <div className="container" style={{ maxWidth: "1050px", zIndex: 1 }}>
          <div className="glass-panel overflow-hidden p-0 rounded-5 border border-primary border-opacity-15 shadow-lg">
            <div className="row g-0">
              {/* LEFT COLUMN: ANIMATED VISUAL CAREER JOURNEY */}
              <div
                className="col-12 col-lg-6 p-5 d-none d-lg-flex flex-column justify-content-between position-relative"
                style={{
                  background: "linear-gradient(135deg, rgba(79, 70, 229, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)",
                  borderRight: "1px solid rgba(79, 70, 229, 0.15)",
                }}
              >
                <div>
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <img src="/logo_3d.png" alt="Pathfinder Emblem" style={{ width: "48px", height: "48px", objectFit: "contain" }} />
                    <div>
                      <h3 className="fw-extrabold text-dark mb-0">Pathfinder AI</h3>
                      <span className="badge neon-badge px-2.5 py-0.5 rounded-pill">Career Intelligence Platform</span>
                    </div>
                  </div>
                  <div className="text-center my-3">
                    <img
                      src="/hero_career.png"
                      alt="Career Network"
                      className="img-fluid rounded-4 shadow-sm animate-float"
                      style={{ maxHeight: "180px", objectFit: "contain" }}
                    />
                  </div>
                  <h4 className="fw-bold text-dark mb-1">Welcome Back! 👋</h4>
                  <p className="text-secondary small mb-0">Elevate your career trajectory with real-time AI guidance.</p>
                </div>

                {/* Step Path Animation */}
                <div className="my-4 d-flex flex-column gap-3">
                  {steps.map((st, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      className="p-3 rounded-4 bg-white border border-primary border-opacity-10 shadow-sm d-flex align-items-center gap-3"
                    >
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fs-5 flex-shrink-0"
                        style={{ width: "42px", height: "42px", background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}35` }}
                      >
                        {st.icon}
                      </div>
                      <div>
                        <div className="fw-bold text-dark small">{st.title}</div>
                        <div className="text-muted extra-small">Stage {idx + 1} Milestone</div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center extra-small text-muted border-top border-primary border-opacity-15 pt-3">
                  <span>⚡ Real Data Provenance</span>
                  <span className="d-flex align-items-center gap-1.5 fw-semibold">
                    Backend:{" "}
                    {backendStatus === "connected" ? (
                      <span className="text-success">● Connected</span>
                    ) : backendStatus === "offline" ? (
                      <span className="text-danger">● Offline</span>
                    ) : (
                      <span className="text-warning">● Checking</span>
                    )}
                  </span>
                </div>
              </div>

              {/* RIGHT COLUMN: LOGIN FORM */}
              <div className="col-12 col-lg-6 p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
                <div className="mb-4">
                  <h2 className="fw-extrabold text-dark mb-1">Sign In 🔐</h2>
                  <p className="text-secondary small mb-0">Enter your credentials to access Pathfinder AI.</p>
                </div>

                {/* Official Google OAuth Popup Button */}
                <button
                  type="button"
                  disabled={googleLoading || loading}
                  onClick={handleGoogleClick}
                  className="btn btn-outline-secondary w-100 py-2.5 rounded-3 mb-3 d-flex align-items-center justify-content-center gap-2 fw-semibold text-dark border-secondary border-opacity-30"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  {googleLoading ? "Connecting to Google..." : "Continue with Google"}
                </button>

                <div className="d-flex align-items-center my-2 text-muted extra-small">
                  <div className="flex-grow-1 border-bottom border-secondary border-opacity-20"></div>
                  <span className="px-2">OR EMAIL SIGN IN</span>
                  <div className="flex-grow-1 border-bottom border-secondary border-opacity-20"></div>
                </div>

                {successMsg && (
                  <div className="alert alert-success bg-success  border-success border-opacity-25 text-success extra-small p-3 rounded-3 mb-3">
                    {successMsg}
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger bg-danger  border-danger border-opacity-25 text-danger extra-small p-3 rounded-3 mb-3">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <div>
                    <label className="text-secondary extra-small fw-semibold mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-control bg-light text-dark border-secondary rounded-3 py-2.5 px-3"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                    />
                  </div>

                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="text-secondary extra-small fw-semibold mb-0">Password</label>
                      <Link to="/forgot-password" className="text-primary text-decoration-none extra-small fw-semibold">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        className="form-control bg-light text-dark border-secondary rounded-3 py-2.5 px-3 pe-5"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none pe-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-cyber py-3 fw-bold mt-2" disabled={loading || googleLoading}>
                    {loading ? "Signing In..." : "Sign In →"}
                  </button>
                </form>

                <div className="mt-4 text-center text-secondary small">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary text-decoration-none fw-bold">
                    Create Free Account →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;