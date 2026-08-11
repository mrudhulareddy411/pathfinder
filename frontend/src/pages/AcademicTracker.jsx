import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AcademicTracker() {
  const [user, setUser] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const meRes = await api.get("/auth/me");
        setUser(meRes.data);

        try {
          const perfRes = await api.get("/academic/performance");
          if (perfRes.data && perfRes.data.performance) {
            setPerformance(perfRes.data.performance);
          }
        } catch {
          console.warn("Could not load academic performance data.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const gpaDisplay = user?.cgpa || performance?.gpa || "Not provided";
  const completedCount = performance?.assessmentsCompletedCount || 0;
  const avgScore = performance?.averageScore || "No assessments yet";
  const recentAttempts = performance?.recentAttempts || [];
  const strongestSkills = performance?.strongestSkills || [];
  const skillsToImprove = performance?.skillsToImprove || [];
  const recommendedAssessments = performance?.recommendedAssessments || [];

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />
      <div className="container py-4" style={{ maxWidth: "1150px" }}>
        {/* HEADER SECTION */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Assessment & Academic Performance</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Academic & Assessment Dashboard
              </h2>
              <p className="text-secondary small mb-0">
                Direct GPA profile records combined with real-time test attempts and skill performance analytics.
              </p>
            </div>
            <Link to="/profile/edit" className="btn btn-outline-clean btn-sm">
              ✏️ Update Profile GPA
            </Link>
          </div>
        </div>

        {/* SUMMARY METRICS CARDS */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="clean-card p-3 h-100">
              <div className="extra-small text-secondary fw-semibold text-uppercase">Student GPA</div>
              <div className="fw-bold text-primary fs-3 mt-1">
                {gpaDisplay !== "Not provided" ? `${gpaDisplay}` : "Not provided"}
              </div>
              <div className="extra-small text-muted mt-1">
                {user?.educationLevel || "Degree"} • {user?.branch || "Major"}
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="clean-card p-3 h-100">
              <div className="extra-small text-secondary fw-semibold text-uppercase">Assessments Completed</div>
              <div className="fw-bold text-dark fs-3 mt-1">{completedCount}</div>
              <div className="extra-small text-muted mt-1">Verified test submissions</div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="clean-card p-3 h-100">
              <div className="extra-small text-secondary fw-semibold text-uppercase">Average Assessment Score</div>
              <div className="fw-bold text-success fs-3 mt-1">{avgScore}</div>
              <div className="extra-small text-muted mt-1">Evaluated across all topics</div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-lg-3">
            <div className="clean-card p-3 h-100">
              <div className="extra-small text-secondary fw-semibold text-uppercase">Top Strong Skill</div>
              <div className="fw-bold text-primary fs-5 mt-1 text-truncate">
                {performance?.topSkill || "No test data yet"}
              </div>
              <div className="extra-small text-muted mt-1">
                Weakest: {performance?.weakestSkill || "None"}
              </div>
            </div>
          </div>
        </div>

        {/* SKILLS BREAKDOWN & RECENT ASSESSMENTS */}
        <div className="row g-4 mb-4">
          {/* Skill Performance Breakdown */}
          <div className="col-12 col-lg-6">
            <div className="clean-card p-4 h-100">
              <h5 className="fw-bold text-dark mb-3">Skill Performance Analysis</h5>

              {strongestSkills.length === 0 && skillsToImprove.length === 0 ? (
                <div className="text-center py-4 bg-light rounded-3">
                  <div className="fs-2 mb-2">🧭</div>
                  <h6 className="fw-bold text-dark mb-1">No Assessment Data Yet</h6>
                  <p className="text-secondary small mb-3">Complete assessments to build your real skill score breakdown.</p>
                  <Link to="/assessment" className="btn btn-primary-clean btn-sm">
                    Take Assessment Now
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {/* Strongest Skills */}
                  <div>
                    <div className="extra-small fw-bold text-success text-uppercase mb-2">
                      💪 Strongest Skills (≥ 70%)
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {strongestSkills.length > 0 ? (
                        strongestSkills.map((s) => (
                          <span key={s.name} className="badge badge-clean-green px-2.5 py-1.5 fs-7">
                            {s.name} — {s.score}%
                          </span>
                        ))
                      ) : (
                        <span className="text-muted extra-small">No skills above 70% yet</span>
                      )}
                    </div>
                  </div>

                  <hr className="my-1 border-secondary border-opacity-15" />

                  {/* Skills Needing Improvement */}
                  <div>
                    <div className="extra-small fw-bold text-warning text-uppercase mb-2">
                      ⚠️ Skills Needing Improvement (&lt; 70%)
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                      {skillsToImprove.length > 0 ? (
                        skillsToImprove.map((s) => (
                          <span key={s.name} className="badge badge-clean-amber px-2.5 py-1.5 fs-7">
                            {s.name} — {s.score}%
                          </span>
                        ))
                      ) : (
                        <span className="text-muted extra-small">No skills flagged for improvement</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recent Assessment Results */}
          <div className="col-12 col-lg-6">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">Recent Assessment Results</h5>
                  <Link to="/assessment" className="btn btn-outline-clean btn-sm extra-small">
                    + Take Assessment
                  </Link>
                </div>

                {recentAttempts.length === 0 ? (
                  <div className="text-center py-4 bg-light rounded-3">
                    <p className="text-secondary small mb-0">Assessment Score: No assessments yet</p>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2">
                    {recentAttempts.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 clean-card-flat bg-light d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div className="fw-bold text-dark small">{att.title}</div>
                          <div className="extra-small text-secondary">
                            {att.category} • {new Date(att.completedAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="text-end">
                          <span
                            className={`badge fs-6 ${
                              att.percentage >= 80
                                ? "badge-clean-green"
                                : att.percentage >= 60
                                ? "badge-clean-blue"
                                : "badge-clean-amber"
                            }`}
                          >
                            {att.percentage}%
                          </span>
                          <div className="extra-small text-muted">
                            {att.score}/{att.totalQuestions} Correct
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RECOMMENDED ASSESSMENTS CATALOG */}
        <div className="clean-card p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold text-dark mb-0">Recommended Skill Assessments</h5>
              <p className="text-secondary extra-small mb-0">
                Choose a domain or career path assessment to test your knowledge.
              </p>
            </div>
            <Link to="/assessment" className="btn btn-primary-clean btn-sm">
              View All Assessments
            </Link>
          </div>

          <div className="row g-3">
            {recommendedAssessments.length > 0 ? (
              recommendedAssessments.map((asm) => (
                <div key={asm.id} className="col-12 col-md-6 col-lg-4">
                  <div className="p-3 clean-card-flat bg-light h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="badge badge-clean-blue extra-small">{asm.category}</span>
                        <span className="extra-small text-muted">{asm.durationMinutes || 15} mins</span>
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{asm.title}</h6>
                    </div>
                    <div className="mt-3 text-end">
                      <Link to="/assessment" className="btn btn-outline-primary btn-sm extra-small">
                        Start Test ➔
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="p-3 bg-light rounded text-secondary text-center small">
                  Loading recommended assessments...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AcademicTracker;
