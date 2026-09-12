import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import LevelMap from "../components/LevelMap";
import XPBar from "../components/XPBar";

function CareerJourney() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <div style={{ background: "#07111f", minHeight: "100vh" }}>
      <Navbar user={user} />
      <div className="container py-5">
        <div className="mb-4">
          <h2 className="fw-bold text-dark mb-1">Career Journey Progression 🗺️</h2>
          <p className="text-secondary small">
            Visual level-based path guiding your transition from Student to Career Ready Professional.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5 text-light">Loading journey path...</div>
        ) : (
          <div>
            <XPBar xp={user?.xp || 150} levelNumber={user?.levelNumber || 2} />
            <LevelMap currentLevel={user?.levelNumber || 2} careerTitle={user?.careerInterests?.[0] || "Software Engineering Journey"} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CareerJourney;
