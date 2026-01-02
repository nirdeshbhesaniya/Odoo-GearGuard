const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/overview', dashboardController.getOverview);
router.get('/charts', dashboardController.getChartData);

module.exports = router;
