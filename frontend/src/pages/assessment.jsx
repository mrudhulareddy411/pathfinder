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
  const startAssessment = async (asm) => {
    try {
      setTestLoading(true);
      setErrorMsg("");
      setTestResult(null);
      setAnswers({});
      setCurrentQuestionIndex(0);

      // Secure Question fetch: DOES NOT CONTAIN correctAnswer
      const res = await api.get(`/assessments/${asm._id || asm.id || asm.category}/take`);
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
        {/* TEST RESULT MODAL VIEW */}
        {testResult ? (
          <div className="clean-card p-4 p-md-5 text-center">
            <div className="fs-1 mb-2">🎉</div>
            <span className="badge badge-clean-green mb-2">Assessment Completed</span>
            <h3 className="fw-bold text-dark mb-1">{activeTest?.title || "Assessment Result"}</h3>
            <p className="text-secondary small mb-4">
              Your test has been evaluated securely by the backend and saved to your profile.
            </p>

            <div className="p-4 bg-light rounded-4 max-w-md mx-auto mb-4 border border-secondary border-opacity-10">
              <div className="extra-small text-secondary fw-semibold text-uppercase">Your Final Score</div>
              <div className="fw-extrabold text-primary display-4 my-1">{testResult.percentage}%</div>
              <div className="fw-semibold text-dark small">
                {testResult.score} / {testResult.totalQuestions} Questions Correct
              </div>
            </div>

            {testResult.skillScores && Object.keys(testResult.skillScores).length > 0 && (
              <div className="mb-4 text-start max-w-md mx-auto">
                <h6 className="fw-bold text-dark mb-2">Skill Breakdown:</h6>
                <div className="d-flex flex-column gap-2">
                  {Object.entries(testResult.skillScores).map(([sk, pct]) => (
                    <div key={sk} className="d-flex justify-content-between align-items-center p-2 bg-white rounded border extra-small">
                      <span className="fw-semibold text-dark">{sk}</span>
                      <span className="badge badge-clean-blue">{pct}% Score</span>
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
                    <div className="p-4 bg-light rounded-4 mb-4 border border-secondary border-opacity-10">
                      <h5 className="fw-bold text-dark mb-4">
                        {currentQuestionIndex + 1}. {q.question}
                      </h5>

                      <div className="d-flex flex-column gap-2.5">
                        {q.options?.map((opt, idx) => {
                          const isSelected = selectedOpt === opt;
                          return (
                            <div
                              key={idx}
                              onClick={() => handleOptionSelect(qId, opt)}
                              className={`p-3 rounded-3 border transition d-flex align-items-center gap-3 ${
                                isSelected ? "bg-primary bg-opacity-10 border-primary fw-bold" : "bg-white border-subtle hover-bg-light"
                              }`}
                              style={{ cursor: "pointer" }}
                            >
                              <div
                                className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${
                                  isSelected ? "bg-primary text-white" : "border text-secondary"
                                }`}
                                style={{ width: "24px", height: "24px", fontSize: "12px" }}
                              >
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="text-dark small">{opt}</span>
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
            <div className="clean-card p-4 mb-4 text-center">
              <span className="badge badge-clean-blue mb-2">Technical & Career Assessments</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Pathfinder AI Skill Evaluation
              </h2>
              <p className="text-secondary small mx-auto mb-0" style={{ maxWidth: "680px" }}>
                Take domain & career-specific assessments. Questions are fetched from the MongoDB Question Bank and evaluated securely on the backend.
              </p>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="clean-card p-3 mb-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
                {/* Category Pills */}
                <div className="d-flex flex-nowrap overflow-auto w-100 gap-1.5 pb-1" style={{ WebkitOverflowScrolling: "touch" }}>
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
                    <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="badge badge-clean-blue extra-small">{asm.category}</span>
                          <span className="extra-small text-muted">{asm.durationMinutes || 15} mins</span>
                        </div>

                        <h5 className="fw-bold text-dark mb-2">{asm.title}</h5>
                        <p className="text-secondary extra-small mb-3">{asm.description || "Skill evaluation assessment."}</p>

                        <div className="d-flex flex-wrap gap-1 mb-3">
                          {asm.topics?.map((tp) => (
                            <span key={tp} className="badge bg-light text-dark border extra-small">
                              {tp}
                            </span>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => startAssessment(asm)}
                        className="btn btn-primary-clean btn-sm w-100 fw-bold mt-2"
                      >
                        ⚡ Start Assessment
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
