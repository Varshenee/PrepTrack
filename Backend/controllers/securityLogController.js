import SecurityLog from "../models/SecurityLog.js";

// Admin: Fetch all logs
export const getAllSecurityLogs = async (req, res) => {
  try {
    const logs = await SecurityLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(logs);
  } catch (err) {
    console.error("Get Security Logs Error:", err);
    res.status(500).json({ message: "Error fetching security logs" });
  }
};

// Utility: Add a new log (for login, reset, etc.)
export const addSecurityLog = async (userId, eventType, ipAddress, details) => {
  try {
    await SecurityLog.create({ userId, eventType, ipAddress, details });
  } catch (err) {
    console.error("Error adding security log:", err);
  }
};
