import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";

// GET /api/leaderboard — For students & general users
export const getLeaderboard = async (req, res) => {
  try {
    const data = await Leaderboard.find()
      .populate("studentId", "name branch email") 
      .sort({ score: -1 });

    // Format response for the frontend
    const formatted = data.map((entry, index) => ({
      name: entry.studentId?.name || "Unknown",
      branch: entry.studentId?.branch || "—",
      contributions: entry.contributions || 0,
      score: entry.score || 0,
      rank: index + 1,
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error("Get Leaderboard Error:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

// POST /api/leaderboard/update 
export const updateLeaderboard = async (req, res) => {
  try {
    const { studentId, points } = req.body;

    // Ensure the user exists before updating
    const user = await User.findById(studentId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const entry = await Leaderboard.findOneAndUpdate(
      { studentId },
      { $inc: { score: points, contributions: 1 } },
      { upsert: true, new: true }
    ).populate("studentId", "name branch");

    res.status(200).json({
      message: "Leaderboard updated successfully",
      entry,
    });
  } catch (err) {
    console.error("Update Leaderboard Error:", err);
    res.status(500).json({ message: "Error updating leaderboard" });
  }
};

// GET /api/leaderboard/admin — For admin dashboard
export const getAdminLeaderboard = async (req, res) => {
  try {
    const data = await Leaderboard.find()
      .populate("studentId", "name email branch createdAt")
      .sort({ score: -1 });

    res.status(200).json(data);
  } catch (err) {
    console.error("Get Admin Leaderboard Error:", err);
    res.status(500).json({ message: "Error fetching admin leaderboard" });
  }
};

// PUT /api/leaderboard/flag — Admin flagging users
export const flagUser = async (req, res) => {
  try {
    const { studentId, flagged } = req.body;

    const entry = await Leaderboard.findOneAndUpdate(
      { studentId },
      { flagged },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: "User not found in leaderboard" });
    }

    res.status(200).json({ message: "User flag status updated", entry });
  } catch (err) {
    console.error("Flag User Error:", err);
    res.status(500).json({ message: "Error flagging user" });
  }
};
