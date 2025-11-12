import Leaderboard from "../models/Leaderboard.js";
import User from "../models/User.js";

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const data = await Leaderboard.find().sort({ score: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error("Get Leaderboard Error:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
};

// POST /api/leaderboard/update
export const updateLeaderboard = async (req, res) => {
  try {
    const { studentId, points } = req.body;
    const entry = await Leaderboard.findOneAndUpdate(
      { studentId },
      { $inc: { score: points } },
      { upsert: true, new: true }
    );
    res.status(200).json(entry);
  } catch (err) {
    console.error("Update Leaderboard Error:", err);
    res.status(500).json({ message: "Error updating leaderboard" });
  }
};

// GET /api/leaderboard/admin
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

// PUT /api/leaderboard/flag
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
