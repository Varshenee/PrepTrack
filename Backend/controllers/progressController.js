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

// PREP controller

// Add new sub
export const addPrepSubject = async (req, res) => {
  try {
    const { subject, examDate, confidence } = req.body;

    const progress = await Progress.findOne({ userId: req.user.id });

    progress.prepSubjects.push({
      subject,
      examDate,
      confidence
    });

    await progress.save();

    res.status(201).json({ message: "Subject added", prepSubjects: progress.prepSubjects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding prep subject" });
  }
};

// Edit
export const updatePrepSubject = async (req, res) => {
  try {
    const { confidence, examDate } = req.body;
    const subjectId = req.params.id;

    const progress = await Progress.findOne({ userId: req.user.id });

    const sub = progress.prepSubjects.id(subjectId);

    if (!sub) return res.status(404).json({ message: "Subject not found" });

    if (confidence) sub.confidence = confidence;
    if (examDate) sub.examDate = examDate;

    await progress.save();

    res.json({ message: "Updated", prepSubjects: progress.prepSubjects });
  } catch (err) {
    res.status(500).json({ message: "Error updating subject" });
  }
};

// Delete a subject
export const deletePrepSubject = async (req, res) => {
  try {
    const subjectId = req.params.id;
    const progress = await Progress.findOne({ userId: req.user.id });

    progress.prepSubjects = progress.prepSubjects.filter(
      (sub) => sub._id.toString() !== subjectId
    );

    await progress.save();

    res.json({ message: "Deleted", prepSubjects: progress.prepSubjects });
  } catch (err) {
    res.status(500).json({ message: "Error deleting subject" });
  }
};

