const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const {
  UnauthorizedError,
  ConflictError,
  NotFoundError,
  BadRequestError,
} = require('../utils/AppError');
const {
  sendOTPEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
} = require('../services/emailService');

// Generate JWT Token
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE,
});

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  const {
    email, password, name, role, avatar, team,
  } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ConflictError('User with this email already exists');
  }

  // Create user
  const user = await User.create({
    email,
    password,
    name,
    role: role || 'user',
    avatar,
    team,
  });

  const token = generateToken(user._id);

  // Send welcome email (non-blocking)
  sendWelcomeEmail(user.email, user.name).catch((err) => {
    console.error('Failed to send welcome email:', err);
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        team: user.team,
      },
      token,
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if password matches
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw new UnauthorizedError('Account is inactive. Please contact administrator.');
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save();

  const token = generateToken(user._id);

  res.json({
    status: 'success',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        team: user.team,
      },
      token,
    },
  });
});

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('team', 'teamName');

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          team: user.team,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.json({
    status: 'success',
    message: 'Logged out successfully',
  });
};

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    // Implementation for refresh token
    res.json({
      status: 'success',
      message: 'Token refreshed',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new NotFoundError('No account found with that email address');
  }

  // Generate OTP
  const otp = user.generateResetOTP();
  await user.save({ validateBeforeSave: false });

  // Send OTP email
  try {
    await sendOTPEmail(user.email, user.name, otp);

    res.json({
      status: 'success',
      message: 'Password reset OTP sent to your email',
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new Error('Email could not be sent. Please try again later.');
  }
});

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new BadRequestError('Please provide email and OTP');
  }

  // Hash the provided OTP
  const hashedOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  const user = await User.findOne({
    email,
    resetPasswordOTP: hashedOTP,
    resetPasswordOTPExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError('Invalid or expired OTP');
  }

  res.json({
    status: 'success',
    message: 'OTP verified successfully',
    data: {
      email: user.email,
    },
  });
});

// @desc    Reset password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    throw new BadRequestError('Please provide email, OTP, and new password');
  }

  if (newPassword.length < 6) {
    throw new BadRequestError('Password must be at least 6 characters');
  }

  // Hash the provided OTP
  const hashedOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  const user = await User.findOne({
    email,
    resetPasswordOTP: hashedOTP,
    resetPasswordOTPExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError('Invalid or expired OTP');
  }

  // Set new password
  user.password = newPassword;
  user.resetPasswordOTP = undefined;
  user.resetPasswordOTPExpire = undefined;
  await user.save();

  // Send confirmation email
  sendPasswordChangedEmail(user.email, user.name).catch((err) => {
    console.error('Failed to send password changed email:', err);
  });

  // Generate token for auto-login
  const token = generateToken(user._id);

  res.json({
    status: 'success',
    message: 'Password reset successful',
    data: {
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        team: user.team,
      },
      token,
    },
  });
});
