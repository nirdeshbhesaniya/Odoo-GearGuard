const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Equipment:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - serialNumber
 *       properties:
 *         name:
 *           type: string
 *         category:
 *           type: string
 *         serialNumber:
 *           type: string
 *         manufacturer:
 *           type: string
 *         model:
 *           type: string
 *         status:
 *           type: string
 *           enum: [operational, under_maintenance, out_of_service, decommissioned]
 */

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide equipment name'],
      trim: true,
    },
    serialNumber: {
      type: String,
      required: [true, 'Please provide serial number'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide location'],
      trim: true,
    },
    purchaseDate: {
      type: Date,
      required: [true, 'Please provide purchase date'],
    },
    warrantyExpiry: {
      type: Date,
      required: [true, 'Please provide warranty expiry date'],
    },
    maintenanceTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceTeam',
      default: null,
    },
    defaultTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isScrapped: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
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

// Virtual for maintenance history
equipmentSchema.virtual('maintenanceHistory', {
  ref: 'MaintenanceRequest',
  localField: '_id',
  foreignField: 'equipment',
});

// Indexes for optimization
// equipmentSchema.index({ serialNumber: 1 }); // Already indexed by unique: true
equipmentSchema.index({ department: 1 });
equipmentSchema.index({ maintenanceTeam: 1 });
equipmentSchema.index({ isScrapped: 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);
