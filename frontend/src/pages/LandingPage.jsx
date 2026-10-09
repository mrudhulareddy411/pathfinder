import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Hero3DVisual from "../components/Hero3DVisual";
import Footer from "../components/Footer";
import { 
  BarChart, 
  Target, 
  Award, 
  BookOpen, 
  Cpu, 
  Map, 
  MessageSquare, 
  Briefcase, 
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Star,
  Users,
  Activity,
  Shield,
  Search
} from "lucide-react"; // Requires lucide-react, let's make sure to install it if not present, but for now fallback to string emojis if it fails. Actually the user said "Use a consistent professional icon library such as Lucide Icons." I will use lucide-react.

function LandingPage() {
  return (
    <div className="modern-saas-bg pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg px-4 py-3 sticky-top">
        <div className="container-fluid max-w-7xl mx-auto">
          <Link className="navbar-brand fw-extrabold text-white fs-4 d-flex align-items-center gap-2" to="/">
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cpu size={18} color="white" />
            </div>
            Pathfinder AI
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon" style={{ filter: "invert(1)" }}></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto gap-4 fw-medium" style={{ fontSize: "15px" }}>
              <li className="nav-item"><Link className="nav-link text-dark opacity-75 hover-opacity-100" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark opacity-75 hover-opacity-100" to="/career-pathfinder">Career Paths</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark opacity-75 hover-opacity-100" to="/skill-assessment">Skill Assessment</Link></li>
              <li className="nav-item"><Link className="nav-link text-dark opacity-75 hover-opacity-100" to="/learning">Learning</Link></li>
            </ul>
            <div className="d-flex gap-3 align-items-center">
              <Link to="/login" className="text-dark text-decoration-none fw-medium" style={{ fontSize: "15px" }}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary rounded-pill px-4 py-2 fw-semibold" style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)", border: "none", boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)" }}>
                Start Journey
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="position-relative pt-5 pb-5 overflow-hidden">
        <div className="container position-relative pt-5 pb-5" style={{ zIndex: 1, maxWidth: "1200px" }}>
          <div className="row align-items-center g-5">
            <div className="col-lg-6 pe-lg-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-4" style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid rgba(59, 130, 246, 0.2)", color: "#60a5fa", fontSize: "13px", fontWeight: "600" }}>
                  <Activity size={14} /> AI-Powered Career Intelligence
                </div>
                <h1 className="display-3 fw-bolder mb-4 text-dark" style={{ lineHeight: "1.1", letterSpacing: "-1.5px" }}>
                  Your Career. <br/>
                  <span style={{ background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Powered by AI.</span>
                </h1>
                <p className="fs-5 mb-5 text-muted" style={{ lineHeight: "1.6" }}>
                  Discover your strengths, build the right skills, track your progress, and get personalized career recommendations — all in one intelligent platform.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 py-3 fw-semibold d-flex align-items-center gap-2" style={{ background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)", border: "none", boxShadow: "0 8px 25px rgba(37, 99, 235, 0.3)" }}>
                    Start Your Career Journey <ArrowRight size={18} />
                  </Link>
                  <Link to="/career-pathfinder" className="btn btn-outline-primary btn-lg rounded-pill px-5 py-3 fw-semibold d-flex align-items-center gap-2">
                    Explore Career Paths <Search size={18} />
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="col-lg-6">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
                <div className="pf-card position-relative overflow-hidden p-0">
                  <div className="d-flex align-items-center px-4 py-3 bg-light border-bottom">
                    <div className="d-flex gap-2">
                      <div className="rounded-circle" style={{ width: "12px", height: "12px", background: "#ef4444" }}></div>
                      <div className="rounded-circle" style={{ width: "12px", height: "12px", background: "#f59e0b" }}></div>
                      <div className="rounded-circle" style={{ width: "12px", height: "12px", background: "#10b981" }}></div>
                    </div>
                  </div>
                  <div className="p-4 row g-4">
                    <div className="col-12">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="fw-semibold text-dark">Career Readiness Score</span>
                        <span className="fw-bold text-success">78%</span>
                      </div>
                      <div className="progress">
                        <div className="progress-bar bg-success" style={{ width: "78%" }}></div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light border">
                        <div className="d-flex align-items-center gap-2 mb-2"><Cpu size={16} color="#2563eb" /> <span className="text-muted fs-6">AI Recommendation</span></div>
                        <div className="fw-bold text-dark">Data Scientist</div>
                        <div className="text-success small mt-1 d-flex align-items-center gap-1"><TrendingUp size={12}/> 92% Match</div>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 rounded-3 bg-light border">
                        <div className="d-flex align-items-center gap-2 mb-2"><BookOpen size={16} color="#3b82f6" /> <span className="text-muted fs-6">Learning Progress</span></div>
                        <div className="fw-bold text-dark">Python Core</div>
                        <div className="text-primary small mt-1 d-flex align-items-center gap-1"><Activity size={12}/> Module 4/6</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Career Journey Platform Section */}
      <section className="py-5 position-relative w-100" style={{ boxSizing: "border-box" }}>
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="text-center mb-5">
            <h2 className="fw-bolder display-6 text-dark mb-2">Pathfinder AI — Complete Career Journey Platform</h2>
            <p className="text-muted fs-5">An end-to-end ecosystem that seamlessly guides you from student to professional.</p>
          </div>
          
          <div className="career-journey-grid">
            
            {/* Card 1 */}
            <div className="journey-card">
              <div className="journey-card-header">
                <div className="journey-card-icon"><Compass size={24} /></div>
                <h3 className="journey-card-title">Career Pathfinder</h3>
              </div>
              <div className="journey-card-content">
                <p className="journey-card-desc">
                  Explore suitable career paths based on your profile and skills. Our AI matchmaking engine finds your perfect role.
                </p>
                <div className="journey-card-footer">
                  <Link to="/career-pathfinder" className="btn btn-outline-primary w-100 fw-medium d-flex align-items-center justify-content-center gap-2">
                    View Career Paths <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="journey-card">
              <div className="journey-card-header">
                <div className="journey-card-icon"><Target size={24} /></div>
                <h3 className="journey-card-title">Skills Gap Analysis</h3>
              </div>
              <div className="journey-card-content">
                <p className="journey-card-desc">
                  Compare your current competencies against industry benchmarks to visualize exactly what you need to learn.
                </p>
                <div className="journey-card-footer">
                  <Link to="/skills" className="btn btn-outline-primary w-100 fw-medium d-flex align-items-center justify-content-center gap-2">
                    Analyze Skills <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="journey-card">
              <div className="journey-card-header">
                <div className="journey-card-icon"><BookOpen size={24} /></div>
                <h3 className="journey-card-title">Learning Resources</h3>
              </div>
              <div className="journey-card-content">
                <p className="journey-card-desc">
                  Access highly curated materials, documentation, and tutorials tailored to bridge your specific technical gaps.
                </p>
                <div className="journey-card-footer">
                  <Link to="/resources" className="btn btn-outline-primary w-100 fw-medium d-flex align-items-center justify-content-center gap-2">
                    Start Learning <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="journey-card">
              <div className="journey-card-header">
                <div className="journey-card-icon"><Activity size={24} /></div>
                <h3 className="journey-card-title">Assessments</h3>
              </div>
              <div className="journey-card-content">
                <p className="journey-card-desc">
                  Validate your proficiency with rigorous skill assessments and track your readiness score dynamically over time.
                </p>
                <div className="journey-card-footer">
                  <Link to="/assessment" className="btn btn-outline-primary w-100 fw-medium d-flex align-items-center justify-content-center gap-2">
                    Take Assessment <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="journey-card">
              <div className="journey-card-header">
                <div className="journey-card-icon"><Award size={24} /></div>
                <h3 className="journey-card-title">Academic Tracker</h3>
              </div>
              <div className="journey-card-content">
                <p className="journey-card-desc">
                  Log your semesters, grades, and subjects to ensure your academic foundation aligns with your career goals.
                </p>
                <div className="journey-card-footer">
                  <Link to="/academics" className="btn btn-outline-primary w-100 fw-medium d-flex align-items-center justify-content-center gap-2">
                    Track Academics <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Card 6 */}
            <div className="journey-card">
              <div className="journey-card-header">
                <div className="journey-card-icon"><Map size={24} /></div>
                <h3 className="journey-card-title">Roadmap & Progress</h3>
              </div>
              <div className="journey-card-content">
                <p className="journey-card-desc">
                  Follow a structured, step-by-step interactive map outlining every milestone required to become career-ready.
                </p>
                <div className="journey-card-footer">
                  <Link to="/roadmap" className="btn btn-outline-primary w-100 fw-medium d-flex align-items-center justify-content-center gap-2">
                    View Roadmap <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Career Intelligence Section */}
      <section className="py-5 bg-light border-top border-bottom">
        <div className="container" style={{ maxWidth: "1200px" }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6 mb-3 text-dark">Understand Where You Stand</h2>
            <p className="text-muted fs-5 mx-auto" style={{ maxWidth: "600px" }}>Real-time analytics on your skills, experience, and readiness.</p>
          </div>
          <div className="row g-4">
            {[
              { title: "Career Readiness", icon: <Target size={24} color="#3b82f6"/>, score: "78%", trend: "+12% this month", desc: "Based on current market demands." },
              { title: "Skill Strength", icon: <Cpu size={24} color="#8b5cf6"/>, score: "High", trend: "Top 15%", desc: "Compared to peers in your field." },
              { title: "Experience", icon: <Briefcase size={24} color="#10b981"/>, score: "2 Years", trend: "+3 Projects", desc: "Verified project completions." },
              { title: "Learning Progress", icon: <BookOpen size={24} color="#f59e0b"/>, score: "68%", trend: "On Track", desc: "Completion of target roadmap." }
            ].map((item, idx) => (
              <div className="col-md-6 col-lg-3" key={idx}>
                <div className="pf-card h-100">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div className="p-2 rounded-3 bg-light">{item.icon}</div>
                  </div>
                  <div className="text-muted mb-1 fs-6">{item.title}</div>
                  <div className="fs-3 fw-bold mb-2 text-dark">{item.score}</div>
                  <div className="d-flex align-items-center gap-2 mb-3 text-success small fw-medium">
                    <TrendingUp size={14} /> {item.trend}
                  </div>
                  <p className="text-muted small mb-0">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="py-5">
        <div className="container py-5" style={{ maxWidth: "1200px" }}>
          <div className="row mb-5 align-items-end">
            <div className="col-lg-6">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3" style={{ background: "rgba(37, 99, 235, 0.1)", border: "1px solid rgba(37, 99, 235, 0.2)", color: "#2563eb", fontSize: "13px", fontWeight: "600" }}>
                <Star size={14} /> Intelligent Matching
              </div>
              <h2 className="fw-bold display-6 mb-3 text-dark">Your AI Career Navigator</h2>
              <p className="text-muted fs-5 mb-0">Get personalized career recommendations based on your skills, interests, education, experience, and goals.</p>
            </div>
            <div className="col-lg-6 text-lg-end mt-4 mt-lg-0">
              <button className="btn btn-outline-primary rounded-pill px-4 py-2 fw-medium">View All Paths</button>
            </div>
          </div>
          <div className="row g-4">
            <div className="col-lg-4">
              <div className="pf-card position-relative overflow-hidden">
                <div className="d-flex justify-content-between align-items-start mb-4 position-relative">
                  <div className="p-3 rounded-3 bg-light text-primary"><Cpu size={24}/></div>
                  <span className="badge rounded-pill bg-success text-white">92% Match</span>
                </div>
                <h4 className="fw-bold text-dark mb-3 position-relative">AI Engineer</h4>
                <div className="d-flex flex-column gap-2 mb-4 position-relative">
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><CheckCircle size={14} className="me-2 text-success"/> Python</span> <span className="text-success">✓</span></div>
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><CheckCircle size={14} className="me-2 text-success"/> Machine Learning</span> <span className="text-success">✓</span></div>
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><Activity size={14} className="me-2 text-warning"/> Deep Learning</span> <span className="text-warning">65%</span></div>
                  <div className="mt-2 pt-2 border-top small">
                    <span className="text-muted d-block mb-1">Missing Skills:</span>
                    <span className="text-danger fw-medium">Advanced NLP, MLOps</span>
                  </div>
                </div>
                <button className="btn btn-primary w-100 rounded-pill py-2 fw-medium position-relative">View Roadmap</button>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="pf-card">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="p-3 rounded-3 bg-light text-primary"><BarChart size={24}/></div>
                  <span className="badge rounded-pill bg-success text-white">85% Match</span>
                </div>
                <h4 className="fw-bold text-dark mb-3">Data Scientist</h4>
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><CheckCircle size={14} className="me-2 text-success"/> SQL</span> <span className="text-success">✓</span></div>
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><CheckCircle size={14} className="me-2 text-success"/> Data Analysis</span> <span className="text-success">✓</span></div>
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><Activity size={14} className="me-2 text-warning"/> Statistics</span> <span className="text-warning">40%</span></div>
                  <div className="mt-2 pt-2 border-top small">
                    <span className="text-muted d-block mb-1">Missing Skills:</span>
                    <span className="text-danger fw-medium">Advanced Stats, Big Data</span>
                  </div>
                </div>
                <button className="btn btn-outline-primary w-100 rounded-pill py-2 fw-medium">View Roadmap</button>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="pf-card">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="p-3 rounded-3 bg-light text-primary"><Shield size={24}/></div>
                  <span className="badge rounded-pill bg-warning text-white">68% Match</span>
                </div>
                <h4 className="fw-bold text-dark mb-3">Cybersecurity Analyst</h4>
                <div className="d-flex flex-column gap-2 mb-4">
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><CheckCircle size={14} className="me-2 text-success"/> Networking</span> <span className="text-success">✓</span></div>
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><Activity size={14} className="me-2 text-warning"/> Security Protocols</span> <span className="text-warning">30%</span></div>
                  <div className="d-flex align-items-center justify-content-between small"><span className="text-muted"><Activity size={14} className="me-2 text-warning"/> Ethical Hacking</span> <span className="text-warning">10%</span></div>
                  <div className="mt-2 pt-2 border-top small">
                    <span className="text-muted d-block mb-1">Missing Skills:</span>
                    <span className="text-danger fw-medium">Penetration Testing, Cryptography</span>
                  </div>
                </div>
                <button className="btn btn-outline-primary w-100 rounded-pill py-2 fw-medium">View Roadmap</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-light border-top">
        <div className="container py-5" style={{ maxWidth: "1200px" }}>
          <div className="text-center mb-5">
            <h2 className="fw-bold display-6 mb-3 text-dark">Loved by Students & Professionals</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="pf-card h-100">
                <div className="d-flex gap-1 mb-3 text-warning">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <p className="text-muted mb-4">"Pathfinder AI completely changed my approach to learning. I discovered my skill gaps instantly and landed my first job as a Junior AI Engineer."</p>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-light border" style={{ width: "40px", height: "40px" }}></div>
                  <div>
                    <div className="fw-bold text-dark small">Alex M.</div>
                    <div className="text-muted" style={{ fontSize: "12px" }}>AI Engineer @ TechCorp</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Add 2 more testimonials to match UI rules */}
            <div className="col-md-4">
              <div className="pf-card h-100">
                <div className="d-flex gap-1 mb-3 text-warning">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <p className="text-muted mb-4">"The AI Career Advisor is incredibly accurate. It recommended a path into Data Science that perfectly aligned with my background in Economics."</p>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-light border" style={{ width: "40px", height: "40px" }}></div>
                  <div>
                    <div className="fw-bold text-dark small">Sarah K.</div>
                    <div className="text-muted" style={{ fontSize: "12px" }}>Data Scientist</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="pf-card h-100">
                <div className="d-flex gap-1 mb-3 text-warning">
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <p className="text-muted mb-4">"The skill gap analysis and the generated roadmap are beautiful and so easy to follow. Finally, an app that actually guides you step by step."</p>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-light border" style={{ width: "40px", height: "40px" }}></div>
                  <div>
                    <div className="fw-bold text-dark small">David L.</div>
                    <div className="text-muted" style={{ fontSize: "12px" }}>Full Stack Dev</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unified Footer */}
      <Footer />
    </div>
  );
}

export default LandingPage;
