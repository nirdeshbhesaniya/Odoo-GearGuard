const express = require('express');
const equipmentController = require('../controllers/equipmentController');
const { protect } = require('../middleware/auth');
const { canManageEquipment } = require('../middleware/roleChecks');

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /equipment:
 *   get:
 *     tags: [Equipment]
 *     summary: Get all equipment
 *     security:
 *       - bearerAuth: []
 */
router.get('/', equipmentController.getEquipment);
router.get('/:id', equipmentController.getEquipmentById);
router.get('/:id/history', equipmentController.getMaintenanceHistory);

// Only managers and admins can create/update/delete equipment
router.post('/', canManageEquipment, equipmentController.createEquipment);
router.put('/:id', canManageEquipment, equipmentController.updateEquipment);
router.delete('/:id', canManageEquipment, equipmentController.deleteEquipment);

module.exports = router;
