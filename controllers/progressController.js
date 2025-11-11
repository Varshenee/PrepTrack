import Progress from "../models/Progress.js";

export const updateProgress = async (req, res) => {
  const { userId, branch, progressPercent, confidence } = req.body;
  const progress = await Progress.findOneAndUpdate(
    { userId },
    { branch, progressPercent, confidence, lastUpdated: Date.now() },
    { upsert: true, new: true }
  );
  res.json(progress);
};

export const getAllProgress = async (req, res) => {
  const all = await Progress.find();
  res.json(all);
};
