import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ActivityCalendar from "../components/ActivityCalendar";
import StreakCard from "../components/StreakCard";

function CalendarPage() {
  const [user, setUser] = useState(null);
  const [streakInfo, setStreakInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const meRes = await api.get("/auth/me");
        setUser(meRes.data);

        const streakRes = await api.get("/streak");
        setStreakInfo(streakRes.data);
      } catch (err) {
        console.error("Calendar fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const currentStreak = streakInfo?.currentStreak || user?.currentStreak || 1;
  const longestStreak = streakInfo?.longestStreak || user?.longestStreak || 1;
  const totalActiveDays = streakInfo?.totalActiveDays || 3;

  return (
    <div style={{ background: "linear-gradient(135deg, #f0f4f9 0%, #e0e7ff 50%, #e0f2fe 100%)", minHeight: "100vh" }}>
      <Navbar user={user} />

      <div className="container py-4">
        {/* Visual Hero Header */}
        <div className="glass-panel p-4 p-md-5 mb-4 rounded-5 border border-primary border-opacity-20 shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-8">
              <span className="badge neon-badge px-3 py-1.5 rounded-pill mb-2">Student Activity Tracker</span>
              <h2 className="fw-extrabold text-dark mb-1">Personal Activity Calendar 📅</h2>
              <p className="text-secondary small mb-3">
                Visual history of your daily login activity, learning modules, assessment runs, and career milestones.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/assessment" className="btn btn-cyber btn-sm rounded-pill px-4 fw-bold">
                  🎯 Retake Assessment (+150 XP)
                </Link>
                <Link to="/challenges" className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
                  ⚡ Daily Skill Challenges
                </Link>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="col-12 col-lg-4">
              <div className="p-3 bg-white rounded-4 border border-primary border-opacity-15 shadow-sm">
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <span className="extra-small text-muted font-monospace">ACTIVE DAYS</span>
                  <span className="badge bg-primary text-white fw-bold">{totalActiveDays} Days</span>
                </div>
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                  <span className="extra-small text-muted font-monospace">CURRENT STREAK</span>
                  <span className="badge bg-warning text-dark fw-bold">🔥 {currentStreak} Days</span>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="extra-small text-muted font-monospace">XP MULTIPLIER</span>
                  <span className="badge bg-success bg-opacity-20 text-success fw-bold">1.5x Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Main Activity Grid */}
          <div className="col-12 col-lg-8">
            <ActivityCalendar />
          </div>

          {/* Side Panel: Streak & Milestone Badges */}
          <div className="col-12 col-lg-4">
            <StreakCard currentStreak={currentStreak} longestStreak={longestStreak} />

            {/* Milestone Badges Panel */}
            <div className="glass-panel p-4 bg-white rounded-4 border border-primary border-opacity-15 shadow-sm">
              <h5 className="fw-extrabold text-dark mb-3 d-flex align-items-center gap-2">
                <span>🏆</span> Streak Milestone Badges
              </h5>
              <div className="d-flex flex-column gap-2.5">
                {(streakInfo?.milestones || [
                  { days: 3, unlocked: currentStreak >= 3 },
                  { days: 7, unlocked: currentStreak >= 7 },
                  { days: 14, unlocked: currentStreak >= 14 },
                  { days: 30, unlocked: currentStreak >= 30 },
                  { days: 60, unlocked: currentStreak >= 60 },
                  { days: 100, unlocked: currentStreak >= 100 },
                ]).map((m) => (
                  <div
                    key={m.days}
                    className={`p-3 rounded-3 border d-flex justify-content-between align-items-center transition ${
                      m.unlocked
                        ? "bg-success bg-opacity-10 border-success border-opacity-30"
                        : "bg-light border-secondary border-opacity-20"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="fs-5">{m.unlocked ? "🏆" : "🔒"}</span>
                      <div>
                        <div className="fw-bold text-dark small">{m.days}-Day Streak Badge</div>
                        <div className="extra-small text-muted">
                          {m.unlocked ? "Claimed +100 Bonus XP" : `Reach ${m.days} consecutive active days`}
                        </div>
                      </div>
                    </div>
                    {m.unlocked ? (
                      <span className="badge bg-success text-white extra-small">Unlocked</span>
                    ) : (
                      <span className="badge bg-secondary bg-opacity-20 text-muted extra-small">Locked</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CalendarPage;
