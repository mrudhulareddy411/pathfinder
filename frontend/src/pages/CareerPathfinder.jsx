import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  GraduationCap, Code, LineChart, Bot, Database, Compass, 
  Search, CheckCircle, ArrowRight, Target, Wrench, TrendingUp, Cpu
} from "lucide-react";

function CareerPathfinder() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMsg, setSelectedMsg] = useState("");

  useEffect(() => {
    const fetchPathfinderData = async () => {
      try {
        setLoading(true);
        setError("");

        try {
          const meRes = await api.get("/auth/me");
          setUser(meRes.data);
        } catch {
          console.warn("Guest profile active.");
        }

        const recRes = await api.get("/recommendations");
        if (recRes.data) {
          setRecommendations(recRes.data.recommendations || []);
        }

        const catRes = await api.get("/careers");
        if (catRes.data) {
          setCatalog(Array.isArray(catRes.data) ? catRes.data : []);
        }
      } catch (err) {
        console.error("Career Pathfinder Fetch Error:", err);
        const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Unable to retrieve career data.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchPathfinderData();
  }, []);

  const handleSelectCareer = async (targetCode, title) => {
    try {
      const res = await api.post("/recommendations/select", { onetCode: targetCode, title });
      if (res.data?.user) {
        setUser(res.data.user);
      }
      setSelectedMsg(`Selected '${title}' as your primary target career! 🎯`);
      setTimeout(() => setSelectedMsg(""), 3500);
    } catch (err) {
      console.error("Select career error:", err);
    }
  };

  const topRecommendations = recommendations.slice(0, 5);

  const filteredCatalog = catalog.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.onetCode && item.onetCode.includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="modern-saas-bg pb-5">
      <Navbar user={user} />

      <div className="container py-5" style={{ maxWidth: "1200px" }}>
        {selectedMsg && (
          <div className="p-3 mb-4 text-center rounded-3 fw-semibold badge-clean-green w-100">
            <CheckCircle size={18} className="me-2 d-inline" /> {selectedMsg}
          </div>
        )}

        {/* STUNNING HERO SECTION */}
        <div className="pf-card p-5 mb-5 position-relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="position-absolute top-0 end-0 p-5 opacity-25" style={{ transform: 'translate(20%, -20%)' }}>
            <Target size={300} color="#38BDF8" strokeWidth={1} />
          </div>
          
          <div className="row position-relative z-index-1 align-items-center">
            <div className="col-lg-8">
              <span className="badge px-3 py-2 text-uppercase fw-bold mb-3 d-inline-flex align-items-center gap-2 badge-clean-blue" style={{ letterSpacing: '1px', borderRadius: "8px" }}>
                <TrendingUp size={14}/> Personalized Match Explorer
              </span>
              <h1 className="fw-bolder mb-3 text-dark" style={{ fontSize: "3rem", lineHeight: '1.2' }}>
                AI-Powered <br/>
                <span style={{ background: "linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Career Pathfinder</span>
              </h1>
              <p className="fs-5 mb-4 text-muted" style={{ maxWidth: "700px" }}>
                Discover top software and technology career paths perfectly matched to your skills, academic background, and technical interests.
              </p>
              
              <div className="d-flex flex-wrap gap-3">
                <button onClick={() => navigate("/assessment")} className="btn btn-primary px-4 py-3 fw-medium d-flex align-items-center gap-2 rounded-pill">
                  <Target size={18} /> Update Assessment
                </button>
                <Link to="/skills" className="btn btn-secondary px-4 py-3 fw-medium d-flex align-items-center gap-2 rounded-pill">
                  <Wrench size={18} /> Skills Gap Matrix
                </Link>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <div className="pf-card p-5 text-center mb-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary mb-4" style={{ width: '3rem', height: '3rem' }} role="status"></div>
            <h4 className="text-dark fw-bold mb-2">Analyzing Your Profile</h4>
            <p className="text-muted mb-0">Matching your skills with top industry roles...</p>
          </div>
        )}

        {error && (
          <div className="pf-card p-5 text-center mb-5 bg-danger bg-opacity-10">
            <h4 className="fw-bold text-danger mb-2">Unable to load career data</h4>
            <p className="text-danger opacity-75 mb-0">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* TOP PERSONALIZED RECOMMENDATIONS */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                  <h2 className="fw-bold text-dark mb-1">Top Recommendations</h2>
                  <p className="text-muted mb-0">Personalized matching based on your skill profile</p>
                </div>
                <div className="badge badge-clean-green px-3 py-2 fs-6">
                  {topRecommendations.length} Paths Matched
                </div>
              </div>

              <div className="row g-4">
                {topRecommendations.map((rec, idx) => {
                  const targetCode = rec.onetCode || rec.careerId || rec.title;
                  const t = (rec.title || "").toLowerCase();
                  
                  let dynamicMatches = ["Python", "Java", "SQL"];
                  let dynamicNeeds = ["React", "Git", "REST APIs"];
                  let gradient = 'linear-gradient(135deg, rgba(37, 99, 235, 0.05), rgba(56, 189, 248, 0.05))';
                  let borderColor = 'rgba(37, 99, 235, 0.15)';
                  let Icon = Code;
                  
                  if (t.includes("machine") || t.includes("ai") || t.includes("model") || t.includes("data")) {
                    dynamicMatches = ["Python", "Algorithms", "Math", "SQL"];
                    dynamicNeeds = ["PyTorch", "TensorFlow", "MLOps"];
                    gradient = 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(5, 150, 105, 0.05))';
                    borderColor = 'rgba(16, 185, 129, 0.15)';
                    Icon = t.includes("data") ? Database : Bot;
                  } else if (t.includes("front") || t.includes("ui") || t.includes("web")) {
                    dynamicMatches = ["HTML", "CSS", "JavaScript"];
                    dynamicNeeds = ["React", "Next.js", "Figma"];
                    gradient = 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(239, 68, 68, 0.05))';
                    borderColor = 'rgba(245, 158, 11, 0.15)';
                    Icon = Code;
                  }

                  const matches = rec.matchingSkills && rec.matchingSkills.length > 0 ? rec.matchingSkills : dynamicMatches;
                  const needs = rec.missingSkills && rec.missingSkills.length > 0 ? rec.missingSkills : dynamicNeeds;
                  const isSelected = user?.selectedCareerDetails?.title === rec.title;

                  return (
                    <div className="col-12 col-md-6 col-xl-4" key={rec.careerId || idx}>
                      <div className="pf-card h-100 d-flex flex-column p-0 overflow-hidden" style={{ border: `1px solid ${borderColor} !important` }}>
                        
                        {/* Premium Header */}
                        <div className="p-4 position-relative" style={{ background: gradient }}>
                           <div className="position-absolute top-0 end-0 opacity-25 p-3 text-primary">
                              <Icon size={80} strokeWidth={1} />
                           </div>
                           <div className="position-relative z-index-1">
                             <div className="d-flex justify-content-between align-items-center mb-3">
                               <span className="badge rounded-pill px-3 py-1 fw-bold bg-white text-dark shadow-sm">
                                 {rec.matchPercentage}% Match
                               </span>
                               {isSelected && <span className="badge badge-clean-green rounded-pill"><CheckCircle size={12} className="me-1"/> Target</span>}
                             </div>
                             <h4 className="fw-bold mb-1 text-dark">{rec.title}</h4>
                           </div>
                        </div>
                        
                        <div className="p-4 d-flex flex-column flex-grow-1">
                          <p className="text-muted small mb-4 flex-grow-1">
                            {rec.description}
                          </p>

                          {/* Strengths */}
                          <div className="mb-3 p-3 rounded-3 bg-light border">
                            <div className="fw-semibold text-success small mb-2 d-flex align-items-center gap-2">
                              <LineChart size={14} /> Your Strengths
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              {matches.slice(0, 3).map((s, i) => (
                                <span key={i} className="badge badge-clean-green">{s}</span>
                              ))}
                            </div>
                          </div>

                          {/* Needs */}
                          <div className="mb-4 p-3 rounded-3 bg-light border">
                            <div className="fw-semibold text-warning small mb-2 d-flex align-items-center gap-2">
                              <GraduationCap size={14} /> Skills to Develop
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                              {needs.slice(0, 3).map((s, i) => (
                                <span key={i} className="badge badge-clean-amber">{s}</span>
                              ))}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="d-flex flex-column gap-2 mt-auto">
                            <button
                              onClick={() => handleSelectCareer(targetCode, rec.title)}
                              className={`btn w-100 py-2 fw-medium d-flex align-items-center justify-content-center gap-2 ${isSelected ? "btn-success" : "btn-secondary"}`}
                            >
                              {isSelected ? <><CheckCircle size={16} /> Target Selected</> : <><Target size={16} /> Select as Target</>}
                            </button>
                            <Link to={`/career/details/${encodeURIComponent(targetCode)}`} className="btn w-100 py-2 d-flex align-items-center justify-content-center gap-2 text-primary text-decoration-none">
                              <span className="small fw-bold transition-all">View Details</span> <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CAREER CATALOG SEARCH & GRID */}
            <div className="pf-card p-4 p-md-5 mb-5">
              <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end gap-4 mb-5">
                <div>
                  <h3 className="fw-bold text-dark mb-2">Browse Full Career Catalog</h3>
                  <p className="text-muted mb-0">Explore standard industry technology roles and detailed skill requirements.</p>
                </div>

                <div className="position-relative" style={{ maxWidth: "400px", width: "100%" }}>
                  <div className="position-absolute top-50 start-0 translate-middle-y ps-3 text-secondary">
                    <Search size={18} color="#94a3b8" />
                  </div>
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5"
                    placeholder="Search roles or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-4">
                {filteredCatalog.map((item, idx) => {
                  const targetCode = item.onetCode || item._id || item.title;

                  return (
                    <div className="col-12 col-md-6 col-xl-4" key={item._id || idx}>
                      <div className="pf-card h-100 d-flex flex-column p-4 position-relative overflow-hidden">
                        <div className="position-absolute top-0 start-0 w-100" style={{ height: "3px", background: "linear-gradient(90deg, #2563EB, #38BDF8)" }}></div>
                        
                        <div className="d-flex flex-column h-100 pt-2">
                          <h5 className="fw-bold text-dark mb-2">{item.title}</h5>
                          <p className="text-muted small mb-4 flex-grow-1" style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {item.description}
                          </p>

                          <div className="mb-4">
                            <div className="d-flex flex-wrap gap-2">
                              {(item.requiredSkills || ["Software Engineering"]).slice(0, 3).map((sk, i) => (
                                <span key={i} className="badge badge-clean-gray">{sk}</span>
                              ))}
                            </div>
                          </div>

                          <Link to={`/career/details/${encodeURIComponent(targetCode)}`} className="btn btn-outline-primary w-100 py-2 fw-medium text-uppercase d-flex align-items-center justify-content-center gap-2" style={{ letterSpacing: '0.5px', fontSize: "13px" }}>
                            Explore Path <ArrowRight size={14}/>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CareerPathfinder;
