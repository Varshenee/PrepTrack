import SecurityLog from "../models/SecurityLog.js";

// ====================
// GET ALL SECURITY LOGS
// ====================
export const getAllSecurityLogs = async (req, res) => {
  try {
    console.log("🔍 API HIT: /api/security-logs");

    const logs = await SecurityLog.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    console.log("📦 Logs count:", logs.length);

    res.status(200).json(logs);
  } catch (err) {
    console.error("❌ Get Security Logs Error:", err);
    res.status(500).json({ message: "Error fetching security logs" });
  }
};

// ====================
// ADD LOG (UTILITY)
// ====================
export const addSecurityLog = async (userId, eventType, ipAddress, details) => {
  try {
    console.log("🟦 ADDING SECURITY LOG:", { userId, eventType });

    const log = await SecurityLog.create({
      userId,
      eventType,
      ipAddress,
      details,
    });

    console.log("🟩 SECURITY LOG SAVED:", log._id);
  } catch (err) {
    console.error("❌ Error adding security log:", err.message);
  }
};
