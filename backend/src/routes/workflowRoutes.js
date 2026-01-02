const express = require('express');
const workflowController = require('../controllers/workflowController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.get('/statistics', workflowController.getStatistics);
router.get('/sla-status', workflowController.getSLAStatus);

module.exports = router;
