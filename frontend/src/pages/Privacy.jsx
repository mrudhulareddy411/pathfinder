import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import siteConfig from "../config/siteConfig";

function Privacy() {
  return (
    <div className="dashboard-clean-bg min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container py-5 flex-grow-1" style={{ maxWidth: "900px" }}>
        
        <div className="clean-card p-4 p-md-5 mb-5">
          <div className="mb-5 border-bottom pb-4">
            <h1 className="fw-bolder text-dark mb-3">Privacy Policy</h1>
            <p className="text-secondary mb-0">
              Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="privacy-content text-secondary" style={{ lineHeight: "1.8" }}>
            <h4 className="fw-bold text-dark mb-3">1. Introduction</h4>
            <p className="mb-4">
              Welcome to <strong>{siteConfig.appName}</strong>. We respect your privacy and are committed to protecting your personal data. 
              This privacy policy explains how we collect, use, and safeguard your information when you use our intelligent career optimization platform.
            </p>

            <h4 className="fw-bold text-dark mb-3">2. Information We Collect</h4>
            <p className="mb-2">We collect information to provide better career intelligence and matchmaking services. This includes:</p>
            <ul className="mb-4">
              <li className="mb-2"><strong>Account Information:</strong> Name, email address, password, phone number, and academic institution.</li>
              <li className="mb-2"><strong>Academic & Professional Data:</strong> Degree, CGPA, graduation year, existing skills, certifications, and experience.</li>
              <li className="mb-2"><strong>Platform Usage Data:</strong> Assessment scores, roadmap progress, completed learning resources, and generated resumes.</li>
            </ul>

            <h4 className="fw-bold text-dark mb-3">3. How We Use Your Information</h4>
            <p className="mb-2">The data collected is exclusively used to enhance your experience within {siteConfig.appName}:</p>
            <ul className="mb-4">
              <li className="mb-2">To provide highly accurate, AI-driven career path recommendations.</li>
              <li className="mb-2">To identify personalized skill gaps and generate actionable learning roadmaps.</li>
              <li className="mb-2">To securely authenticate your account and persist your progress.</li>
              <li className="mb-2">To dynamically generate professional resumes using your inputted data.</li>
            </ul>

            <h4 className="fw-bold text-dark mb-3">4. Data Security & Storage</h4>
            <p className="mb-4">
              We implement robust security measures to protect your personal information. Passwords are cryptographically hashed 
              before being stored in our secure database. We utilize modern JWT (JSON Web Token) authentication to ensure that 
              your session data remains isolated and protected from unauthorized access.
            </p>

            <h4 className="fw-bold text-dark mb-3">5. Data Sharing & Third Parties</h4>
            <p className="mb-4">
              We do <strong>not</strong> sell, rent, or trade your personal or academic information to third parties. 
              Your data is strictly used within the Pathfinder AI ecosystem to power the recommendation engines. 
              In the future, integrations with third-party job boards or learning providers will require your explicit opt-in consent.
            </p>

            <h4 className="fw-bold text-dark mb-3">6. Your Rights & Choices</h4>
            <p className="mb-4">
              You have full control over your data. You may update, correct, or delete your profile information at any time 
              via your Account Settings. If you wish to permanently delete your account and all associated assessment data, 
              please contact our support team.
            </p>

            <h4 className="fw-bold text-dark mb-3">7. Contact Us</h4>
            <p className="mb-4">
              If you have any questions or concerns regarding this Privacy Policy, please reach out to the developer directly at:
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

export default Privacy;
