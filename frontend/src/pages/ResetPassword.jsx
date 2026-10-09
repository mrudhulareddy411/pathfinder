import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const getStrength = (pass) => {
    if (!pass) return { label: "", color: "" };
    if (pass.length < 8) return { label: "Weak (min 8 chars)", color: "#ef4444" };
    if (pass.length >= 10 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { label: "Strong", color: "#10b981" };
    }
    return { label: "Medium", color: "#f59e0b" };
  };

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{  minHeight: "100vh" }} className="d-flex align-items-center justify-content-center p-3 p-md-5">
      <div className="bg-ambient-orb orb-1"></div>
      <div className="bg-ambient-orb orb-2"></div>

      <div className="container" style={{ maxWidth: "480px", zIndex: 1 }}>
        <div className="glass-panel p-4 p-md-5 rounded-5 border border-primary border-opacity-15 text-center bg-white shadow-lg">
          <div className="fs-1 mb-3 p-3 rounded-circle bg-primary  border border-primary border-opacity-25 d-inline-block" style={{ color: "#2563eb" }}>
            🔑
          </div>

          <h3 className="fw-extrabold text-dark mb-2">Create a New Password</h3>
          <p className="text-secondary small mb-4">
            Enter your new password below. It must be at least 8 characters.
          </p>

          {error && (
            <div className="alert alert-danger border-danger border-opacity-25 extra-small p-3 rounded-3 mb-4 text-start">
              {error}
            </div>
          )}

          {success ? (
            <div className="p-4 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-30 text-center mb-4">
              <div className="fs-2 mb-2">🎉</div>
              <h5 className="fw-bold text-dark mb-2">Password Reset Successfully!</h5>
              <p className="text-secondary extra-small mb-4">You can now log in with your new password.</p>
              <Link to="/" className="btn btn-cyber w-100 py-2.5 fw-bold text-decoration-none">
                Go to Sign In →
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 text-start">
              <div>
                <label className="text-secondary extra-small fw-semibold mb-1">New Password *</label>
                <div className="position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="form-control bg-light text-dark border-secondary rounded-3 py-2.5 px-3 pe-5"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div>
                <label className="text-secondary extra-small fw-semibold mb-1">Confirm New Password *</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-control bg-light text-dark border-secondary rounded-3 py-2.5 px-3"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-cyber py-3 fw-bold mt-2" disabled={loading}>
                {loading ? "Resetting Password..." : "Reset Password →"}
              </button>
            </form>
          )}

          <div className="mt-4 text-center">
            <Link to="/" className="text-secondary text-decoration-none small">
              &larr; Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
