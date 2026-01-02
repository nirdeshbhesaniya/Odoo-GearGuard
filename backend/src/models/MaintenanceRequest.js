const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceRequest:
 *       type: object
 *       required:
 *         - subject
 *         - requestType
 *         - equipment
 *       properties:
 *         subject:
 *           type: string
 *         requestType:
 *           type: string
 *           enum: [Corrective, Preventive]
 *         status:
 *           type: string
 *           enum: [New, In Progress, Repaired, Scrap]
 */

const maintenanceRequestSchema = new mongoose.Schema(
  {
    requestNumber: {
      type: String,
      unique: true,
      required: true,
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    requestType: {
      type: String,
      enum: ['Corrective', 'Preventive'],
      required: [true, 'Please specify request type'],
    },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Repaired', 'Scrap'],
      default: 'New',
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: [true, 'Please specify equipment'],
    },
    maintenanceTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
      default: null,
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    scheduledDate: {
      type: Date,
      required: [true, 'Please provide scheduled date'],
    },
    durationHours: {
      type: Number,
      min: [0, 'Duration cannot be negative'],
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
    },
    statusHistory: [
      {
        status: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        notes: String,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual for comments
maintenanceRequestSchema.virtual('comments', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'request',
});

// Indexes for optimization
// maintenanceRequestSchema.index({ requestNumber: 1 }); // Already indexed by unique: true
maintenanceRequestSchema.index({ status: 1 });
maintenanceRequestSchema.index({ requestType: 1 });
maintenanceRequestSchema.index({ equipment: 1 });
maintenanceRequestSchema.index({ maintenanceTeam: 1 });
maintenanceRequestSchema.index({ assignedTechnician: 1 });
maintenanceRequestSchema.index({ scheduledDate: 1 });
maintenanceRequestSchema.index({ createdBy: 1 });
maintenanceRequestSchema.index({ createdAt: -1 });

// Compound index for Kanban queries (status + team + type)
maintenanceRequestSchema.index({ status: 1, maintenanceTeam: 1, requestType: 1 });

// Compound index for calendar queries (scheduledDate + requestType)
maintenanceRequestSchema.index({ scheduledDate: 1, requestType: 1 });

// Pre-save hook to generate request number
maintenanceRequestSchema.pre('save', async function (next) {
  if (!this.requestNumber) {
    const count = await this.constructor.countDocuments();
    const prefix = this.requestType === 'Corrective' ? 'CR' : 'PM';
    this.requestNumber = `${prefix}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);
