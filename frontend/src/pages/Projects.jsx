import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Projects() {
  const [user, setUser] = useState(null);
  const [projects] = useState([
    {
      id: "p1",
      title: "Full-Stack E-Commerce API Server",
      description: "Build a RESTful API with Node.js, Express, JWT authentication, and database persistence for shopping cart & order fulfillment.",
      difficulty: "Intermediate",
      skills: ["Node.js", "Express", "REST APIs", "JWT", "SQL/MongoDB"],
      xpReward: 300,
      provenance: {
        sourceName: "Industry Portfolio Curriculum",
      },
    },
    {
      id: "p2",
      title: "Interactive Web Data Dashboard",
      description: "Develop a modern React single-page application rendering live data analytics using charting libraries and Bootstrap components.",
      difficulty: "Beginner",
      skills: ["React", "JavaScript", "CSS3", "Axios"],
      xpReward: 200,
      provenance: {
        sourceName: "Web Development Guidelines",
      },
    },
    {
      id: "p3",
      title: "Exploratory Data Analysis & Predictive Model",
      description: "Perform statistical data cleaning, data visualization, and predictive modeling using Python, Pandas, Matplotlib, and Scikit-Learn.",
      difficulty: "Advanced",
      skills: ["Python", "Pandas", "Statistics", "Machine Learning"],
      xpReward: 400,
      provenance: {
        sourceName: "Applied Data Science Curriculum",
      },
    },
  ]);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMe();
  }, []);

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />
      <div className="container py-4" style={{ maxWidth: "1150px" }}>
        {/* HEADER SECTION */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Portfolio Projects</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Portfolio Project Explorer
              </h2>
              <p className="text-secondary small mb-0">
                Industry-aligned practical projects designed to demonstrate engineering problem solving to hiring teams.
              </p>
            </div>
          </div>
        </div>

        {/* PROJECTS GRID */}
        <div className="row g-4 mb-4">
          {projects.map((proj) => (
            <div className="col-12 col-md-6 col-lg-4" key={proj.id}>
              <div className="p-4 clean-card-flat bg-white h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="badge badge-clean-gray extra-small">{proj.difficulty}</span>
                    <span className="badge badge-clean-green extra-small">+{proj.xpReward} XP</span>
                  </div>

                  <h6 className="fw-bold text-dark mb-2">{proj.title}</h6>
                  <p className="text-secondary extra-small mb-3" style={{ minHeight: "48px" }}>
                    {proj.description}
                  </p>

                  <div className="mb-3">
                    <div className="extra-small fw-semibold text-dark mb-1">Required Skills:</div>
                    <div className="d-flex flex-wrap gap-1">
                      {proj.skills.map((s) => (
                        <span key={s} className="badge badge-clean-blue extra-small py-0.5 px-2">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-top d-flex flex-column gap-2">
                  <button className="btn btn-primary-clean btn-sm w-100 text-center justify-content-center">
                    Start Project Challenge
                  </button>
                  <div className="text-secondary extra-small text-center">
                    Curriculum: {proj.provenance.sourceName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Projects;
