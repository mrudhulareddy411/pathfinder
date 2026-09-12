function StreakCard({ currentStreak = 1, longestStreak = 1 }) {
  return (
    <div className="glass-panel p-4 mb-4 rounded-4 bg-white border border-amber border-warning border-opacity-30 shadow-sm">
      <div className="d-flex align-items-center gap-3">
        <div
          className="fs-2 text-warning p-3 rounded-circle bg-warning  border border-warning border-opacity-30 d-flex align-items-center justify-content-center flex-shrink-0 animate-float"
          style={{ width: "54px", height: "54px", boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)" }}
        >
          🔥
        </div>
        <div className="flex-grow-1">
          <div className="d-flex align-items-center gap-2 mb-1">
            <h5 className="fw-extrabold text-dark mb-0">{currentStreak} Day Activity Streak!</h5>
            <span className="badge bg-warning text-dark extra-small font-monospace">🔥 ACTIVE</span>
          </div>
          <div className="text-secondary small mb-1">
            Longest Record: <strong className="text-dark font-monospace">{longestStreak} Days</strong>
          </div>
          <div className="text-gradient-amber extra-small fw-bold d-flex align-items-center gap-1">
            <span>⚡ Daily Login Bonus:</span>
            <span>+50 XP Multiplier Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakCard;
