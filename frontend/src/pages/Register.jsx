import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../services/authService";
import { triggerGoogleOAuthPopup } from "../services/googleAuthService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    educationLevel: "B.Tech",
    college: "",
    branch: "Computer Science & Engineering",
    graduationYear: "2027",
    skills: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isDuplicateEmail, setIsDuplicateEmail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getStrength = (pass) => {
    if (!pass) return { label: "", color: "" };
    if (pass.length < 8) return { label: "Weak (min 8 chars)", color: "#ef4444" };
    if (pass.length >= 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { label: "Strong", color: "#059669" };
    }
    return { label: "Medium", color: "#d97706" };
  };

  const strength = getStrength(formData.password);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsDuplicateEmail(false);

    if (!formData.fullName || !formData.email || !formData.password) {
      setError("Full name, email, and password are required.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map((s) => s.trim()) : [],
      };

      await registerUser(payload);
      navigate("/", {
        state: {
          email: formData.email,
          message: "Account created successfully! 🎉 Please sign in.",
        },
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Registration failed.";
      setError(errMsg);
      if (errMsg.toLowerCase().includes("already registered") || errMsg.toLowerCase().includes("exists")) {
        setIsDuplicateEmail(true);
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

  const registrationSteps = [
    { title: "Personal Profile", desc: "Name, email & security credentials", icon: "👤", color: "#4f46e5" },
    { title: "Academic Background", desc: "Education level, college & branch", icon: "🎓", color: "#0284c7" },
    { title: "Skills Baseline", desc: "Current technical & soft skills", icon: "🧠", color: "#7c3aed" },
    { title: "Career Goals", desc: "100% Free for Students", icon: "🚀", color: "#059669" },
  ];

  return (
    <div style={{  minHeight: "100vh" }} className="d-flex align-items-center justify-content-center p-3 p-md-5">
      <div className="bg-ambient-orb orb-1"></div>
      <div className="bg-ambient-orb orb-2"></div>

      <div className="container" style={{ maxWidth: "1100px", zIndex: 1 }}>
        <div className="glass-panel overflow-hidden p-0 rounded-5 border border-primary border-opacity-15 shadow-lg">
          <div className="row g-0">
            {/* LEFT COLUMN: PROGRESSIVE STEPS VISUAL */}
            <div
              className="col-12 col-lg-5 p-5 d-none d-lg-flex flex-column justify-content-between position-relative"
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
                    <span className="badge neon-badge px-2.5 py-0.5 rounded-pill">Student Onboarding</span>
                  </div>
                </div>
                <div className="text-center my-3">
                  <img
                    src="/hero_career.png"
                    alt="Career Journey"
                    className="img-fluid rounded-4 shadow-sm animate-float"
                    style={{ maxHeight: "150px", objectFit: "contain" }}
                  />
                </div>
                <h4 className="fw-bold text-dark mb-1">Join Pathfinder Today 🚀</h4>
                <p className="text-secondary small mb-0">Create your account to unlock AI-powered career roadmaps.</p>
              </div>

              <div className="my-4 d-flex flex-column gap-3">
                {registrationSteps.map((st, idx) => (
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
                      <div className="text-muted extra-small">{st.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="extra-small text-muted border-top border-primary border-opacity-15 pt-3">
                ⚡ No Credit Card Required • No Paid Subscriptions
              </div>
            </div>

            {/* RIGHT COLUMN: REGISTRATION FORM */}
            <div className="col-12 col-lg-7 p-4 p-md-5 d-flex flex-column justify-content-center bg-white">
              <div className="mb-3">
                <h2 className="fw-extrabold text-dark mb-1">Create Free Account 📄</h2>
                <p className="text-secondary small mb-0">Fill in your profile details to start building your career path.</p>
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
                {googleLoading ? "Connecting to Google..." : "Sign up with Google"}
              </button>

              <div className="d-flex align-items-center my-2 text-muted extra-small">
                <div className="flex-grow-1 border-bottom border-secondary border-opacity-20"></div>
                <span className="px-2">OR CREATE ACCOUNT WITH EMAIL</span>
                <div className="flex-grow-1 border-bottom border-secondary border-opacity-20"></div>
              </div>

              {error && (
                <div className="alert alert-danger bg-danger  border-danger border-opacity-25 text-danger extra-small p-3 rounded-3 mb-3">
                  {error}
                  {isDuplicateEmail && (
                    <div className="mt-2 d-flex gap-2">
                      <Link to="/" className="btn btn-primary btn-sm px-3 extra-small">
                        Sign In Now
                      </Link>
                      <Link to="/forgot-password" className="btn btn-outline-secondary btn-sm px-3 extra-small text-dark">
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="text-secondary extra-small fw-semibold mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      className="form-control bg-light text-dark border-secondary rounded-3 py-2 px-3"
                      placeholder="Mrudhula Kondreddy"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="text-secondary extra-small fw-semibold mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="form-control bg-light text-dark border-secondary rounded-3 py-2 px-3"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="text-secondary extra-small fw-semibold mb-1">Password * (min 8 chars)</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        className="form-control bg-light text-dark border-secondary rounded-3 py-2 px-3 pe-5"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-secondary text-decoration-none pe-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "👁️" : "👁️‍🗨️"}
                      </button>
                    </div>
                    {strength.label && (
                      <div className="extra-small mt-1 fw-semibold" style={{ color: strength.color }}>
                        Strength: {strength.label}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="text-secondary extra-small fw-semibold mb-1">Confirm Password *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      className="form-control bg-light text-dark border-secondary rounded-3 py-2 px-3"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <label className="text-secondary extra-small fw-semibold mb-1">Education Level</label>
                    <select
                      name="educationLevel"
                      className="form-select bg-light text-dark border-secondary rounded-3 py-2 px-3"
                      value={formData.educationLevel}
                      onChange={handleChange}
                    >
                      <option value="10th">After 10th</option>
                      <option value="12th">After 12th</option>
                      <option value="B.Tech">B.Tech / Degree</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="text-secondary extra-small fw-semibold mb-1">Branch / Stream *</label>
                    <input
                      type="text"
                      name="branch"
                      required
                      className="form-control bg-light text-dark border-secondary rounded-3 py-2 px-3"
                      placeholder="Computer Science"
                      value={formData.branch}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-12 col-md-4">
                    <label className="text-secondary extra-small fw-semibold mb-1">Graduation Year *</label>
                    <input
                      type="text"
                      name="graduationYear"
                      required
                      className="form-control bg-light text-dark border-secondary rounded-3 py-2 px-3"
                      placeholder="2027"
                      value={formData.graduationYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-secondary extra-small fw-semibold mb-1">College / School Name</label>
                  <input
                    type="text"
                    name="college"
                    className="form-control bg-light text-dark border-secondary rounded-3 py-2 px-3"
                    placeholder="e.g. Saveetha Institute of Tech"
                    value={formData.college}
                    onChange={handleChange}
                  />
                </div>

                <button type="submit" className="btn btn-cyber py-3 fw-bold mt-2" disabled={loading || googleLoading}>
                  {loading ? "Creating Free Account..." : "Create Free Account →"}
                </button>
              </form>

              <div className="mt-4 text-center text-secondary small">
                Already have an account?{" "}
                <Link to="/" className="text-primary text-decoration-none fw-bold">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;