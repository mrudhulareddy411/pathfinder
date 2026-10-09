import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("questions"); // "questions" | "assessments"

  // Question State
  const [questions, setQuestions] = useState([]);
  const [qSearch, setQSearch] = useState("");
  const [qCategoryFilter, setQCategoryFilter] = useState("");
  const [loadingQ, setLoadingQ] = useState(true);
  const [editingQId, setEditingQId] = useState(null);
  const [qStatusMsg, setQStatusMsg] = useState("");

  const [qForm, setQForm] = useState({
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    category: "Programming",
    topic: "General",
    difficulty: "Medium",
    skills: "",
    careerPaths: "",
  });

  // Assessment State
  const [assessments, setAssessments] = useState([]);
  const [loadingAsm, setLoadingAsm] = useState(false);
  const [asmForm, setAsmForm] = useState({
    title: "",
    description: "",
    category: "Software Developer",
    durationMinutes: 15,
    difficulty: "Medium",
    topics: "",
    questionIds: [],
  });

  useEffect(() => {
    fetchMe();
    fetchQuestions();
    fetchAssessments();
  }, []);

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoadingQ(true);
      const res = await api.get("/questions");
      if (res.data && res.data.questions) {
        setQuestions(res.data.questions);
      }
    } catch (err) {
      console.error("Fetch questions error:", err);
    } finally {
      setLoadingQ(false);
    }
  };

  const fetchAssessments = async () => {
    try {
      setLoadingAsm(true);
      const res = await api.get("/assessments");
      if (res.data && res.data.assessments) {
        setAssessments(res.data.assessments);
      }
    } catch (err) {
      console.error("Fetch assessments error:", err);
    } finally {
      setLoadingAsm(false);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    setQStatusMsg("");

    const options = [qForm.optionA, qForm.optionB, qForm.optionC, qForm.optionD].filter(Boolean);
    if (options.length < 2) {
      setQStatusMsg("Please provide at least Option A and Option B.");
      return;
    }
    if (!qForm.correctAnswer) {
      setQStatusMsg("Please select the correct answer.");
      return;
    }

    const payload = {
      question: qForm.question,
      options,
      correctAnswer: qForm.correctAnswer,
      category: qForm.category,
      topic: qForm.topic,
      difficulty: qForm.difficulty,
      skills: qForm.skills ? qForm.skills.split(",").map((s) => s.trim()) : [],
      careerPaths: qForm.careerPaths ? qForm.careerPaths.split(",").map((cp) => cp.trim()) : [],
    };

    try {
      if (editingQId) {
        await api.put(`/questions/${editingQId}`, payload);
        setQStatusMsg("Question updated successfully! ✓");
      } else {
        await api.post("/questions", payload);
        setQStatusMsg("Question added to Question Bank! ✓");
      }

      setQForm({
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        category: "Programming",
        topic: "General",
        difficulty: "Medium",
        skills: "",
        careerPaths: "",
      });
      setEditingQId(null);
      await fetchQuestions();
    } catch (err) {
      setQStatusMsg(err.response?.data?.message || "Failed to save question.");
    }
  };

  const handleEditQ = (q) => {
    setEditingQId(q._id);
    setQForm({
      question: q.question,
      optionA: q.options[0] || "",
      optionB: q.options[1] || "",
      optionC: q.options[2] || "",
      optionD: q.options[3] || "",
      correctAnswer: q.correctAnswer || "",
      category: q.category || "Programming",
      topic: q.topic || "General",
      difficulty: q.difficulty || "Medium",
      skills: (q.skills || []).join(", "),
      careerPaths: (q.careerPaths || []).join(", "),
    });
  };

  const handleDeleteQ = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    try {
      await api.delete(`/questions/${id}`);
      await fetchQuestions();
    } catch (err) {
      alert("Error deleting question.");
    }
  };

  const handleSaveAssessment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...asmForm,
        topics: asmForm.topics ? asmForm.topics.split(",").map((t) => t.trim()) : [],
      };
      await api.post("/assessments", payload);
      alert("Assessment created successfully!");
      setAsmForm({
        title: "",
        description: "",
        category: "Software Developer",
        durationMinutes: 15,
        difficulty: "Medium",
        topics: "",
        questionIds: [],
      });
      await fetchAssessments();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create assessment.");
    }
  };

  const filteredQ = questions.filter((q) => {
    const mCat = !qCategoryFilter || q.category?.toLowerCase().includes(qCategoryFilter.toLowerCase());
    const mSrch = !qSearch || q.question?.toLowerCase().includes(qSearch.toLowerCase()) || q.topic?.toLowerCase().includes(qSearch.toLowerCase());
    return mCat && mSrch;
  });

  return (
    <div className="dashboard-clean-bg min-vh-100 d-flex flex-column">
      <Navbar user={user} />
      <div className="container py-4 flex-grow-1" style={{ maxWidth: "1200px" }}>
        {/* Header */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Admin Dashboard</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Question Bank & Assessment Admin 🛠️
              </h2>
              <p className="text-secondary small mb-0">
                Manage questions, test categories, answer keys, and pre-built skill assessments.
              </p>
            </div>
            <div className="d-flex gap-2 bg-light p-1 rounded-3 border">
              <button
                onClick={() => setActiveTab("questions")}
                className={`btn btn-sm ${activeTab === "questions" ? "btn-white shadow-sm fw-bold text-dark" : "btn-light text-secondary border-0"}`}
              >
                Question Bank ({questions.length})
              </button>
              <button
                onClick={() => setActiveTab("assessments")}
                className={`btn btn-sm ${activeTab === "assessments" ? "btn-white shadow-sm fw-bold text-dark" : "btn-light text-secondary border-0"}`}
              >
                Assessment Manager ({assessments.length})
              </button>
            </div>
          </div>
        </div>

        {/* TAB 1: QUESTION BANK MANAGER */}
        {activeTab === "questions" && (
          <div className="row g-4">
            {/* Left: Add/Edit Question Form */}
            <div className="col-12 col-lg-5">
              <div className="clean-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-4">
                  {editingQId ? "✏️ Edit Question" : "➕ Add Question"}
                </h5>

                {qStatusMsg && <div className="alert alert-info py-2 small rounded mb-3">{qStatusMsg}</div>}

                <form onSubmit={handleSaveQuestion}>
                  <div className="mb-3">
                    <label className="form-label extra-small text-secondary fw-semibold">Question Text *</label>
                    <textarea
                      rows="2"
                      className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                      placeholder="Enter question text..."
                      value={qForm.question}
                      onChange={(e) => setQForm({ ...qForm, question: e.target.value })}
                      required
                    />
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Option A *</label>
                      <input
                        type="text"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        value={qForm.optionA}
                        onChange={(e) => setQForm({ ...qForm, optionA: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Option B *</label>
                      <input
                        type="text"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        value={qForm.optionB}
                        onChange={(e) => setQForm({ ...qForm, optionB: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Option C</label>
                      <input
                        type="text"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        value={qForm.optionC}
                        onChange={(e) => setQForm({ ...qForm, optionC: e.target.value })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Option D</label>
                      <input
                        type="text"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        value={qForm.optionD}
                        onChange={(e) => setQForm({ ...qForm, optionD: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label extra-small text-secondary fw-semibold">Correct Answer *</label>
                    <select
                      className="form-select bg-light text-dark border-secondary border-opacity-25 extra-small"
                      value={qForm.correctAnswer}
                      onChange={(e) => setQForm({ ...qForm, correctAnswer: e.target.value })}
                      required
                    >
                      <option value="">-- Select Correct Option --</option>
                      {qForm.optionA && <option value={qForm.optionA}>A: {qForm.optionA}</option>}
                      {qForm.optionB && <option value={qForm.optionB}>B: {qForm.optionB}</option>}
                      {qForm.optionC && <option value={qForm.optionC}>C: {qForm.optionC}</option>}
                      {qForm.optionD && <option value={qForm.optionD}>D: {qForm.optionD}</option>}
                    </select>
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Category *</label>
                      <input
                        type="text"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        placeholder="e.g. Programming, DSA, SQL"
                        value={qForm.category}
                        onChange={(e) => setQForm({ ...qForm, category: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Topic *</label>
                      <input
                        type="text"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        placeholder="e.g. Stack, OOP, React"
                        value={qForm.topic}
                        onChange={(e) => setQForm({ ...qForm, topic: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Difficulty</label>
                      <select
                        className="form-select bg-light text-dark border-secondary border-opacity-25 extra-small"
                        value={qForm.difficulty}
                        onChange={(e) => setQForm({ ...qForm, difficulty: e.target.value })}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Skills (comma-separated)</label>
                      <input
                        type="text"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        placeholder="DSA, Problem Solving"
                        value={qForm.skills}
                        onChange={(e) => setQForm({ ...qForm, skills: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary-clean w-100 fw-bold py-2 small">
                      {editingQId ? "Save Changes" : "Create Question"}
                    </button>
                    {editingQId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQId(null);
                          setQForm({
                            question: "",
                            optionA: "",
                            optionB: "",
                            optionC: "",
                            optionD: "",
                            correctAnswer: "",
                            category: "Programming",
                            topic: "General",
                            difficulty: "Medium",
                            skills: "",
                            careerPaths: "",
                          });
                        }}
                        className="btn btn-outline-clean small"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Question List */}
            <div className="col-12 col-lg-7">
              <div className="clean-card p-4 h-100">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="fw-bold text-dark mb-0">Question Bank ({filteredQ.length})</h5>
                  <input
                    type="text"
                    className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                    style={{ maxWidth: "200px" }}
                    placeholder="Search questions..."
                    value={qSearch}
                    onChange={(e) => setQSearch(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-column gap-3 overflow-auto pe-2" style={{ maxHeight: "650px" }}>
                  {filteredQ.map((q) => (
                    <div key={q._id} className="p-3 bg-light rounded-3 border border-secondary border-opacity-10">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge badge-clean-blue extra-small">
                          {q.category} • {q.topic}
                        </span>
                        <span className="badge badge-clean-amber extra-small">{q.difficulty}</span>
                      </div>

                      <div className="fw-bold text-dark small mb-2">{q.question}</div>

                      <div className="row g-2 mb-3 extra-small text-secondary">
                        {q.options?.map((opt, i) => (
                          <div key={i} className={`col-6 ${opt === q.correctAnswer ? "text-success fw-bold" : ""}`}>
                            {String.fromCharCode(65 + i)}: {opt} {opt === q.correctAnswer ? "✓" : ""}
                          </div>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-10">
                        <span className="extra-small text-success fw-semibold">✓ Answer: {q.correctAnswer}</span>
                        <div className="d-flex gap-2">
                          <button onClick={() => handleEditQ(q)} className="btn btn-outline-clean btn-sm extra-small py-1">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteQ(q._id)} className="btn btn-outline-danger btn-sm extra-small py-1">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredQ.length === 0 && (
                     <div className="text-center text-muted p-4 small">No questions found matching your criteria.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ASSESSMENT MANAGER */}
        {activeTab === "assessments" && (
          <div className="row g-4">
            <div className="col-12 col-lg-5">
              <div className="clean-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-4">➕ Create Assessment</h5>
                <form onSubmit={handleSaveAssessment}>
                  <div className="mb-3">
                    <label className="form-label extra-small text-secondary fw-semibold">Assessment Title *</label>
                    <input
                      type="text"
                      className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                      placeholder="e.g. Frontend Developer Skill Assessment"
                      value={asmForm.title}
                      onChange={(e) => setAsmForm({ ...asmForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label extra-small text-secondary fw-semibold">Category / Role Target *</label>
                    <input
                      type="text"
                      className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                      placeholder="Software Developer, Data Scientist, etc."
                      value={asmForm.category}
                      onChange={(e) => setAsmForm({ ...asmForm, category: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label extra-small text-secondary fw-semibold">Description</label>
                    <textarea
                      rows="2"
                      className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                      placeholder="Brief evaluation overview..."
                      value={asmForm.description}
                      onChange={(e) => setAsmForm({ ...asmForm, description: e.target.value })}
                    />
                  </div>

                  <div className="row g-2 mb-4">
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Duration (Mins)</label>
                      <input
                        type="number"
                        className="form-control bg-light text-dark border-secondary border-opacity-25 extra-small"
                        value={asmForm.durationMinutes}
                        onChange={(e) => setAsmForm({ ...asmForm, durationMinutes: Number(e.target.value) })}
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label extra-small text-secondary fw-semibold">Difficulty</label>
                      <select
                        className="form-select bg-light text-dark border-secondary border-opacity-25 extra-small"
                        value={asmForm.difficulty}
                        onChange={(e) => setAsmForm({ ...asmForm, difficulty: e.target.value })}
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary-clean w-100 fw-bold py-2 small">
                    Create Assessment
                  </button>
                </form>
              </div>
            </div>

            <div className="col-12 col-lg-7">
              <div className="clean-card p-4 h-100">
                <h5 className="fw-bold text-dark mb-4">Active Assessment Bank ({assessments.length})</h5>
                <div className="d-flex flex-column gap-3 overflow-auto pe-2" style={{ maxHeight: "650px" }}>
                  {assessments.map((a) => (
                    <div key={a._id || a.id} className="p-3 bg-light rounded-3 border border-secondary border-opacity-10">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge badge-clean-blue extra-small">{a.category}</span>
                        <span className="extra-small text-muted fw-semibold">{a.durationMinutes || 15} Mins</span>
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{a.title}</h6>
                      <p className="small text-secondary mb-0" style={{ lineHeight: "1.5" }}>{a.description}</p>
                    </div>
                  ))}
                  {assessments.length === 0 && (
                     <div className="text-center text-muted p-4 small">No assessments found.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
