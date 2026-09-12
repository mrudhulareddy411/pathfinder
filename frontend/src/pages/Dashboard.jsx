import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const defaultFallbackUser = {
  fullName: "Kondreddy Mrudhula",
  educationLevel: "B.Tech",
  college: "Saveetha Institute of Medical & Technical Sciences",
  branch: "Computer Science & Engineering",
  levelNumber: 1,
  xp: 150,
  currentStreak: 1,
  longestStreak: 1,
  skills: ["Python", "Java", "SQL", "React", "Data Structures"],
  jobReadiness: {
    hasEnoughData: true,
    score: 85,
    readinessTier: "Beginner",
    targetCareerTitle: "Software Developer",
  }
};

const defaultFallbackRecommendations = [
  {
    careerId: "rec_1",
    title: "Software Developer",
    matchPercentage: 92,
    onetCode: "15-1252.00",
    description: "Develop, test, and deploy web applications, microservices, and software systems.",
    whyMatches: "Your current skills in Python, Java, SQL and Data Structures align strongly with this career.",
    matchingSkills: ["Python", "Java", "SQL", "Data Structures"],
    missingSkills: ["React", "Git", "REST APIs"],
    entryRoles: ["Junior Web Developer", "Associate Software Engineer", "Backend Developer"]
  },
  {
    careerId: "rec_2",
    title: "Machine Learning Engineer",
    matchPercentage: 86,
    onetCode: "15-1253.00",
    description: "Design automated prediction models, data pipelines, and intelligent algorithms.",
    whyMatches: "Strong foundation in Python and data structure fundamentals fits machine learning tasks.",
    matchingSkills: ["Python", "SQL", "Data Structures"],
    missingSkills: ["PyTorch", "FastAPI", "Pandas", "Scikit-Learn"],
    entryRoles: ["ML Associate", "Data Science Developer", "AI Engineer Assistant"]
  },
  {
    careerId: "rec_3",
    title: "Data Engineer",
    matchPercentage: 78,
    onetCode: "15-1243.00",
    description: "Architect scalable database schemas, high-performance data pipelines, and cloud warehouses.",
    whyMatches: "Solid SQL experience and structured query logic provide a direct entry into data engineering.",
    matchingSkills: ["SQL", "Java", "Python"],
    missingSkills: ["ETL Pipelines", "Docker", "PostgreSQL", "Apache Spark"],
    entryRoles: ["Data Pipeline Junior", "Database Administrator Associate", "ETL Specialist"]
  }
];

const fallbackSkillGap = {
  career: "Software Developer",
  overallMatch: 92,
  skills: [
    { skill: "Python", currentLevel: 85, requiredLevel: 70, status: "Strong" },
    { skill: "Java", currentLevel: 80, requiredLevel: 70, status: "Strong" },
    { skill: "SQL", currentLevel: 75, requiredLevel: 70, status: "Strong" },
    { skill: "Data Structures", currentLevel: 70, requiredLevel: 70, status: "Strong" },
    { skill: "React", currentLevel: 45, requiredLevel: 70, status: "Needs Improvement" },
    { skill: "Git", currentLevel: 40, requiredLevel: 70, status: "Needs Improvement" },
    { skill: "REST APIs", currentLevel: 30, requiredLevel: 70, status: "Missing" },
  ]
};

const defaultProjects = [
  {
    id: "proj_1",
    title: "Full Stack Job Portal",
    skills: ["React", "Node.js", "MongoDB", "REST API"],
    difficulty: "Intermediate",
    whyBuild: "Improves your portfolio for Software Developer roles by showing complete end-to-end web engineering."
  },
  {
    id: "proj_2",
    title: "Database Performance & Query Analyzer",
    skills: ["SQL", "Python", "PostgreSQL"],
    difficulty: "Intermediate",
    whyBuild: "Demonstrates practical database optimization and indexing capabilities."
  },
  {
    id: "proj_3",
    title: "AI Resume Matcher & Parser",
    skills: ["Python", "FastAPI", "NLP", "React"],
    difficulty: "Advanced",
    whyBuild: "Highlights applied software development integrated with modern intelligent services."
  }
];

function Dashboard() {
  const [user, setUser] = useState(defaultFallbackUser);
  const [recommendations, setRecommendations] = useState(defaultFallbackRecommendations);
  const [streakInfo, setStreakInfo] = useState({ currentStreak: 1, longestStreak: 1 });
  const [skillGap, setSkillGap] = useState(fallbackSkillGap);
  const [resumeData, setResumeData] = useState({ completion: 70, missing: ["Projects", "Internship experience", "Certifications"] });
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        try {
          const meRes = await api.get("/auth/me");
          if (meRes.data) {
            setUser((prev) => ({
              ...defaultFallbackUser,
              ...meRes.data,
              jobReadiness: {
                ...defaultFallbackUser.jobReadiness,
                ...(meRes.data.jobReadiness || {})
              }
            }));
          }
        } catch {
          console.warn("Using default student profile fallback.");
        }

        try {
          const perfRes = await api.get("/academic/performance");
          if (perfRes.data?.performance) {
            setPerformance(perfRes.data.performance);
          }
        } catch {
          console.warn("Academic performance endpoint unavailable.");
        }

        try {
          const recRes = await api.get("/recommendations");
          if (recRes.data?.recommendations && recRes.data.recommendations.length > 0) {
            setRecommendations(recRes.data.recommendations);
          }
        } catch {
          console.warn("Using default career recommendations fallback.");
        }

        try {
          const streakRes = await api.get("/streak");
          if (streakRes.data) {
            setStreakInfo(streakRes.data);
          }
        } catch {
          console.warn("Using default streak fallback.");
        }

        try {
          const gapRes = await api.get("/skill-gap");
          if (gapRes.data && gapRes.data.skills) {
            setSkillGap(gapRes.data);
          }
        } catch {
          console.warn("Using default skill gap fallback.");
        }

        try {
          const resRes = await api.get("/resumes");
          if (resRes.data && Array.isArray(resRes.data) && resRes.data.length > 0) {
            setResumeData({
              completion: Math.min(100, 60 + resRes.data.length * 15),
              missing: ["Internship experience", "Certifications"]
            });
          }
        } catch {
          console.warn("Using default resume status fallback.");
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeUser = user || defaultFallbackUser;
  const targetCareerTitle = activeUser.selectedCareerDetails?.title || recommendations[0]?.title || "Software Developer";
  const topMatchScore = recommendations[0]?.matchPercentage || 92;
  const readinessScore = activeUser.jobReadiness?.score || 85;
  const readinessTier = activeUser.jobReadiness?.readinessTier || "Beginner";

  // Derive Skill lists
  const userSkillsList = activeUser.skills && activeUser.skills.length > 0 ? activeUser.skills : ["Python", "Java", "SQL"];
  const gapSkillsList = skillGap.skills || fallbackSkillGap.skills;
  
  const strongSkills = gapSkillsList.filter(s => s.status === "Strong" || s.currentLevel >= 70).map(s => s.skill);
  const improveSkills = gapSkillsList.filter(s => s.status === "Needs Improvement" || (s.currentLevel < 70 && s.currentLevel >= 40)).map(s => s.skill);
  const missingSkills = gapSkillsList.filter(s => s.status === "Missing" || s.currentLevel < 40).map(s => s.skill);

  const displayStrong = strongSkills.length > 0 ? strongSkills : ["Python", "Java", "SQL"];
  const displayImprove = improveSkills.length > 0 ? improveSkills : ["React", "Git", "REST APIs"];
  const displayRecommended = missingSkills.length > 0 ? missingSkills : ["Docker", "Cloud", "System Design"];

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={activeUser} />

      <div className="container py-4">
        {/* --------------------------------------------------
            1. HEADER SECTION
           -------------------------------------------------- */}
        <div className="clean-card p-4 p-md-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <div className="text-secondary extra-small fw-semibold text-uppercase tracking-wider mb-1">
                Student Career Command Center
              </div>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem", letterSpacing: "-0.02em" }}>
                Good day, {activeUser.fullName || "Student"}
              </h2>
              <p className="text-secondary small mb-0">
                {activeUser.educationLevel || "Degree"} {activeUser.branch || ""} {activeUser.college ? `• ${activeUser.college}` : ""}
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <Link to="/profile/edit" className="btn btn-outline-clean">
                ✏️ Edit Profile
              </Link>
              <Link to="/resumes" className="btn btn-primary-clean">
                📄 Build Resume
              </Link>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            ACADEMIC & ASSESSMENT SUMMARY WIDGET
           -------------------------------------------------- */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold text-dark mb-0">Academic & Assessment Performance</h5>
              <div className="text-secondary extra-small">Direct GPA record and real-time skill test performance</div>
            </div>
            <Link to="/assessment" className="btn btn-primary-clean btn-sm">
              ⚡ Take Assessment
            </Link>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Student GPA</div>
                <div className="fw-bold text-primary fs-5 mt-1">
                  {activeUser.cgpa || performance?.gpa || "Not provided"}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Average Assessment Score</div>
                <div className="fw-bold text-success fs-5 mt-1">
                  {performance?.averageScore || "No assessments yet"}
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Assessments Completed</div>
                <div className="fw-bold text-dark fs-5 mt-1">{performance?.assessmentsCompletedCount || 0}</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Strongest Skill</div>
                <div className="fw-bold text-dark fs-6 mt-1 text-truncate">
                  {performance?.topSkill || "No test data yet"}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Assessments list */}
          {performance?.recentAttempts && performance.recentAttempts.length > 0 && (
            <div className="pt-2 border-top">
              <div className="extra-small fw-bold text-secondary text-uppercase mb-2">Recent Test Attempts</div>
              <div className="d-flex flex-wrap gap-2">
                {performance.recentAttempts.slice(0, 3).map((att) => (
                  <div key={att.id} className="badge bg-light text-dark border p-2 text-start">
                    <span className="fw-bold">{att.title}:</span>{" "}
                    <span className="text-primary fw-bold">{att.percentage}%</span> ({att.score}/{att.totalQuestions})
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="clean-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-dark mb-0">Career Overview</h5>
            <span className="badge badge-clean-blue">Target Role</span>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Target Career</div>
                <div className="fw-bold text-dark fs-6 mt-1">{targetCareerTitle}</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Career Match</div>
                <div className="fw-bold text-primary fs-5 mt-1">{topMatchScore}%</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Job Readiness</div>
                <div className="fw-bold text-success fs-5 mt-1">{readinessScore}%</div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <div className="p-3 clean-card-flat">
                <div className="text-secondary extra-small fw-medium">Experience Level</div>
                <div className="fw-bold text-dark fs-6 mt-1">{readinessTier}</div>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-3 bg-light border border-light-subtle">
            <p className="small text-dark mb-0">
              💡 <strong>Career Insight:</strong> You're on track for a <strong>{targetCareerTitle}</strong> career. Focus on strengthening <strong>{displayImprove.slice(0, 3).join(", ")}</strong> to improve your overall placement readiness.
            </p>
          </div>
        </div>

        {/* --------------------------------------------------
            3. CAREER RECOMMENDATIONS SECTION
           -------------------------------------------------- */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold text-dark mb-0">Recommended Career Paths</h5>
              <div className="text-secondary extra-small mt-0.5">Top occupation matches based on your academic & skill profile</div>
            </div>
            <Link to="/career-pathfinder" className="btn btn-outline-clean btn-sm">
              Explore All Paths &rarr;
            </Link>
          </div>

          <div className="row g-3">
            {recommendations.slice(0, 3).map((rec, idx) => {
              const matches = rec.matchingSkills || displayStrong;
              const needs = rec.missingSkills || displayImprove;
              const roles = rec.entryRoles || ["Associate Engineer", "Junior Developer"];
              const pathCode = rec.onetCode || rec.careerId || rec.title;

              return (
                <div className="col-12 col-lg-4" key={rec.careerId || idx}>
                  <div className="p-3.5 clean-card-flat h-100 d-flex flex-column justify-content-between">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-bold text-dark fs-6">{rec.title}</span>
                        <span className="badge badge-clean-green">{rec.matchPercentage}% Match</span>
                      </div>

                      <p className="extra-small text-secondary mb-3" style={{ minHeight: "36px" }}>
                        {rec.description}
                      </p>

                      {/* Why it matches */}
                      <div className="mb-3 p-2.5 rounded-2 bg-light extra-small">
                        <div className="fw-bold text-dark mb-1">Why it matches:</div>
                        <div className="text-secondary">{rec.whyMatches || `Your skills in ${matches.slice(0, 3).join(", ")} match this occupation.`}</div>
                      </div>

                      {/* Strengths */}
                      <div className="mb-2">
                        <div className="extra-small fw-semibold text-success mb-1">Your Strengths:</div>
                        <div className="d-flex flex-wrap gap-1">
                          {matches.slice(0, 4).map((s, i) => (
                            <span key={i} className="badge badge-clean-green extra-small py-0.5 px-2">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Skills to develop */}
                      <div className="mb-3">
                        <div className="extra-small fw-semibold text-amber mb-1" style={{ color: "#D97706" }}>Skills to Develop:</div>
                        <div className="d-flex flex-wrap gap-1">
                          {needs.slice(0, 4).map((s, i) => (
                            <span key={i} className="badge badge-clean-amber extra-small py-0.5 px-2">{s}</span>
                          ))}
                        </div>
                      </div>

                      {/* Entry roles */}
                      <div className="mb-3 extra-small">
                        <span className="fw-semibold text-secondary">Target Roles: </span>
                        <span className="text-dark">{roles.join(" • ")}</span>
                      </div>
                    </div>

                    <Link to={`/career/details/${encodeURIComponent(pathCode)}`} className="btn btn-outline-clean btn-sm w-100 text-center justify-content-center">
                      View Career Path &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --------------------------------------------------
            4. CAREER ROADMAP SECTION
           -------------------------------------------------- */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h5 className="fw-bold text-dark mb-0">Your Career Roadmap</h5>
              <div className="text-secondary extra-small mt-0.5">Sequential milestones to achieve placement readiness</div>
            </div>
            <Link to="/career-pathfinder" className="btn btn-outline-clean btn-sm">
              View Detailed Roadmap
            </Link>
          </div>

          <div className="row g-3 position-relative">
            {/* Step 1 */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <div className="p-3 clean-card-flat h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge badge-clean-blue mb-2">1. Current Level</span>
                  <div className="fw-bold text-dark small">Computer Science Student</div>
                  <div className="extra-small text-secondary mt-1">Foundational Studies</div>
                </div>
                <Link to="/academics" className="btn btn-outline-clean btn-sm mt-3 extra-small py-1 px-2">
                  Academics
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <div className="p-3 clean-card-flat h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge badge-clean-blue mb-2">2. Skills to Build</span>
                  <div className="fw-bold text-dark small">{displayImprove.slice(0, 3).join(", ")}</div>
                  <div className="extra-small text-secondary mt-1">Skill Gap Closing</div>
                </div>
                <Link to="/skills" className="btn btn-outline-clean btn-sm mt-3 extra-small py-1 px-2">
                  Skills Gap
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <div className="p-3 clean-card-flat h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge badge-clean-blue mb-2">3. Projects</span>
                  <div className="fw-bold text-dark small">Full Stack & DB Projects</div>
                  <div className="extra-small text-secondary mt-1">Portfolio Building</div>
                </div>
                <Link to="/projects" className="btn btn-outline-clean btn-sm mt-3 extra-small py-1 px-2">
                  View Projects
                </Link>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <div className="p-3 clean-card-flat h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge badge-clean-blue mb-2">4. Resume</span>
                  <div className="fw-bold text-dark small">ATS-Friendly Resume</div>
                  <div className="extra-small text-secondary mt-1">Profile Auto-Import</div>
                </div>
                <Link to="/resumes" className="btn btn-outline-clean btn-sm mt-3 extra-small py-1 px-2">
                  Build Resume
                </Link>
              </div>
            </div>

            {/* Step 5 */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <div className="p-3 clean-card-flat h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="badge badge-clean-blue mb-2">5. Interview Prep</span>
                  <div className="fw-bold text-dark small">DSA & Tech Interviews</div>
                  <div className="extra-small text-secondary mt-1">Mock Challenges</div>
                </div>
                <Link to="/challenges" className="btn btn-outline-clean btn-sm mt-3 extra-small py-1 px-2">
                  Challenges
                </Link>
              </div>
            </div>

            {/* Step 6 */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-2">
              <div className="p-3 clean-card-flat h-100 d-flex flex-column justify-content-between border-primary border-opacity-25">
                <div>
                  <span className="badge badge-clean-green mb-2">6. Job Ready</span>
                  <div className="fw-bold text-dark small">Internships & Jobs</div>
                  <div className="extra-small text-secondary mt-1">Career Placement</div>
                </div>
                <Link to="/career-pathfinder" className="btn btn-primary-clean btn-sm mt-3 extra-small py-1 px-2">
                  Target Roles
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            5. SKILL DEVELOPMENT & 6. SKILL GAP SUMMARY (GRID)
           -------------------------------------------------- */}
        <div className="row g-4 mb-4">
          {/* Section 5: Your Skills Breakdown */}
          <div className="col-12 col-lg-6">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">Your Skills</h5>
                  <span className="badge badge-clean-blue">{userSkillsList.length} Verified</span>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-4">
                    <div className="p-3 clean-card-flat h-100">
                      <div className="fw-bold text-success small mb-2">Strong Skills</div>
                      <div className="d-flex flex-column gap-1.5">
                        {displayStrong.map((s, i) => (
                          <span key={i} className="extra-small text-dark fw-medium">✓ {s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 clean-card-flat h-100">
                      <div className="fw-bold text-amber small mb-2" style={{ color: "#D97706" }}>Skills to Improve</div>
                      <div className="d-flex flex-column gap-1.5">
                        {displayImprove.map((s, i) => (
                          <span key={i} className="extra-small text-dark fw-medium">⚡ {s}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="p-3 clean-card-flat h-100">
                      <div className="fw-bold text-primary small mb-2">Recommended</div>
                      <div className="d-flex flex-column gap-1.5">
                        {displayRecommended.map((s, i) => (
                          <span key={i} className="extra-small text-dark fw-medium">🎯 {s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-end">
                <Link to="/skills" className="btn btn-outline-clean btn-sm">
                  Update Skill Profile &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Section 6: Your Skill Gap Summary */}
          <div className="col-12 col-lg-6">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">Your Skill Gap</h5>
                    <div className="text-secondary extra-small">Skill level comparison for {targetCareerTitle}</div>
                  </div>
                  <span className="badge badge-clean-amber">Target Gap Analysis</span>
                </div>

                <div className="p-3 clean-card-flat mb-3">
                  <div className="row text-center extra-small fw-bold text-secondary pb-2 border-bottom">
                    <div className="col-5 text-start">Skill</div>
                    <div className="col-3">Proficiency</div>
                    <div className="col-4 text-end">Status</div>
                  </div>

                  <div className="d-flex flex-column gap-2 pt-2">
                    {gapSkillsList.slice(0, 5).map((item, idx) => {
                      const level = item.currentLevel || 50;
                      let badgeClass = "badge-clean-green";
                      let label = "✓ Strong";
                      if (level < 40 || item.status === "Missing") {
                        badgeClass = "badge-clean-amber";
                        label = "Missing";
                      } else if (level < 70 || item.status === "Needs Improvement") {
                        badgeClass = "badge-clean-gray";
                        label = "Needs Improvement";
                      }

                      return (
                        <div key={idx} className="row align-items-center extra-small">
                          <div className="col-5 text-start fw-semibold text-dark">{item.skill}</div>
                          <div className="col-3">
                            <div className="progress rounded-pill" style={{ height: "6px" }}>
                              <div className="progress-bar rounded-pill" style={{ width: `${level}%`, backgroundColor: level >= 70 ? "#16A34A" : level >= 40 ? "#F59E0B" : "#EF4444" }}></div>
                            </div>
                          </div>
                          <div className="col-4 text-end">
                            <span className={`badge ${badgeClass} extra-small`}>{label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="text-end">
                <Link to="/skills" className="btn btn-outline-clean btn-sm">
                  View Full Skill Gap &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            7. RECOMMENDED LEARNING PLAN & 8. PROJECT RECOMMENDATIONS
           -------------------------------------------------- */}
        <div className="row g-4 mb-4">
          {/* Section 7: Recommended Learning Plan */}
          <div className="col-12 col-lg-6">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">Recommended Learning Plan</h5>
                  <Link to="/resources" className="btn btn-outline-clean btn-sm">
                    Learning Hub
                  </Link>
                </div>

                <div className="d-flex flex-column gap-3">
                  <div className="p-3 clean-card-flat">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="fw-bold text-dark small">React</div>
                      <span className="badge badge-clean-blue">35% Progress</span>
                    </div>
                    <p className="extra-small text-secondary mb-2">Important for your target {targetCareerTitle} career.</p>
                    <div className="progress rounded-pill bg-white mb-2" style={{ height: "6px", border: "1px solid #E5E7EB" }}>
                      <div className="progress-bar bg-primary rounded-pill" style={{ width: "35%" }}></div>
                    </div>
                    <Link to="/resources?skill=React" className="btn btn-outline-clean btn-sm extra-small py-1">
                      Continue Learning
                    </Link>
                  </div>

                  <div className="p-3 clean-card-flat">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="fw-bold text-dark small">REST APIs & Backend Routing</div>
                      <span className="badge badge-clean-amber">0% Progress</span>
                    </div>
                    <p className="extra-small text-secondary mb-2">Essential for building client-server software architectures.</p>
                    <div className="progress rounded-pill bg-white mb-2" style={{ height: "6px", border: "1px solid #E5E7EB" }}>
                      <div className="progress-bar bg-warning rounded-pill" style={{ width: "10%" }}></div>
                    </div>
                    <Link to="/resources?skill=REST" className="btn btn-outline-clean btn-sm extra-small py-1">
                      Start Learning
                    </Link>
                  </div>

                  <div className="p-3 clean-card-flat">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <div className="fw-bold text-dark small">Git & Version Control</div>
                      <span className="badge badge-clean-green">60% Progress</span>
                    </div>
                    <p className="extra-small text-secondary mb-2">Required for team collaboration and repository management.</p>
                    <div className="progress rounded-pill bg-white mb-2" style={{ height: "6px", border: "1px solid #E5E7EB" }}>
                      <div className="progress-bar bg-success rounded-pill" style={{ width: "60%" }}></div>
                    </div>
                    <Link to="/resources?skill=Git" className="btn btn-outline-clean btn-sm extra-small py-1">
                      Continue Learning
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: Project Recommendations */}
          <div className="col-12 col-lg-6">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">Projects to Build</h5>
                  <Link to="/projects" className="btn btn-outline-clean btn-sm">
                    All Projects
                  </Link>
                </div>

                <div className="d-flex flex-column gap-3">
                  {defaultProjects.map((proj) => (
                    <div key={proj.id} className="p-3 clean-card-flat">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <div className="fw-bold text-dark small">{proj.title}</div>
                        <span className="badge badge-clean-gray">{proj.difficulty}</span>
                      </div>

                      <div className="extra-small text-secondary mb-2">
                        {proj.whyBuild}
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div className="d-flex flex-wrap gap-1">
                          {proj.skills.map((sk, i) => (
                            <span key={i} className="badge badge-clean-blue extra-small py-0.5 px-1.5">{sk}</span>
                          ))}
                        </div>
                        <Link to="/projects" className="btn btn-primary-clean btn-sm extra-small py-1 px-2">
                          View Project
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            9. RESUME STATUS & 10. JOB READINESS BREAKDOWN
           -------------------------------------------------- */}
        <div className="row g-4 mb-4">
          {/* Section 9: Resume Status */}
          <div className="col-12 col-lg-5">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold text-dark mb-0">Resume Status</h5>
                  <span className="badge badge-clean-blue">{resumeData.completion}% Complete</span>
                </div>

                <div className="p-3 clean-card-flat mb-3">
                  <div className="d-flex align-items-baseline gap-2 mb-2">
                    <h3 className="fw-bold text-dark mb-0">{resumeData.completion}%</h3>
                    <span className="text-secondary extra-small">Resume Readiness Score</span>
                  </div>
                  <div className="progress rounded-pill bg-white mb-3" style={{ height: "8px", border: "1px solid #E5E7EB" }}>
                    <div className="progress-bar bg-primary rounded-pill" style={{ width: `${resumeData.completion}%` }}></div>
                  </div>

                  <div className="extra-small fw-semibold text-dark mb-1">Missing Profile Elements:</div>
                  <ul className="extra-small text-secondary mb-0 ps-3">
                    {resumeData.missing.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link to="/resumes" className="btn btn-primary-clean w-100 text-center justify-content-center">
                Continue Resume Builder &rarr;
              </Link>
            </div>
          </div>

          {/* Section 10: Job Readiness Breakdown */}
          <div className="col-12 col-lg-7">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h5 className="fw-bold text-dark mb-0">Job Readiness</h5>
                    <div className="text-secondary extra-small">Overall readiness score across key placement dimensions</div>
                  </div>
                  <div className="d-flex align-items-baseline gap-1">
                    <span className="fw-bold text-primary fs-4">{readinessScore}</span>
                    <span className="text-secondary small">/ 100</span>
                  </div>
                </div>

                <div className="row g-3">
                  <div className="col-12 col-sm-6">
                    <div className="p-3 clean-card-flat">
                      <div className="d-flex justify-content-between text-extra-small mb-1">
                        <span className="fw-semibold text-dark">Technical Skills</span>
                        <span className="fw-bold text-primary">82%</span>
                      </div>
                      <div className="progress rounded-pill bg-white" style={{ height: "6px" }}>
                        <div className="progress-bar bg-primary rounded-pill" style={{ width: "82%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="p-3 clean-card-flat">
                      <div className="d-flex justify-content-between text-extra-small mb-1">
                        <span className="fw-semibold text-dark">Projects</span>
                        <span className="fw-bold text-primary">70%</span>
                      </div>
                      <div className="progress rounded-pill bg-white" style={{ height: "6px" }}>
                        <div className="progress-bar bg-primary rounded-pill" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="p-3 clean-card-flat">
                      <div className="d-flex justify-content-between text-extra-small mb-1">
                        <span className="fw-semibold text-dark">Resume</span>
                        <span className="fw-bold text-primary">65%</span>
                      </div>
                      <div className="progress rounded-pill bg-white" style={{ height: "6px" }}>
                        <div className="progress-bar bg-primary rounded-pill" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-sm-6">
                    <div className="p-3 clean-card-flat">
                      <div className="d-flex justify-content-between text-extra-small mb-1">
                        <span className="fw-semibold text-dark">Interview Readiness</span>
                        <span className="fw-bold text-primary">55%</span>
                      </div>
                      <div className="progress rounded-pill bg-white" style={{ height: "6px" }}>
                        <div className="progress-bar bg-primary rounded-pill" style={{ width: "55%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="p-3 clean-card-flat">
                      <div className="d-flex justify-content-between text-extra-small mb-1">
                        <span className="fw-semibold text-dark">Career Alignment ({targetCareerTitle})</span>
                        <span className="fw-bold text-success">92%</span>
                      </div>
                      <div className="progress rounded-pill bg-white" style={{ height: "6px" }}>
                        <div className="progress-bar bg-success rounded-pill" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------------------------
            11. NEXT STEPS & 12. RECENT ACTIVITY
           -------------------------------------------------- */}
        <div className="row g-4 mb-4">
          {/* Section 11: What You Should Do Next */}
          <div className="col-12 col-lg-7">
            <div className="clean-card p-4 h-100">
              <h5 className="fw-bold text-dark mb-3">What You Should Do Next</h5>
              
              <div className="d-flex flex-column gap-2.5">
                <div className="p-3 clean-card-flat d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold text-dark small">1. Complete Skill Gap Assessment</div>
                    <div className="extra-small text-secondary">Verify technical proficiency levels across your stack</div>
                  </div>
                  <Link to="/assessment" className="btn btn-primary-clean btn-sm extra-small py-1">
                    Take Assessment
                  </Link>
                </div>

                <div className="p-3 clean-card-flat d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold text-dark small">2. Learn React Fundamentals</div>
                    <div className="extra-small text-secondary">Fulfill essential frontend requirement for {targetCareerTitle}</div>
                  </div>
                  <Link to="/resources?skill=React" className="btn btn-outline-clean btn-sm extra-small py-1">
                    Start Learning
                  </Link>
                </div>

                <div className="p-3 clean-card-flat d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold text-dark small">3. Build Full Stack Project</div>
                    <div className="extra-small text-secondary">Demonstrate practical software engineering capabilities</div>
                  </div>
                  <Link to="/projects" className="btn btn-outline-clean btn-sm extra-small py-1">
                    Explore Projects
                  </Link>
                </div>

                <div className="p-3 clean-card-flat d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-semibold text-dark small">4. Complete Profile & Resume</div>
                    <div className="extra-small text-secondary">Auto-import education & skills into professional templates</div>
                  </div>
                  <Link to="/resumes" className="btn btn-outline-clean btn-sm extra-small py-1">
                    Update Resume
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Section 12: Recent Activity & 13. Progress (Gamification) */}
          <div className="col-12 col-lg-5">
            <div className="clean-card p-4 h-100 d-flex flex-column justify-content-between">
              <div>
                <h5 className="fw-bold text-dark mb-3">Recent Activity</h5>

                <div className="d-flex flex-column gap-2 mb-4 extra-small">
                  <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-light">
                    <span className="text-success fw-bold">✓</span>
                    <span className="text-dark fw-medium">Completed Career Assessment</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-light">
                    <span className="text-success fw-bold">✓</span>
                    <span className="text-dark fw-medium">Added Python & SQL skills to profile</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-light">
                    <span className="text-success fw-bold">✓</span>
                    <span className="text-dark fw-medium">Started React learning module</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 p-2 rounded-2 bg-light">
                    <span className="text-success fw-bold">✓</span>
                    <span className="text-dark fw-medium">Updated academic degree details</span>
                  </div>
                </div>

                {/* Section 13: Secondary Gamification / Progress */}
                <div className="p-3 clean-card-flat">
                  <div className="fw-semibold text-dark extra-small mb-2">Student Progress Summary</div>
                  <div className="d-flex justify-content-between align-items-center text-secondary extra-small">
                    <span>🔥 Daily Streak: <strong>{streakInfo.currentStreak || 1} Day(s)</strong></span>
                    <span>⭐ Progress: <strong>{activeUser.xp || 150} XP (Level {activeUser.levelNumber || 1})</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
