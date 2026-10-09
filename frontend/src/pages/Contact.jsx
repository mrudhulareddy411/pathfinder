import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import siteConfig from "../config/siteConfig";

function Contact() {
  return (
    <div className="dashboard-clean-bg min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container py-5 flex-grow-1" style={{ maxWidth: "800px" }}>
        
        <div className="clean-card p-4 p-md-5 mb-5 text-center">
          <div className="mb-4">
            <div 
              className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
              style={{ width: "80px", height: "80px", fontSize: "32px" }}
            >
              ✉️
            </div>
            <h1 className="fw-bolder text-dark mb-3">Contact Us</h1>
            <p className="text-secondary fs-5 mb-0">
              We'd love to hear from you. Get in touch with the developer directly.
            </p>
          </div>

          <div className="row g-4 mt-2 text-start">
            {/* Email Contact */}
            <div className="col-12 col-md-6">
              <div className="p-4 border rounded-4 h-100" style={{ backgroundColor: "rgba(248, 250, 252, 0.5)", borderColor: "var(--pf-border)" }}>
                <h5 className="fw-bold text-dark mb-2">Email</h5>
                <p className="text-muted small mb-3">For support, feedback, or general inquiries.</p>
                <a href={`mailto:${siteConfig.developer.email}`} className="fw-bold text-primary text-decoration-none d-flex align-items-center gap-2">
                  {siteConfig.developer.email} ↗
                </a>
              </div>
            </div>

            {/* Phone Contact */}
            <div className="col-12 col-md-6">
              <div className="p-4 border rounded-4 h-100" style={{ backgroundColor: "rgba(248, 250, 252, 0.5)", borderColor: "var(--pf-border)" }}>
                <h5 className="fw-bold text-dark mb-2">Phone</h5>
                <p className="text-muted small mb-3">Available for urgent technical issues.</p>
                <a href={`tel:${siteConfig.developer.phone.replace(/[^0-9+]/g, '')}`} className="fw-bold text-primary text-decoration-none d-flex align-items-center gap-2">
                  {siteConfig.developer.phone} ↗
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="col-12 col-md-6">
              <div className="p-4 border rounded-4 h-100" style={{ backgroundColor: "rgba(248, 250, 252, 0.5)", borderColor: "var(--pf-border)" }}>
                <h5 className="fw-bold text-dark mb-2">LinkedIn</h5>
                <p className="text-muted small mb-3">Connect professionally and follow updates.</p>
                <a href={siteConfig.developer.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="fw-bold text-primary text-decoration-none d-flex align-items-center gap-2">
                  View Profile ↗
                </a>
              </div>
            </div>

            {/* GitHub */}
            <div className="col-12 col-md-6">
              <div className="p-4 border rounded-4 h-100" style={{ backgroundColor: "rgba(248, 250, 252, 0.5)", borderColor: "var(--pf-border)" }}>
                <h5 className="fw-bold text-dark mb-2">GitHub</h5>
                <p className="text-muted small mb-3">Check out the open-source code and projects.</p>
                <a href={siteConfig.developer.socialLinks.github} target="_blank" rel="noopener noreferrer" className="fw-bold text-dark text-decoration-none d-flex align-items-center gap-2">
                  Visit Repository ↗
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-top">
            <h5 className="fw-bold text-dark mb-2">Location</h5>
            <p className="text-muted mb-0">
              {siteConfig.developer.name}<br/>
              SIMATS Engineering, Chennai
            </p>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Contact;
