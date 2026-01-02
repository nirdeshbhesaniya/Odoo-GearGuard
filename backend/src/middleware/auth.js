const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { UnauthorizedError, ForbiddenError } = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Protect routes - verify JWT token
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new UnauthorizedError('Not authorized to access this route. Please login.');
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Get user from token
  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    throw new UnauthorizedError('User no longer exists. Please login again.');
  }

  if (!req.user.isActive) {
    throw new UnauthorizedError('User account is inactive. Please contact administrator.');
  }

  next();
});

// Authorize based on roles
exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ForbiddenError(
      `User role '${req.user.role}' is not authorized to access this route. Required roles: ${roles.join(', ')}`,
    );
  }
  next();
};
