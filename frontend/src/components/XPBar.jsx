function XPBar({ xp = 0, levelNumber = 1 }) {
  const getLevelThresholds = (lvl) => {
    const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000];
    return {
      min: thresholds[lvl - 1] || 0,
      max: thresholds[lvl] || 3000,
    };
  };

  const { min, max } = getLevelThresholds(levelNumber);
  const progressInLevel = Math.max(0, xp - min);
  const totalInLevel = max - min;
  const percentage = Math.min(100, Math.round((progressInLevel / totalInLevel) * 100));

  return (
    <div className="glass-panel p-4 mb-3" style={{ background: "rgba(13, 25, 48, 0.85)" }}>
      <div className="d-flex justify-content-between align-items-center mb-2.5">
        <div className="d-flex align-items-center gap-2.5">
          <span className="btn-cyber px-3 py-1 text-dark fs-6 rounded-pill" style={{ background: "linear-gradient(135deg, #00f2fe 0%, #00c6ff 100%)" }}>
            LEVEL {levelNumber}
          </span>
          <div>
            <div className="text-dark fw-bold small">Career Journey XP</div>
            <div className="text-secondary extra-small">Gamified Skill Milestone Progress</div>
          </div>
        </div>
        <div className="text-end">
          <div className="text-gradient-teal fw-bold fs-5 font-monospace">
            {xp} / {max} XP
          </div>
          <div className="text-muted extra-small">{percentage}% Level Complete</div>
        </div>
      </div>

      <div className="progress rounded-pill bg-black  p-0.5" style={{ height: "16px", border: "1px solid rgba(0, 242, 254, 0.25)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.5)" }}>
        <div
          className="progress-bar rounded-pill"
          role="progressbar"
          style={{
            width: `${percentage}%`,
            background: "linear-gradient(90deg, #00f2fe 0%, #38ef7d 50%, #8b5cf6 100%)",
            boxShadow: "0 0 15px rgba(0, 242, 254, 0.6)",
            transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <div className="d-flex justify-content-between text-muted extra-small mt-2">
        <span>⚡ Min: {min} XP</span>
        <span>{max - xp > 0 ? `🔥 ${max - xp} XP needed for Level ${levelNumber + 1}` : "🏆 Max Level Reached!"}</span>
        <span>Target: {max} XP</span>
      </div>
    </div>
  );
}

export default XPBar;
