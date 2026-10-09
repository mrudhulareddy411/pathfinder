const express = require("express");
const router = express.Router();
const {
  getUserActivities,
  getCalendar,
  getActivitiesForDay,
  getStreakMetrics,
  completeActivity,
  getEvents,
  createEvent,
  deleteEvent,
} = require("../controllers/calendarController");
const { protect } = require("../middleware/authMiddleware");

router.get("/activity", protect, getUserActivities);
router.post("/activity", protect, completeActivity);
router.post("/activity/complete", protect, completeActivity);
router.get("/calendar", protect, getCalendar);
router.get("/activity/day/:date", protect, getActivitiesForDay);
router.get("/streak", protect, getStreakMetrics);

router.get("/calendar/events", protect, getEvents);
router.post("/calendar/events", protect, createEvent);
router.delete("/calendar/events/:id", protect, deleteEvent);

module.exports = router;
