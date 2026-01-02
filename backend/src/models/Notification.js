const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../config/constants');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRequest',
    },
    relatedEquipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    actionUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
