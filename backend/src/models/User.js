const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { USER_ROLES } = require('../config/constants');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - firstName
 *         - lastName
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, manager, technician, user]
 *         phone:
 *           type: string
 *         department:
 *           type: string
 *         isActive:
 *           type: boolean
 */

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
      required: [true, 'Please specify user role'],
    },
    avatar: {
      type: String,
      default: null,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordOTP: String,
    resetPasswordOTPExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Indexes for search optimization
// userSchema.index({ email: 1 }); // Already indexed by unique: true
userSchema.index({ role: 1, isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate OTP for password reset
userSchema.methods.generateResetOTP = function () {
  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP and set to resetPasswordOTP field
  this.resetPasswordOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');

  // Set expire to 10 minutes
  this.resetPasswordOTPExpire = Date.now() + 10 * 60 * 1000;

  return otp;
};

module.exports = mongoose.model('User', userSchema);
