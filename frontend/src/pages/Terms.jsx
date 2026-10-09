import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import siteConfig from "../config/siteConfig";

function Terms() {
  return (
    <div className="dashboard-clean-bg min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container py-5 flex-grow-1" style={{ maxWidth: "900px" }}>
        
        <div className="clean-card p-4 p-md-5 mb-5">
          <div className="mb-5 border-bottom pb-4">
            <h1 className="fw-bolder text-dark mb-3">Terms & Conditions</h1>
            <p className="text-secondary mb-0">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="privacy-content text-secondary" style={{ lineHeight: "1.8" }}>
            <h4 className="fw-bold text-dark mb-3">1. Acceptance of Terms</h4>
            <p className="mb-4">
              By accessing and using <strong>{siteConfig.appName}</strong>, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>

            <h4 className="fw-bold text-dark mb-3">2. Description of Service</h4>
            <p className="mb-4">
              {siteConfig.appName} provides users with access to a rich collection of resources, including various career intelligence tools, educational roadmaps, personalized assessment systems, and resume builders. You understand and agree that the service is provided "AS-IS" and that {siteConfig.appName} assumes no responsibility for the timeliness, deletion, mis-delivery, or failure to store any user communications or personalization settings.
            </p>

            <h4 className="fw-bold text-dark mb-3">3. User Conduct and Responsibilities</h4>
            <p className="mb-2">You agree to use the platform only for lawful purposes. You agree not to take any action that might compromise the security of the site, render the site inaccessible to others, or otherwise cause damage to the site or its content. You agree not to:</p>
            <ul className="mb-4">
              <li className="mb-2">Provide false, inaccurate, or misleading information.</li>
              <li className="mb-2">Attempt to bypass or break any security mechanism of the platform.</li>
              <li className="mb-2">Use the system to cheat on assessments or misrepresent your skills to potential employers.</li>
            </ul>

            <h4 className="fw-bold text-dark mb-3">4. Intellectual Property Rights</h4>
            <p className="mb-4">
              All content included on this site, such as text, graphics, logos, button icons, images, data compilations, and software, is the property of {siteConfig.appName} or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of {siteConfig.developer.name}.
            </p>

            <h4 className="fw-bold text-dark mb-3">5. Disclaimer of Warranties</h4>
            <p className="mb-4">
              The AI recommendations, career paths, and skill gap analyses provided by {siteConfig.appName} are algorithmically generated suggestions intended to guide your educational and professional journey. They do not constitute guaranteed employment or academic success. We make no warranty that the service will meet your requirements or be uninterrupted, timely, secure, or error-free.
            </p>

            <h4 className="fw-bold text-dark mb-3">6. Modifications to Service</h4>
            <p className="mb-4">
              {siteConfig.appName} reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that {siteConfig.appName} shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.
            </p>

            <h4 className="fw-bold text-dark mb-3">7. Contact Information</h4>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
              <br />
              <strong>Email:</strong> <a href={`mailto:${siteConfig.developer.email}`} className="text-primary text-decoration-none">{siteConfig.developer.email}</a>
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}

export default Terms;
