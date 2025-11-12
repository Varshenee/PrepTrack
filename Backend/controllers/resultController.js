import Result from "../models/Result.js";
import Progress from "../models/Progress.js";

// POST /api/result/upload → Students upload exam results
export const uploadResult = async (req, res) => {
  try {
    const { subject, marks, totalMarks, examDate } = req.body;
    const studentId = req.user.role === "admin" && req.body.studentId
      ? req.body.studentId
      : req.user.id;

    if (!subject || !marks || !totalMarks) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Compute percentage automatically
    const percentage = Math.round((marks / totalMarks) * 100);

    // Create result entry
    const result = await Result.create({
      studentId: req.user.id, // use authenticated user
      subject,
      marks,
      totalMarks,
      percentage,
      uploadedAt: examDate || new Date(),
    });

    // Calculate confidence level
    const confidence =
      percentage >= 80 ? "High" : percentage >= 60 ? "Medium" : "Low";

    // Auto-update progress model
    await Progress.findOneAndUpdate(
      { userId: req.user.id },
      {
        $set: {
          progressPercent: percentage,
          confidence,
          lastUpdated: Date.now(),
        },
      },
      { upsert: true, new: true }
    );

    res.status(201).json({
      message: "✅ Result uploaded successfully and progress updated",
      result,
    });
  } catch (err) {
    console.error("Upload Result Error:", err);
    res.status(500).json({ message: "Error uploading result" });
  }
};

// GET /api/result/:studentId → Admin fetches results for a specific student
export const getResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId }).sort({
      uploadedAt: 1,
    });
    res.json(results);
  } catch (err) {
    console.error("Get Results Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/result → Students fetch their own results
export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.id }).sort({
      uploadedAt: 1,
    });
    res.status(200).json(results);
  } catch (err) {
    console.error("Get User Results Error:", err);
    res.status(500).json({ message: "Error fetching results" });
  }
};
