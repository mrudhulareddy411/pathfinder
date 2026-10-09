import { Link } from "react-router-dom";
import { Cpu } from "lucide-react";
import siteConfig from "../config/siteConfig";

function Footer() {
  return (
    <footer className="footer mt-5 pt-5 pb-4 no-print position-relative bg-white border-top">
      <div className="container" style={{ maxWidth: "1250px" }}>
        <div className="row g-4 mb-4">
          
          {/* BRAND COLUMN */}
          <div className="col-12 col-lg-3">
            <Link className="navbar-brand fw-extrabold text-dark fs-4 d-flex align-items-center gap-2 mb-3 text-decoration-none" to="/">
              <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Cpu size={18} color="white" />
              </div>
              {siteConfig.appName}
            </Link>
            <p className="small text-muted mb-4" style={{ maxWidth: "300px" }}>
              {siteConfig.tagline}
            </p>
          </div>

          {/* PRODUCT COLUMN */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark small text-uppercase mb-3">Product</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/career-pathfinder" className="text-decoration-none text-muted transition-all hover-primary">Career Pathfinder</Link></li>
              <li><Link to="/skills" className="text-decoration-none text-muted transition-all hover-primary">Skills Gap</Link></li>
              <li><Link to="/resources" className="text-decoration-none text-muted transition-all hover-primary">Learning Resources</Link></li>
              <li><Link to="/assessment" className="text-decoration-none text-muted transition-all hover-primary">Assessments</Link></li>
              <li><Link to="/academics" className="text-decoration-none text-muted transition-all hover-primary">Academic Tracker</Link></li>
              <li><Link to="/admin" className="text-decoration-none text-muted transition-all hover-primary">Admin Datasets</Link></li>
            </ul>
          </div>

          {/* COMPANY COLUMN */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark small text-uppercase mb-3">Company</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/about" className="text-decoration-none text-muted transition-all hover-primary">About</Link></li>
              <li><Link to="/contact" className="text-decoration-none text-muted transition-all hover-primary">Contact</Link></li>
              <li><Link to="/developer" className="text-decoration-none text-muted transition-all hover-primary">Developer</Link></li>
              <li><Link to="/help" className="text-decoration-none text-muted transition-all hover-primary">Help Center</Link></li>
              <li><Link to="/faq" className="text-decoration-none text-muted transition-all hover-primary">FAQ</Link></li>
            </ul>
          </div>

          {/* LEGAL COLUMN */}
          <div className="col-6 col-md-3 col-lg-2">
            <h6 className="fw-bold text-dark small text-uppercase mb-3">Legal</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li><Link to="/privacy" className="text-decoration-none text-muted transition-all hover-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-decoration-none text-muted transition-all hover-primary">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* DEVELOPER COLUMN */}
          <div className="col-6 col-md-3 col-lg-3">
            <h6 className="fw-bold text-dark small text-uppercase mb-3">Developer</h6>
            <div className="p-3 bg-light rounded-3 border">
              <div className="extra-small text-muted mb-1">Developed by:</div>
              <Link to="/developer" className="fw-bold text-primary text-decoration-none d-block mb-2">
                {siteConfig.developer.name}
              </Link>
              <div className="extra-small text-secondary mb-3">
                {siteConfig.developer.role}
              </div>
              <div className="d-flex gap-2">
                {siteConfig.developer.socialLinks?.github && (
                  <a href={siteConfig.developer.socialLinks.github} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-secondary py-1 px-2 extra-small">
                    GitHub
                  </a>
                )}
                {siteConfig.developer.socialLinks?.linkedin && (
                  <a href={siteConfig.developer.socialLinks.linkedin} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary py-1 px-2 extra-small">
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="border-top mt-4 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="small text-muted mb-0">
            &copy; {new Date().getFullYear()} {siteConfig.appName}. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
