import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
  "All Resources",
  "Recommended for You",
  "Programming",
  "Web Development",
  "Data Science",
  "AI/ML",
  "Databases",
  "Career Preparation"
];

function Resources() {
  const [searchParams] = useSearchParams();
  const skillParam = searchParams.get("skill") || "";

  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Resources");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completedItems, setCompletedItems] = useState({});

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError("");

        try {
          const meRes = await api.get("/auth/me");
          setUser(meRes.data);
        } catch {
          console.warn("Guest profile active.");
        }

        const resData = await api.get("/resources");
        let allRes = resData.data || [];

        if (skillParam) {
          allRes = allRes.filter(
            (r) =>
              r.skill.toLowerCase().includes(skillParam.toLowerCase()) ||
              skillParam.toLowerCase().includes(r.skill.toLowerCase())
          );
        }

        setResources(allRes);
      } catch (err) {
        setError(err.message || "Unable to retrieve verified learning resources.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [skillParam]);

  const completedActSet = new Set((user?.completedActivities || []).map((a) => a.activityId || a.title));

  const handleCompleteActivity = async (itemId, itemTitle, itemSkill) => {
    try {
      setCompletedItems((prev) => ({ ...prev, [itemId]: "completing" }));

      const res = await api.post("/activity/complete", {
        activityId: String(itemId),
        activityType: "RESOURCE_COMPLETED",
        title: `Completed ${itemTitle} (${itemSkill})`,
        xpEarned: 50,
      });

      if (res.data?.user) {
        setUser(res.data.user);
      }
      setCompletedItems((prev) => ({ ...prev, [itemId]: "done" }));
    } catch (err) {
      console.error("Activity complete error:", err);
      setCompletedItems((prev) => ({ ...prev, [itemId]: "done" }));
    }
  };

  const getFilteredResources = () => {
    if (activeCategory === "All Resources" || activeCategory === "Recommended for You") {
      return resources;
    }
    return resources.filter((r) => {
      const cat = (r.category || r.skill || "").toLowerCase();
      const matchCat = activeCategory.toLowerCase();
      return cat.includes(matchCat) || matchCat.includes(cat);
    });
  };

  const filteredList = getFilteredResources();

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />

      <div className="container py-4" style={{ maxWidth: "1150px" }}>
        {/* HEADER SECTION */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Learning Hub</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Learning Resources & Skill Courses
                {skillParam && <span className="text-primary fs-5"> • Filtered for "{skillParam}"</span>}
              </h2>
              <p className="text-secondary small mb-0">
                Explore curated learning materials, documentation portals, and interactive courses to bridge your career skill gaps.
              </p>
            </div>
            {skillParam && (
              <a href="/resources" className="btn btn-outline-clean btn-sm">
                ✕ Clear Filter
              </a>
            )}
          </div>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="clean-card p-3 mb-4">
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`btn btn-sm text-nowrap rounded-2 ${
                  activeCategory === cat
                    ? "btn-primary-clean"
                    : "btn-outline-clean"
                }`}
                style={{ fontSize: "13px" }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="clean-card p-5 text-center mb-4">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="small text-secondary mb-0">Loading learning resources...</p>
          </div>
        )}

        {error && (
          <div className="clean-card p-4 text-center border-danger mb-4">
            <h6 className="fw-bold text-danger mb-1">Unable to retrieve resources</h6>
            <p className="small text-secondary mb-0">{error}</p>
          </div>
        )}

        {!loading && !error && filteredList.length === 0 && (
          <div className="clean-card p-5 text-center mb-4">
            <h6 className="fw-bold text-dark mb-2">No learning resources found in "{activeCategory}".</h6>
            <button onClick={() => setActiveCategory("All Resources")} className="btn btn-outline-clean btn-sm">
              Show All Resources
            </button>
          </div>
        )}

        {!loading && !error && filteredList.length > 0 && (
          <div className="row g-3">
            {filteredList.map((item) => {
              const itemId = item._id || item.url || item.title;
              const isDone = completedActSet.has(String(itemId)) || completedItems[itemId] === "done";
              const isCompleting = completedItems[itemId] === "completing";

              return (
                <div className="col-12 col-md-6 col-lg-4" key={itemId}>
                  <div className="p-3.5 clean-card-flat h-100 d-flex flex-column justify-content-between bg-white">
                    <div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge badge-clean-blue extra-small">{item.skill || "General"}</span>
                        <span className="badge badge-clean-gray extra-small">{item.difficulty || "Intermediate"}</span>
                      </div>

                      <h6 className="fw-bold text-dark mb-1">{item.title}</h6>
                      <div className="extra-small text-secondary mb-3">Provider: {item.provider || "Official Documentation"}</div>

                      <div className="mb-3">
                        <div className="d-flex justify-content-between extra-small text-secondary mb-1">
                          <span>Status</span>
                          <span className="fw-semibold text-dark">{isDone ? "100% Completed" : "In Progress"}</span>
                        </div>
                        <div className="progress rounded-pill bg-light" style={{ height: "6px" }}>
                          <div
                            className="progress-bar rounded-pill"
                            style={{
                              width: isDone ? "100%" : "35%",
                              backgroundColor: isDone ? "#16A34A" : "#2563EB"
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-2 pt-2 border-top">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline-clean btn-sm extra-small w-100 text-center justify-content-center"
                      >
                        Open Resource ↗
                      </a>
                      <button
                        onClick={() => handleCompleteActivity(itemId, item.title, item.skill)}
                        className={`btn btn-sm extra-small w-100 justify-content-center ${
                          isDone ? "btn-success text-dark" : "btn-primary-clean"
                        }`}
                        disabled={isDone || isCompleting}
                      >
                        {isDone ? "✓ Completed (+50 XP)" : isCompleting ? "Recording..." : "Start Learning (+50 XP)"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Resources;
