import Result from "../models/Result.js";

// POST /api/result/upload
export const uploadResult = async (req, res) => {
  try {
    const { studentId, subject, marks, percentage } = req.body;
    const result = await Result.create({ studentId, subject, marks, percentage });
    res.status(201).json({ message: "Result uploaded successfully", result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/result/:studentId
export const getResults = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.params.studentId });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
