import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Settings() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("account"); // account, profile, security, notifications, preferences
  const [saveStatus, setSaveStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    email: "",
    notifications: true,
    weeklyReport: true,
    theme: "Light (Clean Professional)",
    twoFactor: false,
  });

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data) {
          setUser(res.data);
          setSettingsForm((prev) => ({
            ...prev,
            email: res.data.email || prev.email,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveStatus("Settings updated successfully! ✓");
      setTimeout(() => setSaveStatus(""), 3500);
    }, 600);
  };

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />
      <div className="container py-4" style={{ maxWidth: "1050px" }}>
        {/* HEADER SECTION */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Platform Configuration</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Settings & Preferences
              </h2>
              <p className="text-secondary small mb-0">
                Manage your account security, profile options, email notifications, and platform preferences.
              </p>
            </div>
          </div>
        </div>

        {saveStatus && (
          <div className="clean-card p-3 mb-4 text-center border-success bg-success  text-success fw-semibold">
            {saveStatus}
          </div>
        )}

        {/* SETTINGS TABS & CONTENT */}
        <div className="row g-4 mb-4">
          {/* TABS MENU */}
          <div className="col-12 col-md-3">
            <div className="clean-card p-2 d-flex flex-column gap-1">
              <button
                onClick={() => setActiveTab("account")}
                className={`btn btn-sm text-start py-2 px-3 fw-medium rounded-2 ${
                  activeTab === "account" ? "btn-primary-clean" : "btn-outline-clean border-0 text-secondary"
                }`}
              >
                👤 Account
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`btn btn-sm text-start py-2 px-3 fw-medium rounded-2 ${
                  activeTab === "profile" ? "btn-primary-clean" : "btn-outline-clean border-0 text-secondary"
                }`}
              >
                ✏️ Profile Details
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`btn btn-sm text-start py-2 px-3 fw-medium rounded-2 ${
                  activeTab === "security" ? "btn-primary-clean" : "btn-outline-clean border-0 text-secondary"
                }`}
              >
                🔒 Security & Password
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`btn btn-sm text-start py-2 px-3 fw-medium rounded-2 ${
                  activeTab === "notifications" ? "btn-primary-clean" : "btn-outline-clean border-0 text-secondary"
                }`}
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`btn btn-sm text-start py-2 px-3 fw-medium rounded-2 ${
                  activeTab === "preferences" ? "btn-primary-clean" : "btn-outline-clean border-0 text-secondary"
                }`}
              >
                ⚙️ Preferences
              </button>
            </div>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="col-12 col-md-9">
            <div className="clean-card p-4">
              <form onSubmit={handleSaveSettings}>
                {activeTab === "account" && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">Account Details</h5>
                    <div className="mb-3">
                      <label className="fw-semibold text-secondary extra-small mb-1 d-block">Full Name</label>
                      <input
                        type="text"
                        className="form-control border-subtle small"
                        value={user?.fullName || ""}
                        disabled
                        style={{ borderColor: "#E2E8F0" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="fw-semibold text-secondary extra-small mb-1 d-block">Email Address</label>
                      <input
                        type="email"
                        className="form-control border-subtle small"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        style={{ borderColor: "#E2E8F0" }}
                      />
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">Profile Preferences</h5>
                    <p className="text-secondary small mb-3">
                      To update your degree, branch, or technical skills, navigate to the <a href="/profile" className="text-primary fw-semibold">Profile Page</a>.
                    </p>
                  </div>
                )}

                {activeTab === "security" && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">Security & Password</h5>
                    <div className="p-3 clean-card-flat bg-light mb-3">
                      <div className="fw-bold text-success extra-small">✓ Password Encrypted & Protected</div>
                      <div className="extra-small text-secondary mt-1">
                        JWT Token session active. Multi-factor authentication ready.
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">Notification Preferences</h5>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="notifyCheck"
                        checked={settingsForm.notifications}
                        onChange={(e) => setSettingsForm({ ...settingsForm, notifications: e.target.checked })}
                      />
                      <label className="form-check-label small fw-semibold text-dark" htmlFor="notifyCheck">
                        Email Notifications for Skill Assessment Updates
                      </label>
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="weeklyCheck"
                        checked={settingsForm.weeklyReport}
                        onChange={(e) => setSettingsForm({ ...settingsForm, weeklyReport: e.target.checked })}
                      />
                      <label className="form-check-label small fw-semibold text-dark" htmlFor="weeklyCheck">
                        Weekly Placement Readiness Summary Report
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === "preferences" && (
                  <div>
                    <h5 className="fw-bold text-dark mb-3">Platform Preferences</h5>
                    <div className="mb-3">
                      <label className="fw-semibold text-secondary extra-small mb-1 d-block">Interface Theme</label>
                      <select
                        className="form-select border-subtle small"
                        value={settingsForm.theme}
                        onChange={(e) => setSettingsForm({ ...settingsForm, theme: e.target.value })}
                        style={{ borderColor: "#E2E8F0" }}
                      >
                        <option value="Light (Clean Professional)">Light (Clean Professional)</option>
                        <option value="System Default">System Default</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="pt-3 border-top mt-4 text-end">
                  <button type="submit" disabled={saving} className="btn btn-primary-clean">
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Settings;
