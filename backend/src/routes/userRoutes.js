const express = require('express');
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { canManageUsers } = require('../middleware/roleChecks');
const { USER_ROLES } = require('../config/constants');

const router = express.Router();

// Protect all routes
router.use(protect);

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), userController.getUsers);
router.get('/:id', userController.getUserById);

// Own profile routes (any authenticated user)
router.put('/profile', userController.updateProfile);
router.put('/password', userController.updatePassword);

// User management routes (admin/manager can create, only admin can delete)
router.post('/', authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), userController.createUser);
router.put('/:id', authorize(USER_ROLES.ADMIN, USER_ROLES.MANAGER), userController.updateUser);
router.delete('/:id', canManageUsers, userController.deleteUser);

module.exports = router;
