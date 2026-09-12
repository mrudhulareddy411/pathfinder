import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Challenges() {
  const [user, setUser] = useState(null);
  const [completed, setCompleted] = useState({});

  const challenges = [
    {
      id: "c1",
      title: "Data Structures & Time Complexity",
      description: "Analyze the time complexity of searching an item in a balanced Binary Search Tree vs an Array.",
      type: "DAILY",
      difficulty: "Intermediate",
      skill: "Data Structures",
      xpReward: 100,
    },
    {
      id: "c2",
      title: "SQL Joins & Aggregations",
      description: "Write a SQL query retrieving students with GPA > 8.0 joined with their academic department stats.",
      type: "WEEKLY",
      difficulty: "Intermediate",
      skill: "SQL",
      xpReward: 200,
    },
    {
      id: "c3",
      title: "Aptitude & Quantitative Logic",
      description: "Solve 5 speed-distance ratio problems simulating campus placement rounds.",
      type: "WEEKLY",
      difficulty: "Beginner",
      skill: "Quantitative Logic",
      xpReward: 150,
    },
  ];

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

  const completedActSet = new Set((user?.completedActivities || []).map((a) => a.activityId || a.title));

  const handleCompleteChallenge = async (c) => {
    try {
      setCompleted((prev) => ({ ...prev, [c.id]: "recording" }));
      const res = await api.post("/activity/complete", {
        activityId: c.id,
        activityType: "CHALLENGE_COMPLETED",
        title: c.title,
        xpEarned: c.xpReward,
      });

      if (res.data?.user) {
        setUser(res.data.user);
      }
      setCompleted((prev) => ({ ...prev, [c.id]: "done" }));
    } catch (err) {
      console.error("Complete challenge error:", err);
      setCompleted((prev) => ({ ...prev, [c.id]: "done" }));
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
              <span className="badge badge-clean-blue mb-2">Skill Assessment Challenges</span>
              <h2 className="fw-bold text-dark mb-1" style={{ fontSize: "1.75rem" }}>
                Practice Challenges
              </h2>
              <p className="text-secondary small mb-0">
                Sharpen technical problem-solving capabilities and prepare for technical placement assessments.
              </p>
            </div>
          </div>
        </div>

        {/* CHALLENGES GRID */}
        <div className="row g-4 mb-4">
          {challenges.map((c) => {
            const isDone = completedActSet.has(c.id) || completed[c.id] === "done";
            const isRecording = completed[c.id] === "recording";

            return (
              <div className="col-12 col-md-6 col-lg-4" key={c.id}>
                <div className="p-4 clean-card-flat bg-white h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge badge-clean-blue extra-small">{c.type}</span>
                      <span className="badge badge-clean-green extra-small">+{c.xpReward} XP</span>
                    </div>

                    <h6 className="fw-bold text-dark mb-1">{c.title}</h6>
                    <div className="extra-small text-secondary mb-2">Skill: {c.skill} • {c.difficulty}</div>
                    <p className="text-secondary extra-small mb-3" style={{ minHeight: "44px" }}>
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-3 border-top">
                    {isDone ? (
                      <button className="btn btn-success btn-sm w-100 justify-content-center text-dark" disabled>
                        ✓ Completed (+{c.xpReward} XP)
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary-clean btn-sm w-100 justify-content-center"
                        onClick={() => handleCompleteChallenge(c)}
                        disabled={isRecording}
                      >
                        {isRecording ? "Recording..." : `Solve Challenge (+${c.xpReward} XP)`}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Challenges;
