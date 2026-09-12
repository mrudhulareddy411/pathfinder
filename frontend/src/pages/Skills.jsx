import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const availableCareers = [
  "Software Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "Data Engineer",
  "Cloud Architect",
  "Cybersecurity Specialist"
];

function Skills() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [selectedCareer, setSelectedCareer] = useState("Software Developer");
  const [skillGapData, setSkillGapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedItems, setCompletedItems] = useState({});

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        setLoading(true);
        setError("");

        try {
          const meRes = await api.get("/auth/me");
          setUser(meRes.data);
        } catch {
          console.warn("Using default student auth data.");
        }

        const sgRes = await api.get(`/skill-gap?career=${encodeURIComponent(selectedCareer)}`);
        if (sgRes.data) {
          setSkillGapData(sgRes.data);
        }
      } catch (err) {
        console.error("Fetch Skill Gap Error:", err);
        setError(err.response?.data?.message || err.message || "Failed to load personalized skill gap analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, [selectedCareer]);

  const completedActSet = new Set((user?.completedActivities || []).map((a) => a.activityId || a.title));

  const handleCompleteActivity = async (itemId, itemTitle, itemSkill) => {
    try {
      setCompletedItems((prev) => ({ ...prev, [itemId]: "completing" }));

      const res = await api.post("/activity/complete", {
        activityId: String(itemId),
        activityType: "RESOURCE_COMPLETED",
        title: `Completed ${itemTitle} (${itemSkill})`,
        xpEarned: 50,
      });

      if (res.data?.user) {
        setUser(res.data.user);
      }
      setCompletedItems((prev) => ({ ...prev, [itemId]: "done" }));
    } catch (err) {
      console.error("Activity complete error:", err);
      setCompletedItems((prev) => ({ ...prev, [itemId]: "done" }));
    }
  };

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />

      <div className="container py-4" style={{ maxWidth: "1100px" }}>
        {/* HEADER SECTION */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Competency Profiler</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Skills Gap Analysis
              </h2>
              <p className="text-secondary small mb-0">
                Compare your current technical skills against industry standard benchmarks for target career occupations.
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-clean btn-sm"
                onClick={() => navigate("/assessment")}
              >
                ✏️ Update Assessment
              </button>
            </div>
          </div>
        </div>

        {/* TARGET CAREER SELECTOR DROPDOWN */}
        <div className="clean-card p-4 mb-4">
          <div className="row align-items-center g-3">
            <div className="col-12 col-md-5">
              <label className="fw-bold text-dark small mb-1 d-block">Select Target Occupation:</label>
              <select
                className="form-select border-subtle small fw-medium"
                value={selectedCareer}
                onChange={(e) => setSelectedCareer(e.target.value)}
                style={{ borderColor: "#E2E8F0", borderRadius: "8px", padding: "10px 14px" }}
              >
                {availableCareers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-7">
              <div className="p-3 clean-card-flat bg-light">
                <div className="extra-small text-secondary">
                  💡 <strong>Dynamic Analysis:</strong> Selecting a target role updates the required skills benchmark matrix, missing skill gaps, and recommended learning resources dynamically.
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="clean-card p-5 text-center mb-4">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="small text-secondary mb-0">Calculating skill gap matrix for {selectedCareer}...</p>
          </div>
        )}

        {(!skillGapData?.hasData || skillGapData?.hasData === false) && !loading && (
          <div className="clean-card p-5 text-center mb-4">
            <div className="fs-1 mb-2">🧭</div>
            <h5 className="fw-bold text-dark mb-1">No Assessment Data Yet</h5>
            <p className="text-secondary small mb-3">
              Complete more assessments to generate your skill analysis.
            </p>
            <button onClick={() => navigate("/assessment")} className="btn btn-primary-clean">
              ⚡ Take Skill Assessment Now
            </button>
          </div>
        )}

        {error && (
          <div className="clean-card p-4 text-center border-danger mb-4">
            <h6 className="fw-bold text-danger mb-1">Unable to calculate skill gap analysis</h6>
            <p className="small text-secondary mb-0">{error}</p>
          </div>
        )}

        {/* RESULTS MATRIX */}
        {!loading && skillGapData && (
          <>
            {/* CAREER BENCHMARK SUMMARY CARD */}
            <div className="clean-card p-4 mb-4">
              <div className="row align-items-center g-3">
                <div className="col-12 col-md-8">
                  <span className="badge badge-clean-blue mb-1">Active Target Role</span>
                  <h4 className="fw-bold text-dark mb-1">🎯 {skillGapData.career || selectedCareer}</h4>
                  <p className="text-secondary small mb-0">
                    Calculated required skills benchmark for {skillGapData.career || selectedCareer}.
                  </p>
                </div>
                <div className="col-12 col-md-4 text-md-end">
                  <div className="p-3 clean-card-flat bg-light d-inline-block text-center" style={{ minWidth: "160px" }}>
                    <div className="extra-small text-secondary fw-medium">Role Match Score</div>
                    <div className="fw-bold text-primary fs-3 mt-0.5">{skillGapData.overallMatch || 85}%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* SKILLS MATRIX TABLE */}
            <div className="clean-card p-0 mb-4 overflow-hidden">
              <div className="p-4 border-bottom bg-light d-flex justify-content-between align-items-center">
                <h5 className="fw-bold text-dark mb-0">Competency Comparison Matrix</h5>
                <span className="badge badge-clean-gray">Industry Readiness Benchmark: 70/100</span>
              </div>

              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light extra-small text-secondary text-uppercase">
                    <tr>
                      <th className="ps-4 py-3">Required Skill</th>
                      <th className="py-3">Current Level</th>
                      <th className="py-3">Target Benchmark</th>
                      <th className="py-3">Skill Gap</th>
                      <th className="pe-4 py-3 text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skillGapData.skills?.map((item) => {
                      const level = item.currentLevel || 40;
                      let statusBadge = <span className="badge badge-clean-green">✓ Strong</span>;
                      if (level < 40 || item.status === "Missing" || item.status === "High Gap") {
                        statusBadge = <span className="badge badge-clean-amber">Missing / High Gap</span>;
                      } else if (level < 70 || item.status === "Needs Improvement") {
                        statusBadge = <span className="badge badge-clean-gray">Needs Improvement</span>;
                      }

                      return (
                        <tr key={item.skill}>
                          <td className="ps-4 fw-semibold text-dark small">{item.skill}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2" style={{ maxWidth: "160px" }}>
                              <span className="extra-small fw-bold text-dark" style={{ width: "32px" }}>{level}%</span>
                              <div className="progress flex-grow-1 rounded-pill bg-light" style={{ height: "6px" }}>
                                <div
                                  className="progress-bar rounded-pill"
                                  style={{
                                    width: `${Math.min(100, level)}%`,
                                    backgroundColor: level >= 70 ? "#16A34A" : level >= 40 ? "#F59E0B" : "#DC2626"
                                  }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="extra-small text-secondary">70 / 100</td>
                          <td>
                            <span className={`extra-small fw-bold ${item.gap > 0 ? "text-danger" : "text-success"}`}>
                              {item.gap > 0 ? `-${item.gap}%` : "0% (Met)"}
                            </span>
                          </td>
                          <td className="pe-4 text-end">{statusBadge}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RECOMMENDED LEARNING RESOURCES SECTION */}
            <div className="clean-card p-4 mb-4">
              <h5 className="fw-bold text-dark mb-1">Recommended Learning for {selectedCareer}</h5>
              <p className="text-secondary small mb-3">
                Targeted resources selected to bridge identified gaps for <strong>{selectedCareer}</strong>.
              </p>

              {!skillGapData.learningResources || skillGapData.learningResources.length === 0 ? (
                <div className="p-4 rounded-3 bg-light text-center text-success">
                  <div className="fw-bold mb-1">🎉 Benchmark Achieved!</div>
                  <div className="extra-small text-secondary">You meet or exceed all proficiency benchmarks for {selectedCareer}.</div>
                </div>
              ) : (
                <div className="row g-3">
                  {skillGapData.learningResources.map((item) => {
                    const itemId = item._id || item.url || item.title;
                    const isDone = completedActSet.has(String(itemId)) || completedItems[itemId] === "done";
                    const isCompleting = completedItems[itemId] === "completing";

                    return (
                      <div className="col-12 col-md-6 col-lg-4" key={itemId}>
                        <div className="p-3 clean-card-flat bg-light h-100 d-flex flex-column justify-content-between">
                          <div>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="badge badge-clean-amber extra-small">Gap: {item.skill}</span>
                              <span className="badge badge-clean-gray extra-small">{item.difficulty || "Intermediate"}</span>
                            </div>

                            <div className="fw-bold text-dark small mb-1">{item.title}</div>
                            <div className="extra-small text-secondary mb-3">Provider: {item.provider}</div>
                          </div>

                          <div className="d-flex flex-column gap-2 pt-2 border-top">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn btn-outline-clean btn-sm extra-small w-100 text-center justify-content-center"
                            >
                              Open Resource ↗
                            </a>
                            <button
                              onClick={() => handleCompleteActivity(itemId, item.title, item.skill)}
                              className={`btn btn-sm extra-small w-100 justify-content-center ${isDone ? "btn-success text-dark" : "btn-primary-clean"}`}
                              disabled={isDone || isCompleting}
                            >
                              {isDone ? "✓ Completed (+50 XP)" : isCompleting ? "Saving..." : "Complete & Earn +50 XP"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Skills;
