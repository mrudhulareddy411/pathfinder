import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // Step 1: Send OTP, Step 2: Verify OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [devOtp, setDevOtp] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/send-otp", { email });
      setDevOtp(res.data.otp || "");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "No account found with this email address.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp || otp.length < 6) {
      setError("Please enter the 6-digit numeric OTP.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/verify-otp", { email, otp });
      if (res.data.resetToken) {
        navigate(`/reset-password/${res.data.resetToken}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired 6-digit OTP code.");
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
          {/* Icon */}
          <div className="fs-1 mb-3 p-3 rounded-circle bg-primary  border border-primary border-opacity-25 d-inline-block" style={{ color: "#2563eb" }}>
            {step === 1 ? "🔐" : "🔑"}
          </div>

          <h3 className="fw-extrabold text-dark mb-2">
            {step === 1 ? "Reset Your Password" : "Enter 6-Digit OTP"}
          </h3>
          <p className="text-secondary small mb-4">
            {step === 1
              ? "Enter your registered email address to receive a 6-digit OTP code."
              : `We sent a 6-digit OTP code to ${email}`}
          </p>

          {error && (
            <div className="alert alert-danger border-danger border-opacity-25 extra-small p-3 rounded-3 mb-4 text-start">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="d-flex flex-column gap-3 text-start">
              <div>
                <label className="text-secondary extra-small fw-semibold mb-1">Registered Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control bg-light text-dark border-secondary rounded-3 py-2.5 px-3"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-cyber py-3 fw-bold mt-2" disabled={loading}>
                {loading ? "Sending OTP..." : "Send 6-Digit OTP →"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="d-flex flex-column gap-3 text-start">
              {devOtp && (
                <div className="p-3 rounded-3 bg-primary  border border-primary border-opacity-25 text-center mb-2">
                  <span className="text-muted extra-small d-block">Development Mode OTP Code:</span>
                  <span className="fw-extrabold fs-3 font-monospace text-primary" style={{ letterSpacing: "4px" }}>
                    {devOtp}
                  </span>
                </div>
              )}

              <div>
                <label className="text-secondary extra-small fw-semibold mb-1">Enter 6-Digit OTP Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  className="form-control bg-light text-dark border-secondary rounded-3 py-2.5 px-3 text-center font-monospace fs-4 fw-bold"
                  style={{ letterSpacing: "6px" }}
                  placeholder="••••••"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-cyber py-3 fw-bold mt-2" disabled={loading}>
                {loading ? "Verifying OTP..." : "Verify OTP & Reset Password →"}
              </button>

              <div className="text-center mt-2">
                <button
                  type="button"
                  className="btn btn-link text-primary text-decoration-none extra-small"
                  onClick={() => setStep(1)}
                >
                  Resend OTP Code
                </button>
              </div>
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

export default ForgotPassword;
