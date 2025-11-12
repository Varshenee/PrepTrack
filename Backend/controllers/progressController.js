import Progress from "../models/Progress.js";

// POST /api/progress/update → Students update their own progress
export const updateProgress = async (req, res) => {
  try {
    const { branch, progressPercent, confidence } = req.body;

    // Always use the logged-in user's ID (from JWT)
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      { branch, progressPercent, confidence, lastUpdated: Date.now() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "Progress updated successfully",
      progress,
    });
  } catch (err) {
    console.error("Update Progress Error:", err);
    res.status(500).json({ message: "Error updating progress" });
  }
};

// GET /api/progress → Students fetch their own progress
export const getUserProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user.id });
    if (!progress) {
      return res.status(404).json({ message: "No progress data found" });
    }
    res.status(200).json(progress);
  } catch (err) {
    console.error("Get User Progress Error:", err);
    res.status(500).json({ message: "Error fetching progress" });
  }
};

// GET /api/progress/all → Admin only
export const getAllProgress = async (req, res) => {
  try {
    const all = await Progress.find();
    res.status(200).json(all);
  } catch (err) {
    console.error("Get All Progress Error:", err);
    res.status(500).json({ message: "Error fetching all progress" });
  }
};
