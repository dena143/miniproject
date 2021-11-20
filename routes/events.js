const express = require("express");

// Import controller
const {
  getAllEvents,
  getEventByCategory,
  searchEvent,
  getAllEventsByToday,
  getAllEventsByTomorrow,
  getAllEventsByWeek,
  getAllEventsByMonth,
  getAllEventsByYear,
  getEventsSortingByName,
  getEventsSortingByDate,
  getDetailEvent,
} = require("../controllers/events");

// Import router
const router = express.Router();

router.get("/", getAllEvents);

router.get("/cari", searchEvent);

router.get("/cat/:id", getEventByCategory);

router.get("/tody", getAllEventsByToday);

router.get("/tomorrow", getAllEventsByTomorrow);

router.get("/we", getAllEventsByWeek);

router.get("/month", getAllEventsByMonth);

router.get("/year", getAllEventsByYear);

router.get("/name", getEventsSortingByName);

router.get("/date", getEventsSortingByDate);

router.get("/:id", getDetailEvent);

// Export router
module.exports = router;
