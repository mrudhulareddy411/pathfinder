/**
 * Calculates dynamic Job Readiness score & Next Best Action based strictly on real user data.
 */
const calculateJobReadiness = (userProfile = {}, targetCareer = null) => {
  const skills = Array.isArray(userProfile.skills) ? userProfile.skills : [];
  const assessment = userProfile.assessment || null;
  const completedActivities = Array.isArray(userProfile.completedActivities) ? userProfile.completedActivities : [];
  const selectedCareer = targetCareer || userProfile.selectedCareerDetails || null;

  // Requirement 14: If information is unavailable, show "Not enough data yet."
  if (!userProfile || (skills.length === 0 && !assessment && !selectedCareer)) {
    return {
      hasEnoughData: false,
      score: 0,
      readinessTier: "Unassessed",
      message: "Not enough data yet.",
      breakdown: {
        assessmentScore: 0,
        skillGapScore: 0,
        activityProgressScore: 0,
        resumeScore: 0,
      },
      nextBestAction: {
        title: "Take Pathfinder Career Assessment",
        description: "Complete your technical & domain assessment to run live Random Forest ML model career matching.",
        actionUrl: "/assessment",
        actionText: "🎯 Take Assessment",
      },
    };
  }

  // 1. Assessment & Profile Completion (Max 20 pts)
  let assessmentScore = 0;
  if (userProfile.profileCompleted || (userProfile.college && userProfile.branch)) assessmentScore += 10;
  if (assessment && Object.keys(assessment).length > 0) assessmentScore += 10;

  // 2. Skill Gap Alignment (Max 35 pts)
  let skillGapScore = 0;
  let missingSkills = [];
  let matchedSkills = [];

  if (selectedCareer && Array.isArray(selectedCareer.requiredSkills) && selectedCareer.requiredSkills.length > 0) {
    const reqSkills = selectedCareer.requiredSkills;
    const userSkillSet = new Set(skills.map((s) => String(s).toLowerCase().trim()));

    matchedSkills = reqSkills.filter((s) => userSkillSet.has(String(s).toLowerCase().trim()));
    missingSkills = reqSkills.filter((s) => !userSkillSet.has(String(s).toLowerCase().trim()));

    const matchRatio = matchedSkills.length / reqSkills.length;
    skillGapScore = Math.round(matchRatio * 35);
  } else if (skills.length > 0) {
    skillGapScore = Math.min(25, skills.length * 4);
  }

  // 3. Roadmap & Activity Progress (Max 30 pts)
  const activityProgressScore = Math.min(30, completedActivities.length * 6);

  // 4. Resume Readiness (Max 15 pts)
  let resumeScore = 0;
  if (userProfile.college && userProfile.branch && userProfile.educationLevel) resumeScore += 5;
  if (skills.length >= 3) resumeScore += 5;
  if (completedActivities.length > 0 || selectedCareer) resumeScore += 5;

  const totalScore = Math.min(100, assessmentScore + skillGapScore + activityProgressScore + resumeScore);

  let readinessTier = "Beginner";
  if (totalScore >= 80) readinessTier = "Job Ready (Placement Ready)";
  else if (totalScore >= 60) readinessTier = "Advanced Practitioner";
  else if (totalScore >= 40) readinessTier = "Intermediate Learner";

  // Requirement 13: Next Best Action based on largest current skill gap or incomplete roadmap milestone
  let nextBestAction = null;

  if (!assessment) {
    nextBestAction = {
      title: "Take Pathfinder Career Assessment",
      description: "Complete your technical & domain assessment to run live Random Forest ML model career matching.",
      actionUrl: "/assessment",
      actionText: "🎯 Take Assessment",
    };
  } else if (!selectedCareer) {
    nextBestAction = {
      title: "Select Target Career Path",
      description: "Review top O*NET ML recommendation rankings and choose your target career.",
      actionUrl: "/career-pathfinder",
      actionText: "🧭 Explore Career Recommendations",
    };
  } else if (missingSkills.length > 0) {
    const largestGapSkill = missingSkills[0];
    nextBestAction = {
      title: `Master ${largestGapSkill} (Top Skill Gap)`,
      description: `Closing your ${largestGapSkill} gap for ${selectedCareer.title || "Target Career"} will increase your job readiness score.`,
      actionUrl: `/resources?skill=${encodeURIComponent(largestGapSkill)}`,
      actionText: `📖 Learn ${largestGapSkill}`,
    };
  } else if (completedActivities.length < 5) {
    const careerId = selectedCareer.onetCode || selectedCareer.id || selectedCareer._id || selectedCareer.title;
    nextBestAction = {
      title: "Complete Level 1 Roadmap Milestone",
      description: `Engage in interactive learning modules for ${selectedCareer.title || "your career path"}.`,
      actionUrl: `/career/details/${encodeURIComponent(careerId)}`,
      actionText: "🗺️ View Career Roadmap",
    };
  } else {
    nextBestAction = {
      title: "Generate ATS Resume & Apply",
      description: "Your skills and roadmap progress are strong! Auto-import your profile into ATS resume templates.",
      actionUrl: "/resume/builder",
      actionText: "📄 Build Resume Now",
    };
  }

  return {
    hasEnoughData: true,
    score: totalScore,
    readinessTier,
    targetCareerTitle: selectedCareer ? selectedCareer.title : "Not Selected",
    matchedSkillsCount: matchedSkills.length,
    missingSkillsCount: missingSkills.length,
    completedActivitiesCount: completedActivities.length,
    breakdown: {
      assessmentScore,
      skillGapScore,
      activityProgressScore,
      resumeScore,
    },
    nextBestAction,
  };
};

module.exports = { calculateJobReadiness };
