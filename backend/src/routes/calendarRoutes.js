const express = require('express');
const calendarController = require('../controllers/calendarController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/events', calendarController.getCalendarEvents);
router.get('/availability', calendarController.getTeamAvailability);

module.exports = router;
