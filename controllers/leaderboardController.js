import Leaderboard from "../models/Leaderboard.js";

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const data = await Leaderboard.find().sort({ score: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
