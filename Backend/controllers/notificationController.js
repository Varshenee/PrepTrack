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
    const userId = req.user.id;
    const userBranch = req.user.branch;

    const notifications = await Notification.find({
      $or: [{ audience: "All Users" }, { audience: userBranch }],
    }).sort({ createdAt: -1 });

    //"read" property for frontend use
    const formatted = notifications.map((n) => ({
      id: n._id,
      message: n.message,
      audience: n.audience,
      priority: n.priority,
      createdBy: n.createdBy,
      createdAt: n.createdAt,
      read: n.readBy.includes(userId),
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Get Notifications Error:", err);
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Notification.findByIdAndUpdate(
      id,
      { $addToSet: { readBy: userId } }, // ✅ prevent duplicates
      { new: true }
    );

    if (!note) return res.status(404).json({ message: "Notification not found" });

    res.status(200).json({ message: "Notification marked as read" });
  } catch (err) {
    console.error("Mark Read Error:", err);
    res.status(500).json({ message: "Error marking as read" });
  }
};
