const express = require("express");
const router = express.Router();
const {
  getUserActivities,
  getCalendar,
  getActivitiesForDay,
  getStreakMetrics,
  completeActivity,
} = require("../controllers/calendarController");
const { protect } = require("../middleware/authMiddleware");

router.get("/activity", protect, getUserActivities);
router.post("/activity", protect, completeActivity);
router.post("/activity/complete", protect, completeActivity);
router.get("/calendar", protect, getCalendar);
router.get("/activity/day/:date", protect, getActivitiesForDay);
router.get("/streak", protect, getStreakMetrics);

module.exports = router;
