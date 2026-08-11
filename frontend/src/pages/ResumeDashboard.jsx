import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { getResumes, deleteResume } from "../services/resumeService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function ResumeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const meRes = await api.get("/auth/me");
      setUser(meRes.data);

      const resList = await getResumes();
      setResumes(resList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      await deleteResume(id);
      fetchResumes();
    }
  };

  return (
    <div className="dashboard-clean-bg">
      <Navbar user={user} />
      <div className="container py-4" style={{ maxWidth: "1150px" }}>
        {/* HEADER SECTION */}
        <div className="clean-card p-4 mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div>
              <span className="badge badge-clean-blue mb-2">Resume Builder Studio</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                My Resumes
              </h2>
              <p className="text-secondary small mb-0">
                Create, customize, and manage professional ATS-friendly resumes for job applications.
              </p>
            </div>
            <Link to="/resume/templates" className="btn btn-primary-clean">
              + Build New Resume
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="clean-card p-5 text-center my-4">
            <div className="spinner-border text-primary mb-3" role="status"></div>
            <p className="small text-secondary mb-0">Loading your saved resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="clean-card p-5 text-center my-4">
            <div className="fs-1 mb-3">📄</div>
            <h5 className="fw-bold text-dark mb-2">No Resumes Created Yet</h5>
            <p className="text-secondary small mb-4" style={{ maxWidth: "520px", margin: "0 auto" }}>
              Start by building your first resume! Pathfinder AI automatically imports your profile education, skills, and projects.
            </p>
            <Link to="/resume/templates" className="btn btn-primary-clean">
              Choose Resume Format &rarr;
            </Link>
          </div>
        ) : (
          <div className="row g-4 mb-4">
            {resumes.map((res) => (
              <div className="col-12 col-md-6 col-lg-4" key={res._id || res.id}>
                <div className="p-4 clean-card-flat h-100 d-flex flex-column justify-content-between bg-white">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge badge-clean-blue extra-small">{res.template || "Standard"} Template</span>
                      <span className="text-secondary extra-small">
                        {new Date(res.updatedAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <h6 className="fw-bold text-dark mb-1">{res.resumeName || "Professional Resume"}</h6>
                    <p className="text-secondary extra-small mb-3">
                      Target Role: <strong className="text-dark">{res.personalInformation?.title || "Software Engineer"}</strong>
                    </p>
                  </div>

                  <div className="d-flex gap-2 pt-3 border-top">
                    <button
                      onClick={() => navigate(`/resume/builder?id=${res._id || res.id}`)}
                      className="btn btn-primary-clean btn-sm flex-grow-1 justify-content-center"
                    >
                      Edit Resume
                    </button>
                    <button
                      onClick={() => handleDelete(res._id || res.id)}
                      className="btn btn-outline-danger btn-sm extra-small px-3"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default ResumeDashboard;
