import Notification from "../models/Notification.js";

// POST /api/notification/create (Admin only)
export const createNotification = async (req, res) => {
  try {
    const { message, branch } = req.body;
    const note = await Notification.create({ message, branch });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/notification/:branch
export const getNotifications = async (req, res) => {
  try {
    const data = await Notification.find({ branch: req.params.branch });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
