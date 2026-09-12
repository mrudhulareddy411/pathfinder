import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Assessment() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Level Selection State
  const [levelSelectAsm, setLevelSelectAsm] = useState(null);

  // Active Test Mode State
  const [activeTest, setActiveTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [testLoading, setTestLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const categories = [
    "All",
    "Skill Based",
    "Programming",
    "Data Structures",
    "Algorithms",
    "DBMS",
    "SQL",
    "JavaScript",
    "Web Development",
    "Machine Learning",
    "Operating Systems",
    "Computer Networks",
    "Software Developer",
  ];

  useEffect(() => {
    fetchMe();
    fetchAssessmentCatalog();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      if (res.data) setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const fetchAssessmentCatalog = async () => {
    try {
      setLoading(true);
      const res = await api.get("/assessments");
      if (res.data && res.data.assessments) {
        setAssessments(res.data.assessments);
      }
    } catch (err) {
      console.error("Error fetching assessment catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  // Launch Test Mode
  const startAssessment = async (asm, level = "Medium") => {
    try {
      setTestLoading(true);
      setLevelSelectAsm(null);
      setErrorMsg("");
      setTestResult(null);
      setAnswers({});
      setCurrentQuestionIndex(0);

      // Secure Question fetch: DOES NOT CONTAIN correctAnswer
      const res = await api.get(`/assessments/${asm._id || asm.id || asm.category}/take?level=${level}`);
      if (res.data && res.data.assessment) {
        setActiveTest(res.data.assessment);
        setTestQuestions(res.data.assessment.questions || []);
      } else {
        setErrorMsg("Could not load test questions. Please try again.");
      }
    } catch (err) {
      console.error("Start test error:", err);
      setErrorMsg(err.response?.data?.message || "Error starting test session.");
    } finally {
      setTestLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionText) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleSubmitTest = async () => {
    if (!activeTest || testQuestions.length === 0) return;

    try {
      setSubmitting(true);
      setErrorMsg("");
      const testId = activeTest._id || activeTest.id || activeTest.category;
      const res = await api.post(`/assessments/${testId}/submit`, {
        answers,
        assessmentTitle: activeTest.title,
      });

      if (res.data && res.data.success) {
        setTestResult(res.data.result);
      } else {
        setErrorMsg(res.data?.message || "Failed to evaluate assessment.");
      }
    } catch (err) {
      console.error("Submit test error:", err);
      setErrorMsg(err.response?.data?.message || "Server error submitting test.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAssessments = assessments.filter((a) => {
    const matchesCat = selectedCategory === "All" || a.category?.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />

      <div className="container py-4" style={{ maxWidth: "1050px" }}>
        {/* LEVEL SELECTION MODAL */}
        {levelSelectAsm && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1060, backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
            <div className="bg-white p-4 p-md-5 rounded-4 shadow-lg text-center" style={{ maxWidth: "500px", width: "90%", transform: "scale(1)", transition: "all 0.3s ease" }}>
              <span className="badge bg-primary  text-primary mb-3 px-3 py-2 rounded-pill fw-bold">
                Select Difficulty Level
              </span>
              <h3 className="fw-extrabold text-dark mb-2">{levelSelectAsm.title}</h3>
              <p className="text-secondary small mb-4">Choose a difficulty level. Higher difficulty levels will generate a harder set of randomized questions tailored to your selection.</p>
              
              <div className="d-flex flex-column gap-3 mb-4">
                <button onClick={() => startAssessment(levelSelectAsm, 'Easy')} className="btn py-3 rounded-3 fw-bold text-dark border transition" style={{ backgroundColor: "#f0fdf4", borderColor: "#bbf7d0" }} onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.95)"} onMouseLeave={(e) => e.currentTarget.style.filter = "none"}>🌱 Easy (Beginner)</button>
                <button onClick={() => startAssessment(levelSelectAsm, 'Medium')} className="btn py-3 rounded-3 fw-bold text-dark border transition" style={{ backgroundColor: "#eff6ff", borderColor: "#bfdbfe" }} onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.95)"} onMouseLeave={(e) => e.currentTarget.style.filter = "none"}>⚡ Medium (Intermediate)</button>
                <button onClick={() => startAssessment(levelSelectAsm, 'Hard')} className="btn py-3 rounded-3 fw-bold text-dark border transition" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }} onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.95)"} onMouseLeave={(e) => e.currentTarget.style.filter = "none"}>🔥 Hard (Advanced)</button>
              </div>
              <button onClick={() => setLevelSelectAsm(null)} className="btn btn-light text-muted w-100 rounded-pill fw-medium">Cancel</button>
            </div>
          </div>
        )}

        {/* TEST RESULT MODAL VIEW */}
        {testResult ? (
          <div className="clean-card p-4 p-md-5 text-center">
            <div className="fs-1 mb-2">🎉</div>
            <span className="badge badge-clean-green mb-2">Assessment Completed</span>
            <h3 className="fw-bold text-dark mb-1">{activeTest?.title || "Assessment Result"}</h3>
            <p className="text-secondary small mb-4">
              Your test has been evaluated securely by the backend and saved to your profile.
            </p>

            <div
              className="p-4 p-md-5 rounded-4 mx-auto mb-4 position-relative overflow-hidden shadow-sm"
              style={{
                maxWidth: "480px",
                background: "linear-gradient(135deg, #f0f9ff 0%, #dbeafe 100%)",
                border: "2px solid #bfdbfe"
              }}
            >
              <div className="text-primary fw-bold text-uppercase tracking-wider mb-2" style={{ letterSpacing: "1px", fontSize: "0.85rem" }}>Your Final Score</div>
              <div className="fw-extrabold text-primary mb-2" style={{ fontSize: "5rem", lineHeight: "1" }}>{testResult.percentage}%</div>
              <div className="fw-semibold text-dark fs-5 mt-3">
                {testResult.score} out of {testResult.totalQuestions} Correct
              </div>
            </div>

            {testResult.skillScores && Object.keys(testResult.skillScores).length > 0 && (
              <div className="mb-5 text-start mx-auto" style={{ maxWidth: "480px" }}>
                <h5 className="fw-extrabold text-dark mb-3">Skill Breakdown</h5>
                <div className="d-flex flex-column gap-3">
                  {Object.entries(testResult.skillScores).map(([sk, pct]) => (
                    <div key={sk} className="bg-white p-3 rounded-4 border shadow-sm">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-dark fs-6">{sk}</span>
                        <span className="badge bg-primary px-3 py-1.5 rounded-pill shadow-sm">{pct}%</span>
                      </div>
                      <div className="progress rounded-pill overflow-hidden" style={{ height: "10px", backgroundColor: "#e2e8f0" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${pct}%`, transition: "width 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="d-flex justify-content-center gap-3">
              <button onClick={() => { setTestResult(null); setActiveTest(null); }} className="btn btn-outline-clean">
                Take Another Assessment
              </button>
              <button onClick={() => navigate("/academics")} className="btn btn-primary-clean">
                View Academic & Skill Tracker ➔
              </button>
            </div>
          </div>
        ) : activeTest ? (
          /* ACTIVE TEST TAKING VIEW */
          <div className="clean-card p-4 p-md-5">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
              <div>
                <span className="badge badge-clean-blue mb-1">{activeTest.category}</span>
                <h4 className="fw-bold text-dark mb-0">{activeTest.title}</h4>
              </div>
              <button onClick={() => setActiveTest(null)} className="btn btn-outline-danger btn-sm extra-small">
                ✕ Exit Test
              </button>
            </div>

            {errorMsg && <div className="alert alert-danger p-2 extra-small rounded mb-3">{errorMsg}</div>}

            {testQuestions.length > 0 ? (
              <div>
                {/* Progress bar */}
                <div className="d-flex justify-content-between text-secondary extra-small mb-1">
                  <span>
                    Question {currentQuestionIndex + 1} of {testQuestions.length}
                  </span>
                  <span>
                    {Math.round(((currentQuestionIndex + 1) / testQuestions.length) * 100)}% Complete
                  </span>
                </div>
                <div className="progress rounded-pill bg-light mb-4" style={{ height: "6px" }}>
                  <div
                    className="progress-bar rounded-pill bg-primary"
                    style={{ width: `${((currentQuestionIndex + 1) / testQuestions.length) * 100}%` }}
                  ></div>
                </div>

                {/* Question Card */}
                {(() => {
                  const q = testQuestions[currentQuestionIndex];
                  const qId = q._id || q.questionId || currentQuestionIndex;
                  const selectedOpt = answers[qId] || "";

                  return (
                    <div className="p-4 p-md-5 bg-white shadow-sm rounded-4 mb-4 border border-light">
                      <h4 className="fw-extrabold text-dark mb-4 lh-base" style={{ fontSize: "1.35rem" }}>
                        <span className="text-primary me-2">Q{currentQuestionIndex + 1}.</span>
                        {q.question}
                      </h4>

                      <div className="d-flex flex-column gap-3">
                        {q.options?.map((opt, idx) => {
                          const isSelected = selectedOpt === opt;
                          return (
                            <div
                              key={idx}
                              onClick={() => handleOptionSelect(qId, opt)}
                              className={`p-3 rounded-4 border d-flex align-items-center gap-3 ${
                                isSelected ? "border-primary bg-primary " : "border-light bg-light"
                              }`}
                              style={{
                                cursor: "pointer",
                                transform: isSelected ? "scale(1.01)" : "scale(1)",
                                boxShadow: isSelected ? "0 4px 15px rgba(37, 99, 235, 0.12)" : "none",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                              }}
                              onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.transform = "scale(1.01)"; e.currentTarget.style.backgroundColor = "#f8fafc"; } }}
                              onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.backgroundColor = ""; } }}
                            >
                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 fw-bold shadow-sm ${
                                  isSelected ? "bg-primary text-dark" : "bg-white border text-secondary"
                                }`}
                                style={{ width: "28px", height: "28px", fontSize: "13px" }}
                              >
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className={`small ${isSelected ? "text-primary fw-bold" : "text-dark"}`}>{opt}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between align-items-center">
                  <button
                    disabled={currentQuestionIndex === 0}
                    onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    className="btn btn-outline-clean btn-sm"
                  >
                    ← Previous
                  </button>

                  {currentQuestionIndex < testQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      className="btn btn-primary-clean btn-sm"
                    >
                      Next Question →
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitTest}
                      disabled={submitting}
                      className="btn btn-success fw-bold btn-sm px-4"
                    >
                      {submitting ? "Evaluating Answers..." : "✓ Submit Test"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                {testLoading ? "Loading secure test questions..." : "No questions available for this test."}
              </div>
            )}
          </div>
        ) : (
          /* CATALOG VIEW */
          <div>
            {/* Header Banner */}
            <div
              className="p-4 p-md-5 mb-4 text-center rounded-4 position-relative overflow-hidden shadow-sm"
              style={{
                background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                color: "#ffffff"
              }}
            >
              <div className="position-relative z-index-1">
                <span className="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm d-inline-block">
                  ⚡ Technical & Career Assessments
                </span>
                <h2 className="fw-extrabold mb-3 text-dark" style={{ fontSize: "2.25rem", letterSpacing: "-0.02em" }}>
                  Skill Evaluation Center
                </h2>
                <p className="text-dark-50 mx-auto mb-0" style={{ maxWidth: "700px", lineHeight: "1.6", fontSize: "1.1rem" }}>
                  Discover your strengths and identify growth areas. Take domain-specific assessments powered by our advanced intelligence engine.
                </p>
              </div>
              {/* Decorative background element */}
              <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: "radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 50%)", pointerEvents: "none" }}></div>
            </div>

            {/* Filter & Search Toolbar */}
            <div
              className="p-3 mb-4 rounded-4 shadow-sm border border-light bg-white sticky-top"
              style={{ top: "70px", zIndex: 100 }}
            >
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                {/* Category Pills */}
                <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
                <div className="d-flex flex-nowrap overflow-auto w-100 gap-2 pb-1 hide-scrollbar" style={{ WebkitOverflowScrolling: "touch" }}>
                  {categories.slice(0, 7).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`btn btn-sm flex-shrink-0 ${
                        selectedCategory === cat ? "btn-primary-clean" : "btn-outline-clean text-secondary"
                      } extra-small rounded-pill`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="w-100" style={{ maxWidth: "320px" }}>
                  <input
                    type="text"
                    className="form-control border-subtle extra-small"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Assessment Grid */}
            {loading ? (
              <div className="text-center py-5 text-muted">Loading assessments...</div>
            ) : (
              <div className="row g-4">
                {filteredAssessments.map((asm) => (
                  <div key={asm._id || asm.id} className="col-12 col-md-6 col-lg-4">
                    <div
                      className="p-4 h-100 d-flex flex-column justify-content-between rounded-4 bg-white border border-light shadow-sm"
                      style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 15px 35px rgba(0,0,0,0.08)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)"; // standard shadow-sm
                      }}
                    >
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span className="badge bg-primary  text-primary px-3 py-1.5 rounded-pill fw-bold border border-primary border-opacity-25 small">
                            {asm.category}
                          </span>
                          <span className="badge bg-light text-secondary border fw-medium px-2 py-1">
                            ⏱ {asm.durationMinutes || 15} mins
                          </span>
                        </div>

                        <h5 className="fw-extrabold text-dark mb-2 fs-5 lh-sm">{asm.title}</h5>
                        <p className="text-secondary small mb-3 lh-base">{asm.description || "Comprehensive skill evaluation assessment to gauge your expertise."}</p>

                        <div className="d-flex flex-wrap gap-1.5 mb-3">
                          {asm.topics?.slice(0, 4).map((tp) => (
                            <span key={tp} className="badge bg-light text-muted border px-2 py-1 rounded-pill" style={{ fontSize: "0.7rem" }}>
                              {tp}
                            </span>
                          ))}
                          {asm.topics?.length > 4 && (
                            <span className="badge bg-light text-muted border px-2 py-1 rounded-pill" style={{ fontSize: "0.7rem" }}>
                              +{asm.topics.length - 4}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setLevelSelectAsm(asm)}
                        className="btn w-100 fw-bold mt-3 py-2 rounded-3 text-dark shadow-sm"
                        style={{
                          background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)",
                          border: "none",
                          transition: "opacity 0.2s ease"
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        Start Assessment ➔
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Assessment;
