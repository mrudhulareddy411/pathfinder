import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import siteConfig from "../config/siteConfig";

function About() {
  return (
    <div className="dashboard-clean-bg min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container py-5 flex-grow-1" style={{ maxWidth: "900px" }}>
        
        {/* HERO SECTION */}
        <div className="clean-card p-5 mb-5 text-center position-relative overflow-hidden">
          <div className="position-absolute top-0 start-50 translate-middle-x w-100 h-100 opacity-10 pointer-events-none" 
               style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}></div>
          <div className="position-relative z-1">
            <h1 className="fw-bolder text-dark mb-3 display-5">About {siteConfig.appName}</h1>
            <p className="text-secondary fs-5 mx-auto" style={{ maxWidth: "700px", lineHeight: "1.6" }}>
              {siteConfig.tagline}
            </p>
          </div>
        </div>

        <div className="row g-4 mb-5">
          {/* MISSION */}
          <div className="col-12 col-md-6">
            <div className="clean-card p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-primary bg-opacity-10 rounded-3 text-primary">
                  <span className="fs-4">🎯</span>
                </div>
                <h4 className="fw-bold text-dark mb-0">Our Mission</h4>
              </div>
              <p className="text-secondary mb-0" style={{ lineHeight: "1.7" }}>
                Pathfinder AI bridges the gap between academic education and industry requirements. 
                We leverage artificial intelligence to provide students and professionals with highly accurate, 
                data-driven career recommendations, pinpointing exactly what skills they need to learn to secure their dream roles.
              </p>
            </div>
          </div>

          {/* VISION */}
          <div className="col-12 col-md-6">
            <div className="clean-card p-4 h-100">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="p-2 bg-success bg-opacity-10 rounded-3 text-success">
                  <span className="fs-4">👁️</span>
                </div>
                <h4 className="fw-bold text-dark mb-0">Our Vision</h4>
              </div>
              <p className="text-secondary mb-0" style={{ lineHeight: "1.7" }}>
                To create a world where no student feels lost in their career journey. By providing an intelligent roadmap, 
                we empower individuals to build their competencies, track their academic progress, and seamlessly transition into the modern workforce.
              </p>
            </div>
          </div>
        </div>

        {/* CORE FEATURES */}
        <div className="clean-card p-4 p-md-5 mb-5">
          <h4 className="fw-bold text-dark mb-4 text-center">What Makes Pathfinder AI Unique?</h4>
          <div className="row g-4">
            <div className="col-12 col-md-4 text-center">
              <div className="fs-1 mb-2">🧠</div>
              <h6 className="fw-bold text-dark">Intelligent Matchmaking</h6>
              <p className="text-secondary small">Using O*NET machine learning models to align your existing skills with real-world industry demands.</p>
            </div>
            <div className="col-12 col-md-4 text-center">
              <div className="fs-1 mb-2">📊</div>
              <h6 className="fw-bold text-dark">Dynamic Skill Gaps</h6>
              <p className="text-secondary small">Visualizing the exact technologies and concepts you are missing, saving you hundreds of hours of directionless learning.</p>
            </div>
            <div className="col-12 col-md-4 text-center">
              <div className="fs-1 mb-2">🚀</div>
              <h6 className="fw-bold text-dark">Actionable Roadmaps</h6>
              <p className="text-secondary small">Generating a step-by-step learning progression, complete with curated resources to help you reach 100% role readiness.</p>
            </div>
          </div>
        </div>

        {/* DEVELOPER SECTION */}
        <div className="clean-card p-4 p-md-5 bg-light border-0">
          <div className="d-flex flex-column flex-md-row align-items-center gap-4">
            <div
              className="rounded-circle text-white fw-bold d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
              style={{
                width: "80px",
                height: "80px",
                background: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)",
                fontSize: "32px",
              }}
            >
              {siteConfig.developer.name.charAt(0)}
            </div>
            <div className="text-center text-md-start">
              <h5 className="fw-bold text-dark mb-1">Developed by {siteConfig.developer.name}</h5>
              <div className="text-primary small fw-semibold mb-2">{siteConfig.developer.role}</div>
              <p className="text-secondary small mb-3" style={{ maxWidth: "600px", lineHeight: "1.6" }}>
                Built as a culmination of deep expertise in Artificial Intelligence, Full-Stack Web Development, and 
                scalable software engineering. Pathfinder AI reflects a dedication to building reliable, customer-focused 
                solutions that drive real-world educational impact.
              </p>
              <Link to="/developer" className="btn btn-outline-dark btn-sm rounded-pill px-4">
                View Developer Profile
              </Link>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default About;
