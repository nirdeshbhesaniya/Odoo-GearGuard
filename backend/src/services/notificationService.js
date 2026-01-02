const Notification = require('../models/Notification');

/**
 * Create a notification
 * @param {Object} data - Notification data
 */
exports.createNotification = async (data) => {
  try {
    const notification = await Notification.create(data);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

/**
 * Send email notification (stub for future implementation)
 * @param {Object} data - Email data
 */
exports.sendEmail = async (data) => {
  try {
    // TODO: Implement email sending with nodemailer
    console.log('Email would be sent:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
