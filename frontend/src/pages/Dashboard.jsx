import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Target, BookOpen, Cpu, Briefcase, 
  PlusCircle, Compass, FileText, Sparkles, ChevronRight, ArrowRight
} from "lucide-react";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [resumeData, setResumeData] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let userData = null;
        try { 
          const meRes = await api.get("/auth/me"); 
          if (meRes.data) userData = meRes.data; 
        } catch {}
        
        if (userData) {
          setUser(userData);
          try { const perfRes = await api.get("/academic/performance"); if (perfRes.data?.performance) setPerformance(perfRes.data.performance); } catch {}
          try { const resRes = await api.get("/resumes"); if (resRes.data && Array.isArray(resRes.data)) setResumeData(resRes.data); } catch {}
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="d-flex flex-column" style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <Navbar user={user} />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex flex-column" style={{ minHeight: "100vh", background: "#f8fafc" }}>
        <Navbar user={null} />
        <div className="flex-grow-1 d-flex justify-content-center align-items-center flex-column text-center px-3">
          <h2 className="fw-bold text-dark mb-3">Please log in to view your dashboard</h2>
          <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2">Go to Login</Link>
        </div>
      </div>
    );
  }

  const firstName = user.fullName ? user.fullName.split(' ')[0] : "User";
  const readinessScore = user.jobReadiness?.score || 0;
  const totalSkills = user.skills?.length || 0;
  const learningProgress = performance ? `${performance.overallPercentage || 0}%` : "No data";
  const resumesCount = resumeData.length;

  return (
    <div style={{ background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh", color: "#0f172a" }}>
      <Navbar user={user} />

      <div className="container py-5" style={{ maxWidth: "1200px" }}>
        {/* HERO SECTION */}
        <div className="p-5 rounded-5 shadow-sm mb-5 bg-white position-relative overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
          {/* Subtle background decoration */}
          <div className="position-absolute top-0 end-0 p-5 opacity-10 d-none d-md-block" style={{ transform: "translate(20%, -20%)" }}>
            <Target size={300} color="#3b82f6" />
          </div>
          
          <div className="position-relative z-index-1">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-4">
              <div>
                <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill mb-3 px-3 py-2 fw-bold" style={{ letterSpacing: "1px" }}>🚀 INTELLIGENT DASHBOARD</span>
                <h1 className="fw-bolder mb-2 text-dark" style={{ fontSize: "3rem" }}>Welcome back, <span className="text-primary">{firstName}</span>.</h1>
                <p className="text-muted fs-5 mb-0" style={{ maxWidth: "600px" }}>Your personal AI career intelligence hub. Let's build your future.</p>
              </div>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/resume/builder" className="btn btn-outline-primary d-flex align-items-center gap-2 px-4 py-3 rounded-pill fw-bold hover-scale transition bg-white" style={{ transform: "translateY(0)" }}>
                  <FileText size={20}/> Build Resume
                </Link>
                <Link to="/career-pathfinder" className="btn btn-primary d-flex align-items-center gap-2 px-4 py-3 rounded-pill fw-bold shadow hover-scale transition">
                  <Compass size={20}/> Career Pathfinder
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* METRICS */}
        <div className="row g-4 mb-5">
          {[
            { title: "Career Readiness", icon: <Target size={24}/>, value: `${readinessScore}%`, desc: "Based on AI analysis", color: "#eff6ff", textColor: "#3b82f6" },
            { title: "Skills Verified", icon: <Cpu size={24}/>, value: totalSkills, desc: "Across all domains", color: "#f3e8ff", textColor: "#8b5cf6" },
            { title: "Academic Score", icon: <BookOpen size={24}/>, value: learningProgress, desc: "Overall performance", color: "#d1fae5", textColor: "#10b981" },
            { title: "Resumes Built", icon: <Briefcase size={24}/>, value: resumesCount, desc: "ATS-optimized", color: "#fef3c7", textColor: "#f59e0b" },
          ].map((m, i) => (
            <div key={i} className="col-md-3">
              <div className="p-4 rounded-4 h-100 transition hover-scale bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.03)" }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "0.75rem", letterSpacing: "1px" }}>{m.title}</span>
                  <div className="p-2 rounded-3" style={{ background: m.color, color: m.textColor }}>{m.icon}</div>
                </div>
                <h2 className="fw-bolder mb-1 text-dark">{m.value}</h2>
                <div className="text-muted small">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN MODULES */}
        <div className="row g-4">
          <div className="col-lg-8">
            {/* RESUME BUILDER HIGHLIGHT */}
            <div className="p-4 rounded-4 mb-4 shadow-sm" style={{ background: "linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)", border: "1px solid #bae6fd" }}>
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h4 className="fw-bold mb-2 d-flex align-items-center gap-2 text-primary"><Sparkles className="text-primary"/> AI Resume Studio</h4>
                  <p className="text-secondary mb-4">Create stunning, ATS-friendly resumes tailored to your dream jobs in minutes.</p>
                  <Link to="/resumes" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Manage Resumes <ChevronRight size={16}/></Link>
                </div>
                <div className="col-md-4 text-center d-none d-md-block">
                  <FileText size={80} className="text-primary opacity-50"/>
                </div>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-4 rounded-4 h-100 bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
                  <h5 className="fw-bold mb-4 text-dark">Active Projects</h5>
                  {user.projects?.length > 0 ? (
                    user.projects.slice(0, 3).map((p, i) => (
                      <div key={i} className="p-3 rounded-3 mb-3 bg-light border">
                        <div className="fw-bold text-dark mb-1">{p.title}</div>
                        <div className="text-muted small">{p.description?.substring(0, 50)}...</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small">No projects added yet.</p>
                  )}
                  <Link to="/projects" className="btn btn-sm btn-link text-primary text-decoration-none p-0 mt-2 fw-bold">View all projects <ArrowRight size={14}/></Link>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="p-4 rounded-4 h-100 bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
                  <h5 className="fw-bold mb-4 text-dark">Certifications</h5>
                  {user.certifications?.length > 0 ? (
                    user.certifications.slice(0, 3).map((c, i) => (
                      <div key={i} className="p-3 rounded-3 mb-3 bg-light border">
                        <div className="fw-bold text-dark mb-1">{c.title}</div>
                        <div className="text-primary small fw-medium">{c.issuer}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small">No certifications added.</p>
                  )}
                  <Link to="/profile" className="btn btn-sm btn-link text-primary text-decoration-none p-0 mt-2 fw-bold">Manage profile <ArrowRight size={14}/></Link>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="p-4 rounded-4 h-100 bg-white shadow-sm" style={{ border: "1px solid rgba(0,0,0,0.05)" }}>
              <h5 className="fw-bold mb-4 text-dark">Recommended Actions</h5>
              <div className="d-flex flex-column gap-3">
                <div className="p-3 rounded-3" style={{ background: "#eff6ff", borderLeft: "3px solid #3b82f6" }}>
                  <div className="fw-bold mb-1 text-dark">Create Resume</div>
                  <div className="text-muted small mb-2">You need a resume to apply for jobs.</div>
                  <Link to="/resume/builder" className="text-primary small fw-bold text-decoration-none">Start Builder →</Link>
                </div>
                <div className="p-3 rounded-3" style={{ background: "#f3e8ff", borderLeft: "3px solid #8b5cf6" }}>
                  <div className="fw-bold mb-1 text-dark">Take Assessment</div>
                  <div className="text-muted small mb-2">Identify your skill gaps and get recommendations.</div>
                  <Link to="/assessment" className="text-primary small fw-bold text-decoration-none">Start Assessment →</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <style>{`
        .hover-scale { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .hover-scale:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
      `}</style>
    </div>
  );
}

export default Dashboard;
