import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import siteConfig from "../config/siteConfig";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: `What is ${siteConfig.appName}?`,
      answer: `${siteConfig.appName} is an AI-powered career guidance platform designed to help students and professionals navigate their educational and career journeys. It provides personalized career recommendations, identifies skill gaps, tracks academic progress, and generates learning roadmaps based on your unique profile.`
    },
    {
      question: "How does the AI career matchmaking work?",
      answer: "Our recommendation engine analyzes your academic background, existing technical skills, target roles, and assessment scores. It compares this data against industry benchmarks to suggest the most optimal career paths and shows you exactly what skills you need to learn to get there."
    },
    {
      question: "Are the skill assessments free?",
      answer: "Yes! All built-in skill assessments and proficiency tests are completely free. You can take them to validate your knowledge, and your scores will dynamically update your profile and skill gap analysis."
    },
    {
      question: "Can I use the platform to build my resume?",
      answer: "Absolutely. We feature a dedicated Resume Builder that automatically pulls your academic data, projects, and validated skills into professional, ATS-friendly templates."
    },
    {
      question: "How is my personal data protected?",
      answer: "Your privacy and data security are our top priorities. All passwords are cryptographically hashed, and we use secure token-based authentication. We never sell your data to third parties. For more details, please review our Privacy Policy."
    },
    {
      question: "What if I don't know what career I want?",
      answer: "That is exactly what we are here for! If you leave your target role blank, our AI will recommend suitable career options based purely on your current strengths, degree, and assessment performance."
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="dashboard-clean-bg min-vh-100 d-flex flex-column">
      <Navbar />

      <div className="container py-5 flex-grow-1" style={{ maxWidth: "900px" }}>
        
        <div className="clean-card p-4 p-md-5 mb-5">
          <div className="mb-5 border-bottom pb-4 text-center">
            <h1 className="fw-bolder text-dark mb-3">Frequently Asked Questions</h1>
            <p className="text-secondary mb-0 fs-5">
              Everything you need to know about the product and how it works.
            </p>
          </div>

          <div className="faq-content">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className="mb-3 border rounded-3 overflow-hidden"
                  style={{ 
                    borderColor: isOpen ? "rgba(37, 99, 235, 0.3)" : "var(--pf-border)",
                    backgroundColor: isOpen ? "rgba(37, 99, 235, 0.02)" : "transparent",
                    transition: "all 0.3s ease"
                  }}
                >
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-100 d-flex justify-content-between align-items-center p-4 border-0 bg-transparent text-start"
                    style={{ cursor: "pointer" }}
                  >
                    <span className="fw-bold text-dark fs-6">{faq.question}</span>
                    <span 
                      className="text-primary fw-bold d-flex align-items-center justify-content-center rounded-circle"
                      style={{ 
                        width: "32px", 
                        height: "32px", 
                        backgroundColor: isOpen ? "rgba(37, 99, 235, 0.1)" : "rgba(15, 23, 42, 0.05)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease"
                      }}
                    >
                      ↓
                    </span>
                  </button>
                  
                  {/* CSS transition hack for React without external libraries */}
                  <div 
                    style={{ 
                      maxHeight: isOpen ? "500px" : "0", 
                      overflow: "hidden", 
                      transition: "max-height 0.4s ease-in-out" 
                    }}
                  >
                    <div className="p-4 pt-0 text-secondary" style={{ lineHeight: "1.7" }}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-top text-center">
            <h5 className="fw-bold text-dark mb-2">Still have questions?</h5>
            <p className="text-muted mb-3">Can't find the answer you're looking for? Please chat to our friendly team.</p>
            <a href={`mailto:${siteConfig.developer.email}`} className="btn btn-primary-clean">
              Get in Touch
            </a>
          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}

export default FAQ;
