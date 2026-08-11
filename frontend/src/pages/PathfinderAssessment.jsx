import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function PathfinderAssessment() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const [assessment, setAssessment] = useState({
    // Programming & Technical Skills (1 to 5)
    python: 4.0,
    java: 3.0,
    sql: 4.0,
    cpp: 2.5,
    dsa: 3.5,
    problem_solving: 4.0,
    communication: 4.0,
    creativity: 3.5,
    mathematics: 3.5,

    // Domain Interests (1 to 5)
    web_dev: 4.0,
    ai_data: 4.5,
    cybersecurity: 3.0,
    networking: 2.5,
    databases: 4.0,

    // Holland RIASEC Interests (1 to 5)
    realistic: 3.0,
    investigative: 4.5,
    artistic: 3.0,
    social: 3.5,
    enterprising: 3.5,
    conventional: 3.5,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleSliderChange = (field, val) => {
    setAssessment((prev) => ({
      ...prev,
      [field]: parseFloat(val),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Build skill list based on ratings
      const updatedSkills = [];
      if (assessment.python >= 3.0) updatedSkills.push("Python");
      if (assessment.java >= 3.0) updatedSkills.push("Java");
      if (assessment.sql >= 3.0) updatedSkills.push("SQL");
      if (assessment.cpp >= 3.0) updatedSkills.push("C++");
      if (assessment.dsa >= 3.0) updatedSkills.push("Data Structures");
      if (assessment.web_dev >= 3.5) updatedSkills.push("React", "JavaScript", "Node.js");
      if (assessment.ai_data >= 3.5) updatedSkills.push("Machine Learning", "Pandas", "Statistics");
      if (assessment.cybersecurity >= 3.5) updatedSkills.push("Cybersecurity", "Network Security");
      if (assessment.databases >= 3.5) updatedSkills.push("Database Design", "PostgreSQL");

      // Save assessment vector to local storage and profile backend
      localStorage.setItem("pf_assessment", JSON.stringify(assessment));

      await api.put("/auth/profile", {
        skills: updatedSkills,
        assessment,
      });

      // Award XP & record activity completion for assessment
      await api.post("/activity/complete", {
        activityId: "act_career_assessment",
        activityType: "ASSESSMENT_COMPLETED",
        title: "Pathfinder Career Assessment",
        xpEarned: 150,
      });

      // Submit prediction call to ML engine
      await api.post("/ml/predict", { assessment, skills: updatedSkills });

      setSubmitted(true);
      setTimeout(() => {
        navigate("/career-pathfinder");
      }, 1500);
    } catch (err) {
      console.error("Assessment submit error:", err);
      // Fallback redirect
      localStorage.setItem("pf_assessment", JSON.stringify(assessment));
      setSubmitted(true);
      setTimeout(() => {
        navigate("/career-pathfinder");
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(135deg, #f0f4f9 0%, #e0e7ff 50%, #e0f2fe 100%)", minHeight: "100vh" }}>
      <Navbar user={user} />

      <div className="container py-5" style={{ maxWidth: "900px" }}>
        <div className="glass-panel p-4 p-md-5 bg-white rounded-5 border border-primary border-opacity-15 shadow-sm text-center mb-4">
          <img
            src="/assessment_3d.png"
            alt="O*NET Diagnostic Assessment"
            className="img-fluid rounded-4 mb-3 animate-float"
            style={{ maxHeight: "160px", objectFit: "contain" }}
          />
          <span className="badge neon-badge px-3 py-1.5 rounded-pill mb-2">O*NET Machine Learning Profiler</span>
          <h2 className="fw-extrabold text-dark mb-1">Student Skill & Interest Assessment 🎯</h2>
          <p className="text-secondary small mb-0">
            Rate your technical competencies, domain interests, and work preferences to calculate your real-time Random Forest ML match scores.
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="glass-panel p-3 bg-white rounded-4 border border-primary border-opacity-15 shadow-sm mb-4">
          <div className="d-flex justify-content-between align-items-center extra-small fw-bold mb-2">
            <span className={step >= 1 ? "text-primary" : "text-muted"}>1. Technical & Core Skills</span>
            <span className={step >= 2 ? "text-primary" : "text-muted"}>2. Technology Domain Interests</span>
            <span className={step >= 3 ? "text-primary" : "text-muted"}>3. Work Style & Personality</span>
          </div>
          <div className="progress rounded-pill bg-light" style={{ height: "8px" }}>
            <div
              className="progress-bar bg-primary rounded-pill transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {submitted && (
          <div className="alert alert-success rounded-4 text-center py-3 mb-4 fw-bold border-0 bg-success bg-opacity-15 text-success">
            🎉 Assessment Submitted Successfully! Running O*NET ML Random Forest Model inference...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: TECHNICAL SKILLS */}
          {step === 1 && (
            <div className="glass-panel p-4 p-md-5 bg-white rounded-5 border border-primary border-opacity-15 shadow-sm">
              <h5 className="fw-extrabold text-dark mb-4 d-flex align-items-center gap-2">
                <span>💻</span> Step 1: Technical & Core Skill Levels (1 to 5)
              </h5>

              <div className="row g-4">
                {[
                  { key: "python", label: "Python Programming", desc: "Data manipulation, scripting, ML frameworks" },
                  { key: "java", label: "Java / OOP", desc: "Object-oriented programming, enterprise apps" },
                  { key: "sql", label: "SQL & Databases", desc: "Queries, relational schemas, indexing" },
                  { key: "cpp", label: "C++ / Systems", desc: "Pointers, memory management, algorithms" },
                  { key: "dsa", label: "Data Structures & Algorithms", desc: "Trees, graphs, dynamic programming" },
                  { key: "problem_solving", label: "Problem Solving", desc: "Analytical thinking, debugging logic" },
                  { key: "mathematics", label: "Mathematics & Statistics", desc: "Linear algebra, calculus, probability" },
                  { key: "communication", label: "Technical Communication", desc: "Documentation, team collaboration" },
                ].map((item) => (
                  <div className="col-12 col-md-6" key={item.key}>
                    <div className="p-3 bg-light rounded-4 border border-secondary border-opacity-15">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="fw-bold text-dark small">{item.label}</label>
                        <span className="badge bg-primary text-white font-monospace">{assessment[item.key]} / 5</span>
                      </div>
                      <div className="extra-small text-muted mb-2">{item.desc}</div>
                      <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={assessment[item.key]}
                        onChange={(e) => handleSliderChange(item.key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="button" onClick={() => setStep(2)} className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold">
                  Next: Domain Interests &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: DOMAIN INTERESTS */}
          {step === 2 && (
            <div className="glass-panel p-4 p-md-5 bg-white rounded-5 border border-primary border-opacity-15 shadow-sm">
              <h5 className="fw-extrabold text-dark mb-4 d-flex align-items-center gap-2">
                <span>🌐</span> Step 2: Technology Domain Interests (1 to 5)
              </h5>

              <div className="row g-4">
                {[
                  { key: "web_dev", label: "Web Development", desc: "Frontend React, HTML/CSS, Node.js backend" },
                  { key: "ai_data", label: "AI & Data Science", desc: "Machine learning models, analytics, data pipelines" },
                  { key: "cybersecurity", label: "Cybersecurity & InfoSec", desc: "Network security, vulnerability testing, cryptography" },
                  { key: "networking", label: "Computer Networking", desc: "LAN/WAN, cloud architecture, routers & protocols" },
                  { key: "databases", label: "Database Architecture", desc: "Big Data, SQL, NoSQL, data warehousing" },
                ].map((item) => (
                  <div className="col-12 col-md-6" key={item.key}>
                    <div className="p-3 bg-light rounded-4 border border-secondary border-opacity-15">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="fw-bold text-dark small">{item.label}</label>
                        <span className="badge bg-primary text-white font-monospace">{assessment[item.key]} / 5</span>
                      </div>
                      <div className="extra-small text-muted mb-2">{item.desc}</div>
                      <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={assessment[item.key]}
                        onChange={(e) => handleSliderChange(item.key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between mt-4">
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-bold">
                  &larr; Back
                </button>
                <button type="button" onClick={() => setStep(3)} className="btn btn-primary px-4 py-2.5 rounded-3 fw-bold">
                  Next: Work Preferences &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: HOLLAND RIASEC & SUBMIT */}
          {step === 3 && (
            <div className="glass-panel p-4 p-md-5 bg-white rounded-5 border border-primary border-opacity-15 shadow-sm">
              <h5 className="fw-extrabold text-dark mb-4 d-flex align-items-center gap-2">
                <span>🧠</span> Step 3: Work Style & Holland RIASEC Traits (1 to 5)
              </h5>

              <div className="row g-4 mb-4">
                {[
                  { key: "investigative", label: "Investigative (Research & Problem Solving)", desc: "Analyzing data, solving complex technical puzzles" },
                  { key: "realistic", label: "Realistic (Hands-On Technical Work)", desc: "Building, configuring servers & hardware systems" },
                  { key: "artistic", label: "Artistic (Design & Innovation)", desc: "UI design, creative coding, product innovation" },
                  { key: "social", label: "Social (Mentorship & Collaboration)", desc: "Helping users, teaching tech, teamwork" },
                  { key: "enterprising", label: "Enterprising (Leadership & Project Management)", desc: "Leading tech teams, managing products & deadlines" },
                  { key: "conventional", label: "Conventional (Structured & Detail-Oriented)", desc: "Database administration, compliance, process tracking" },
                ].map((item) => (
                  <div className="col-12 col-md-6" key={item.key}>
                    <div className="p-3 bg-light rounded-4 border border-secondary border-opacity-15">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <label className="fw-bold text-dark small">{item.label}</label>
                        <span className="badge bg-primary text-white font-monospace">{assessment[item.key]} / 5</span>
                      </div>
                      <div className="extra-small text-muted mb-2">{item.desc}</div>
                      <input
                        type="range"
                        className="form-range"
                        min="1"
                        max="5"
                        step="0.5"
                        value={assessment[item.key]}
                        onChange={(e) => handleSliderChange(item.key, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-between">
                <button type="button" onClick={() => setStep(2)} className="btn btn-outline-secondary px-4 py-2.5 rounded-3 fw-bold">
                  &larr; Back
                </button>
                <button type="submit" className="btn btn-cyber px-5 py-3 fw-bold fs-6 rounded-3" disabled={loading}>
                  {loading ? "Running ML Model Inference..." : "⚡ Run O*NET ML Career Match"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default PathfinderAssessment;
