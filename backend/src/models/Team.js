const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceTeam:
 *       type: object
 *       required:
 *         - teamName
 *       properties:
 *         teamName:
 *           type: string
 *         members:
 *           type: array
 *           items:
 *             type: string
 */

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: [true, 'Please provide team name'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    teamLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for assigned requests
teamSchema.virtual('assignedRequests', {
  ref: 'MaintenanceRequest',
  localField: '_id',
  foreignField: 'assignedTeam',
});

// Indexes
teamSchema.index({ name: 1 });
teamSchema.index({ isActive: 1 });

module.exports = mongoose.model('MaintenanceTeam', teamSchema);
