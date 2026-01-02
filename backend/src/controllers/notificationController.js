const Notification = require('../models/Notification');
const { paginate } = require('../utils/pagination');

// @desc    Get notifications
// @route   GET /api/notifications
// @access  Private
exports.getNotifications = async (req, res, next) => {
  try {
    const { page, limit, isRead } = req.query;

    const filter = { recipient: req.user.id };
    if (isRead !== undefined) filter.isRead = isRead === 'true';

    const result = await paginate(Notification, filter, {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 20,
      populate: 'relatedRequest relatedEquipment',
      sort: '-createdAt',
    });

    res.json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unread count
// @route   GET /api/notifications/unread-count
// @access  Private
exports.getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });

    res.json({
      status: 'success',
      data: { count },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark as read
// @route   PATCH /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user.id },
      { isRead: true, readAt: Date.now() },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found',
      });
    }

    res.json({
      status: 'success',
      data: { notification },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all as read
// @route   PATCH /api/notifications/mark-all-read
// @access  Private
exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: Date.now() },
    );

    res.json({
      status: 'success',
      message: 'All notifications marked as read',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        status: 'error',
        message: 'Notification not found',
      });
    }

    res.json({
      status: 'success',
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
