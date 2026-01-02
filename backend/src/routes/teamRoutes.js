const express = require('express');
const teamController = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { canManageTeams } = require('../middleware/roleChecks');

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /teams:
 *   get:
 *     tags: [MaintenanceTeams]
 *     summary: Get all maintenance teams
 *     security:
 *       - bearerAuth: []
 */
router.get('/', teamController.getTeams);
router.get('/:id', teamController.getTeamById);

// Only admins can manage teams
router.post('/', canManageTeams, teamController.createTeam);
router.put('/:id', canManageTeams, teamController.updateTeam);
router.delete('/:id', canManageTeams, teamController.deleteTeam);

module.exports = router;
