import Material from "../models/Material.js";
import multer from "multer";

// 1. MULTER SETUP - Handles file upload and naming
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder to store files
  },
  filename: (req, file, cb) => {
    // Example filename: 1700000000000-notes.pdf
    cb(null, Date.now() + "-" + file.originalname);
  }
});

export const upload = multer({ storage }).single("file");


// 2. UPLOAD MATERIAL - Admin or Topper uploads files
export const uploadMaterial = async (req, res) => {
  try {
    const { title, branch, type, uploadedBy, examDate } = req.body;

    // Validate file presence
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Compute release date logic
    let releaseDate = new Date();
    if (examDate) {
      const exam = new Date(examDate);
      if (type === "note" || type === "ppt") {
        releaseDate = new Date(exam.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before
      } else if (type === "pyq") {
        releaseDate = new Date(exam.getTime() - 2 * 24 * 60 * 60 * 1000); // 2 days before
      }
    }

    // Save metadata to MongoDB
    const material = await Material.create({
      title,
      branch,
      type,
      filePath: req.file.path,
      uploadedBy,
      releaseDate
    });

    res.status(201).json({
      message: "File uploaded successfully",
      material
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error uploading material", error: err.message });
  }
};


// 3. GET AVAILABLE MATERIALS - For students
export const getAvailableMaterials = async (req, res) => {
  try {
    // Only show materials from the student's branch
    // and only after the release date has passed
    const materials = await Material.find({
      branch: req.user.branch,
      releaseDate: { $lte: Date.now() }
    }).sort({ releaseDate: -1 });

    res.status(200).json(materials);
  } catch (err) {
    console.error("Fetch Materials Error:", err);
    res.status(500).json({ message: "Error fetching materials", error: err.message });
  }
};


// 4. (OPTIONAL) GET ALL MATERIALS - For admin panel
export const getAllMaterials = async (req, res) => {
  try {
    const allMaterials = await Material.find().sort({ uploadedAt: -1 });
    res.status(200).json(allMaterials);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all materials", error: err.message });
  }
};
