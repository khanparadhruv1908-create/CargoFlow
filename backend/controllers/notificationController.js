import Notification from '../models/Notification.js';

/**
 * @desc    Create a notification (Internal use)
 */
export const createNotification = async (payload, io) => {
    try {
        const notification = await Notification.create(payload);
        
        if (io) {
            // Emit to specific user room
            io.to(payload.userId.toString()).emit('new_notification', notification);
            
            // If it's a system notification, also emit to admin room
            if (payload.type === 'system') {
                io.to('admin').emit('new_notification', notification);
            }
        }
        
        return notification;
    } catch (error) {
        console.error('Notification Error:', error.message);
    }
};

/**
 * @desc    Get all notifications for current user
 */
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
            
        res.status(200).json({ success: true, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Mark notification as read
 */
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * @desc    Mark all notifications as read for current user
 */
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.user._id, isRead: false },
            { isRead: true }
        );
        res.status(200).json({ success: true, message: "All marked as read" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
