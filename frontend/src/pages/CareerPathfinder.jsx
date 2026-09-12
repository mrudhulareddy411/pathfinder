import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

        // Fetch Personalized Recommendations
        const recRes = await api.get("/recommendations");
        if (recRes.data) {
          setRecommendations(recRes.data.recommendations || []);
        }

        // Fetch Full Career Catalog
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
    <div className="dashboard-clean-bg">
      <Navbar user={user} />

      <div className="container py-4" style={{ maxWidth: "1150px" }}>
        {selectedMsg && (
          <div className="clean-card p-3 mb-4 text-center border-success bg-success  text-success fw-semibold">
            {selectedMsg}
          </div>
        )}

        {/* HEADER SECTION */}
        <div className="clean-card p-4 p-md-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Personalized Career Pathfinder</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                AI Career Pathfinder & Match Explorer
              </h2>
              <p className="text-secondary small mb-0" style={{ maxWidth: "720px" }}>
                Discover top software and technology career paths matching your current skill set, academic background, and technical interests.
              </p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button onClick={() => navigate("/assessment")} className="btn btn-primary-clean">
                🎯 Update Assessment
              </button>
              <Link to="/skills" className="btn btn-outline-clean">
                🛠️ Skills Gap Matrix
              </Link>
            </div>
          </div>
        </div>

        {loading && (
          <div className="clean-card p-5 text-center mb-4">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="small text-secondary mb-0">Analyzing career paths & matching skill compatibility...</p>
          </div>
        )}

        {error && (
          <div className="clean-card p-4 text-center border-danger mb-4">
            <h6 className="fw-bold text-danger mb-1">Unable to load career data</h6>
            <p className="small text-secondary mb-0">{error}</p>
          </div>
        )}

        {!loading && (
          <>
            {/* TOP PERSONALIZED RECOMMENDATIONS */}
            <div className="clean-card p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Top Recommended Careers</h5>
                  <div className="text-secondary extra-small mt-0.5">Personalized matching based on your skill profiler</div>
                </div>
                <span className="badge badge-clean-green">{topRecommendations.length} Paths Matched</span>
              </div>

              <div className="row g-4">
                {topRecommendations.map((rec, idx) => {
                  const targetCode = rec.onetCode || rec.careerId || rec.title;
                  const matches = rec.matchingSkills || ["Python", "Java", "SQL"];
                  const needs = rec.missingSkills || ["React", "Git", "REST APIs"];
                  const isSelected = user?.selectedCareerDetails?.title === rec.title;

                  return (
                    <div className="col-12 col-md-6 col-lg-4" key={rec.careerId || idx}>
                      <div className="p-3.5 clean-card-flat h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-bold text-dark fs-6">{rec.title}</span>
                            <span className="badge badge-clean-green">{rec.matchPercentage}% Match</span>
                          </div>

                          <p className="extra-small text-secondary mb-2" style={{ minHeight: "38px" }}>
                            {rec.description}
                          </p>

                          {/* Match Reasons Explanation */}
                          {rec.reasons && rec.reasons.length > 0 && (
                            <div className="p-2 mb-2 rounded bg-light border extra-small">
                              <div className="fw-bold text-dark mb-1">Reasons for Match:</div>
                              <ul className="mb-0 ps-3 extra-small text-secondary">
                                {rec.reasons.slice(0, 3).map((r, i) => (
                                  <li key={i}>{r}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Matching Strengths */}
                          <div className="mb-2">
                            <div className="extra-small fw-semibold text-success mb-1">Your Strengths:</div>
                            <div className="d-flex flex-wrap gap-1">
                              {matches.slice(0, 4).map((s, i) => (
                                <span key={i} className="badge badge-clean-green extra-small py-0.5 px-2">{s}</span>
                              ))}
                            </div>
                          </div>

                          {/* Missing Skills */}
                          <div className="mb-3">
                            <div className="extra-small fw-semibold text-amber mb-1" style={{ color: "#D97706" }}>Skills to Develop:</div>
                            <div className="d-flex flex-wrap gap-1">
                              {needs.slice(0, 4).map((s, i) => (
                                <span key={i} className="badge badge-clean-amber extra-small py-0.5 px-2">{s}</span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-2 pt-2 border-top">
                          <Link to={`/career/details/${encodeURIComponent(targetCode)}`} className="btn btn-outline-clean btn-sm w-100 text-center justify-content-center">
                            View Career Path &rarr;
                          </Link>
                          <button
                            onClick={() => handleSelectCareer(targetCode, rec.title)}
                            className={`btn btn-sm extra-small w-100 ${isSelected ? "btn-success text-dark" : "btn-primary-clean"}`}
                          >
                            {isSelected ? "✓ Target Career Selected" : "🎯 Select as Target Career"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CAREER CATALOG SEARCH & GRID */}
            <div className="clean-card p-4 mb-4">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                <div>
                  <h5 className="fw-bold text-dark mb-0">Browse Full Career Catalog</h5>
                  <div className="text-secondary extra-small">Explore standard industry technology roles and skill requirements</div>
                </div>

                <div style={{ maxWidth: "320px", width: "100%" }}>
                  <input
                    type="text"
                    className="form-select border-subtle small"
                    placeholder="🔍 Search career titles or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ borderColor: "#E2E8F0", borderRadius: "8px", padding: "8px 14px" }}
                  />
                </div>
              </div>

              <div className="row g-3">
                {filteredCatalog.map((item, idx) => {
                  const targetCode = item.onetCode || item._id || item.title;

                  return (
                    <div className="col-12 col-md-6 col-lg-4" key={item._id || idx}>
                      <div className="p-3 clean-card-flat bg-light h-100 d-flex flex-column justify-content-between">
                        <div>
                          <div className="fw-bold text-dark small mb-1">{item.title}</div>
                          <p className="extra-small text-secondary mb-3" style={{ minHeight: "36px" }}>
                            {item.description}
                          </p>

                          <div className="d-flex flex-wrap gap-1 mb-3">
                            {(item.requiredSkills || ["Software Engineering"]).slice(0, 3).map((sk, i) => (
                              <span key={i} className="badge badge-clean-gray extra-small py-0.5 px-1.5">{sk}</span>
                            ))}
                          </div>
                        </div>

                        <Link to={`/career/details/${encodeURIComponent(targetCode)}`} className="btn btn-outline-clean btn-sm extra-small w-100 text-center justify-content-center">
                          View Details &rarr;
                        </Link>
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
