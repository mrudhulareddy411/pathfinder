import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "../styles/splash.css";

function Splash() {

  const navigate = useNavigate();

  return (

    <div className="splash">

      <motion.div
        className="glass-card"
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >

        <h1>🚀 PathFinder AI</h1>

        <h3>Your Smart Student Companion</h3>

        <p>
          Career Guidance • Learning Roadmaps • Resume Builder •
          Placement Preparation • AI Mentor
        </p>

        <button
          className="start-btn"
          onClick={() => navigate("/login")}
        >
          Get Started
        </button>

      </motion.div>

    </div>

  );
}

export default Splash;