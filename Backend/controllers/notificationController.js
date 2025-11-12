import Notification from "../models/Notification.js";

// Admin creates a new announcement
export const createNotification = async (req, res) => {
  try {
    const { message, audience, priority } = req.body;
    const note = await Notification.create({
      message,
      audience,
      priority,
      createdBy: req.user.name,
    });
    res.status(201).json(note);
  } catch (err) {
    console.error("Create Notification Error:", err);
    res.status(500).json({ message: "Error creating announcement" });
  }
};

// Students get announcements
export const getNotifications = async (req, res) => {
  try {
    const userBranch = req.user.branch; // comes from JWT
    const notifications = await Notification.find({
      $or: [{ audience: "All Users" }, { audience: userBranch }],
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (err) {
    console.error("Get Notifications Error:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};
