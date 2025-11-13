import Progress from "../models/Progress.js";

// POST /api/progress/update → Students update their progress
export const updateProgress = async (req, res) => {
  try {
    const { branch, progressPercent, confidence } = req.body;

    // Determine confidence if not provided
    const autoConfidence =
      confidence ||
      (progressPercent >= 80
        ? "High"
        : progressPercent >= 60
        ? "Medium"
        : "Low");

    // Always use logged-in user's ID (from JWT)
    const progress = await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        branch,
        progressPercent,
        confidence: autoConfidence,
        lastUpdated: Date.now(),
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      message: "✅ Progress updated successfully",
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
    let progress = await Progress.findOne({ userId: req.user.id });

    // Auto-create a base record if not found
    if (!progress) {
      progress = await Progress.create({
        userId: req.user.id,
        branch: req.user.branch || "General",
        progressPercent: 0,
        confidence: "Medium",
      });
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
