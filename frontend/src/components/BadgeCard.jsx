function BadgeCard({ badge, unlocked = false }) {
  const rarityBorders = {
    COMMON: "rgba(255, 255, 255, 0.15)",
    RARE: "rgba(56, 189, 248, 0.5)",
    EPIC: "rgba(168, 85, 247, 0.6)",
    LEGENDARY: "rgba(245, 158, 11, 0.7)",
  };

  const rarityGlows = {
    COMMON: "none",
    RARE: "0 0 15px rgba(56, 189, 248, 0.25)",
    EPIC: "0 0 20px rgba(168, 85, 247, 0.35)",
    LEGENDARY: "0 0 25px rgba(245, 158, 11, 0.45)",
  };

  return (
    <div
      className={`glass-panel p-3.5 text-center transition-all ${
        unlocked ? "" : "opacity-50"
      }`}
      style={{
        borderColor: rarityBorders[badge.rarity] || "rgba(255,255,255,0.15)",
        boxShadow: unlocked ? rarityGlows[badge.rarity] || "none" : "none",
      }}
    >
      <div className="fs-1 mb-2 filter-glow">{badge.icon || "🏆"}</div>
      <h6 className="fw-bold text-dark mb-1">{badge.name}</h6>
      <p className="text-secondary extra-small mb-2.5">{badge.description}</p>
      <div className="d-flex justify-content-between align-items-center extra-small">
        <span className="badge bg-secondary  text-light border border-secondary border-opacity-25 px-2 py-1">
          {badge.rarity}
        </span>
        <span className="text-gradient-teal fw-bold font-monospace">+{badge.xpReward} XP</span>
      </div>
    </div>
  );
}

export default BadgeCard;
