import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function CareerDetailsPage() {
  const { onetCode } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError("");

        try {
          const meRes = await api.get("/auth/me");
          setUser(meRes.data);
        } catch {
          console.warn("Guest session.");
        }

        const res = await api.get(`/careers/${onetCode}`);
        setCareer(res.data);
      } catch (err) {
        console.error("Career Details Error:", err);
        setError("Unable to retrieve O*NET career details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [onetCode]);

  const [actionMsg, setActionMsg] = useState("");
  const [completingLvl, setCompletingLvl] = useState({});

  const handleSelectTargetCareer = async () => {
    try {
      if (!career) return;
      const res = await api.post("/recommendations/select", {
        onetCode: career.onetCode || onetCode,
        title: career.title,
      });
      if (res.data?.user) {
        setUser(res.data.user);
      }
      setActionMsg(`Selected '${career.title}' as your target career path! 🎯`);
      setTimeout(() => setActionMsg(""), 3500);
    } catch (err) {
      console.error("Select career error:", err);
    }
  };

  const handleCompleteRoadmapActivity = async (lvl) => {
    try {
      const actId = `act_${onetCode}_lvl_${lvl.level}`;
      setCompletingLvl((prev) => ({ ...prev, [lvl.level]: "recording" }));

      const res = await api.post("/activity/complete", {
        activityId: actId,
        activityType: "ROADMAP_TASK_COMPLETED",
        title: `Completed ${lvl.title}`,
        xpEarned: 100,
        metadata: { level: lvl.level, careerTitle: career?.title },
      });

      if (res.data?.user) {
        setUser(res.data.user);
      }

      if (res.data?.duplicate) {
        setActionMsg(`✓ Level ${lvl.level} already completed previously.`);
      } else {
        setActionMsg(`🎉 Level ${lvl.level} Completed! +100 XP awarded & Streak updated!`);
      }
      setTimeout(() => setActionMsg(""), 4000);
    } catch (err) {
      console.error("Complete roadmap error:", err);
    } finally {
      setCompletingLvl((prev) => ({ ...prev, [lvl.level]: "done" }));
    }
  };

  // Skill Gap Calculation
  const userSkills = (user?.skills || ["JavaScript", "React", "Python", "SQL"]).map((s) => String(s).toLowerCase());
  const requiredSkills = career?.requiredSkills || ["Python", "Data Structures", "SQL", "Git"];

  const strongSkills = requiredSkills.filter((s) => userSkills.includes(s.toLowerCase()));
  const missingSkills = requiredSkills.filter((s) => !userSkills.includes(s.toLowerCase()));

  const completedActSet = new Set((user?.completedActivities || []).map((a) => a.activityId || a.title));

  return (
    <div style={{  minHeight: "100vh" }}>
      <Navbar user={user} />

      <div className="container py-5" style={{ maxWidth: "1100px" }}>
        {actionMsg && (
          <div className="alert alert-success rounded-4 text-center py-2.5 mb-4 fw-bold border-0 bg-success  text-success">
            {actionMsg}
          </div>
        )}

        {/* Navigation Breadcrumb */}
        <div className="d-flex align-items-center gap-2 mb-3 extra-small">
          <Link to="/career-pathfinder" className="text-primary text-decoration-none fw-bold">
            &larr; Back to Career Pathfinder
          </Link>
          <span className="text-muted">•</span>
          <span className="text-muted">O*NET Occupation Details</span>
        </div>

        {loading && (
          <div className="text-center py-5 text-dark">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="fw-bold extra-small text-muted">Loading O*NET career dataset & 8-Level Roadmap...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger rounded-4 p-4 text-center border-danger border-opacity-25">
            <h5 className="fw-bold">Unable to load career details</h5>
            <p className="small mb-0">{error}</p>
          </div>
        )}

        {!loading && !error && career && (
          <>
            {/* HERO OCCUPATION BANNER */}
            <div className="glass-panel p-4 p-md-5 rounded-5 border border-primary border-opacity-15 bg-white shadow-sm mb-4">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <span className="badge bg-primary  text-primary border border-primary border-opacity-20 extra-small">
                      Source: Local O*NET Dataset
                    </span>
                    {career.onetCode && (
                      <span className="badge bg-dark text-dark font-monospace extra-small">
                        O*NET-SOC {career.onetCode}
                      </span>
                    )}
                    {career.inDemand && (
                      <span className="badge bg-success  text-success border border-success border-opacity-30 extra-small">
                        🔥 In Demand
                      </span>
                    )}
                  </div>
                  <h2 className="fw-extrabold text-dark mb-2">{career.title}</h2>
                  <p className="text-secondary small leading-relaxed mb-3" style={{ maxWidth: "750px" }}>
                    {career.description}
                  </p>

                  <button
                    onClick={handleSelectTargetCareer}
                    className={`btn btn-sm fw-bold rounded-3 px-4 py-2 ${
                      user?.selectedCareerDetails?.title === career.title
                        ? "btn-success text-dark"
                        : "btn-cyber"
                    }`}
                  >
                    {user?.selectedCareerDetails?.title === career.title
                      ? "✓ Current Target Career Path"
                      : "🎯 Select as Target Career Path"}
                  </button>
                </div>

                <div className="p-3 bg-light rounded-4 border extra-small text-end" style={{ minWidth: "220px" }}>
                  <div className="text-muted mb-1">Average Salary Potential</div>
                  <div className="fs-5 fw-extrabold text-primary font-monospace">
                    {typeof career.salaryRange === "object"
                      ? `₹${career.salaryRange.minLPA || 6}L - ₹${career.salaryRange.maxLPA || 24}L`
                      : career.salaryRange || "₹6.0 LPA - ₹24.0 LPA"}
                  </div>
                  <div className="extra-small text-muted mt-1">Verified Entry & Senior Band</div>
                </div>
              </div>
            </div>

            {/* GRID: SKILLS GAP ANALYSIS & ONET KNOWLEDGE/ABILITIES */}
            <div className="row g-4 mb-4">
              {/* SKILLS GAP MATRIX */}
              <div className="col-12 col-lg-6">
                <div className="glass-panel p-4 rounded-5 border border-primary border-opacity-15 bg-white shadow-sm h-100">
                  <h5 className="fw-extrabold text-dark mb-3 d-flex align-items-center gap-2">
                    <span>⚡</span> Skills Gap Analysis
                  </h5>
                  <p className="extra-small text-muted mb-3">
                    Comparison of your current assessment profile skills against O*NET required skills for {career.title}.
                  </p>

                  {/* Strong Skills */}
                  <div className="mb-3">
                    <div className="fw-bold extra-small text-success mb-1.5">✓ Strong Skills (Matched):</div>
                    <div className="d-flex flex-wrap gap-1.5">
                      {strongSkills.length > 0 ? (
                        strongSkills.map((s) => (
                          <span key={s} className="badge bg-success  text-success border border-success border-opacity-25 px-3 py-1.5 rounded-pill extra-small fw-semibold">
                            ✓ {s}
                          </span>
                        ))
                      ) : (
                        <span className="extra-small text-muted">No exact skill matches recorded yet.</span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills with Start Learning */}
                  <div className="mb-3">
                    <div className="fw-bold extra-small text-danger mb-1.5">⚠ Missing & Developing Skills:</div>
                    <div className="d-flex flex-column gap-2">
                      {missingSkills.length > 0 ? (
                        missingSkills.map((s) => (
                          <div key={s} className="p-2.5 bg-light rounded-3 border d-flex justify-content-between align-items-center extra-small">
                            <span className="fw-semibold text-dark">• {s}</span>
                            <Link
                              to={`/resources?skill=${encodeURIComponent(s)}`}
                              className="btn btn-cyber btn-sm py-1 px-3 rounded-pill text-decoration-none fw-bold extra-small"
                            >
                              📖 Start Learning ↗
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="alert alert-success extra-small rounded-3 mb-0">
                          🎉 Excellent! You possess all core skills required for this occupation.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ONET ABILITIES & KNOWLEDGE */}
              <div className="col-12 col-lg-6">
                <div className="glass-panel p-4 rounded-5 border border-primary border-opacity-15 bg-white shadow-sm h-100">
                  <h5 className="fw-extrabold text-dark mb-3 d-flex align-items-center gap-2">
                    <span>🧠</span> O*NET Abilities & Knowledge
                  </h5>

                  <div className="mb-3">
                    <div className="fw-bold extra-small text-dark mb-1">Core Cognitive Abilities:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {(career.abilities || ["Deductive Reasoning", "Problem Sensitivity", "Mathematical Reasoning"]).map((a) => (
                        <span key={a} className="badge badge-clean-blue extra-small">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="fw-bold extra-small text-dark mb-1">Knowledge Domains:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {(career.knowledge || ["Computers & Electronics", "Mathematics", "Engineering"]).map((k) => (
                        <span key={k} className="badge badge-clean-gray extra-small">
                          {k}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="fw-bold extra-small text-dark mb-1">Software & Technologies:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {(career.softwareTech || ["Python", "SQL", "Git", "Docker"]).map((st) => (
                        <span key={st} className="badge badge-clean-amber extra-small font-monospace">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* DYNAMIC 8-LEVEL CAREER ROADMAP */}
            <div className="glass-panel p-4 p-md-5 rounded-5 border border-primary border-opacity-15 bg-white shadow-sm">
              <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-2">
                <div>
                  <span className="badge bg-primary  text-primary border border-primary border-opacity-20 extra-small mb-1">
                    Generated by local Random Forest model
                  </span>
                  <h4 className="fw-extrabold text-dark mb-0 d-flex align-items-center gap-2">
                    <span>🗺️</span> 8-Level Progression Roadmap for {career.title}
                  </h4>
                </div>
                <span className="badge bg-success  text-success border border-success border-opacity-30 extra-small font-monospace">
                  8 Milestone Levels
                </span>
              </div>

              <div className="row g-4">
                {(career.roadmap || []).map((lvl) => {
                  const actId = `act_${onetCode}_lvl_${lvl.level}`;
                  const isDone = completedActSet.has(actId) || completedActSet.has(`Completed ${lvl.title}`);
                  const isRecording = completingLvl[lvl.level] === "recording";

                  return (
                    <div className="col-12 col-md-6 col-lg-3" key={lvl.level}>
                      <div className="p-3.5 bg-light rounded-4 border border-secondary border-opacity-20 shadow-sm h-100 d-flex flex-column hover-lift transition">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <span className="badge bg-primary text-dark font-monospace rounded-circle p-2" style={{ width: "30px", height: "30px" }}>
                            {lvl.level}
                          </span>
                          <h6 className="fw-bold text-dark mb-0 extra-small">{lvl.title}</h6>
                        </div>
                        <p className="extra-small text-muted mb-3 flex-fill leading-relaxed">{lvl.desc}</p>
                        <div className="d-flex flex-wrap gap-1 pt-2 border-top border-secondary border-opacity-15 mb-3">
                          {lvl.topics.map((t) => (
                            <span key={t} className="badge bg-white text-dark border extra-small">
                              • {t}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => handleCompleteRoadmapActivity(lvl)}
                          className={`btn btn-sm w-100 fw-bold rounded-3 extra-small py-1.5 transition ${
                            isDone
                              ? "btn-success text-dark"
                              : "btn-outline-primary"
                          }`}
                          disabled={isDone || isRecording}
                        >
                          {isDone
                            ? "✓ Milestone Completed (+100 XP)"
                            : isRecording
                            ? "Recording..."
                            : "⚡ Complete Milestone (+100 XP)"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CareerDetailsPage;
