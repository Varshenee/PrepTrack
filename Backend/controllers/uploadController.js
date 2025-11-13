import multer from "multer";
import bucket from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import Material from "../models/Material.js";
import fetch from "node-fetch";

// Configure multer to hold files in memory before sending to Firebase
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("file");

// Controller to upload materials to Firebase
export const uploadMaterial = async (req, res) => {
  try {
    const { title, branch, type, uploadedBy, examDate } = req.body;

    // File validation
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create a unique filename
    const filename = `${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    // Upload file buffer to Firebase Storage
    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: { firebaseStorageDownloadTokens: uuidv4() },
      },
      public: true,
    });

    // Generate a public URL for the file
    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    // Calculate releaseDate (auto release logic)
    let releaseDate = new Date();
    if (examDate) {
      const exam = new Date(examDate);
      if (type === "note" || type === "ppt") {
        releaseDate = new Date(exam.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (type === "pyq") {
        releaseDate = new Date(exam.getTime() - 2 * 24 * 60 * 60 * 1000);
      }
    }

    // Save metadata in MongoDB
    const material = await Material.create({
      title,
      branch,
      type,
      uploadedBy,
      releaseDate,
      fileUrl, // store Firebase URL
    });

    // 🎯 Leaderboard points logic
    let points = 10; // Default points
    if (type === "pyq") points = 15;
    else if (type === "ppt") points = 8;

    try {
      // POST request to update leaderboard
      await fetch(`${process.env.BACKEND_URL || "http://localhost:5000"}/api/leaderboard/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.header("Authorization"),
        },
        body: JSON.stringify({
          studentId: req.user.id, // from decoded token
          points,
        }),
      });
    } catch (lbError) {
      console.error("⚠️ Leaderboard update failed:", lbError.message);
      // Not a fatal error — don’t break upload flow
    }

    res.status(201).json({
      message: "✅ File uploaded successfully and leaderboard updated!",
      material,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({
      message: "Error uploading material",
      error: err.message,
    });
  }
};

// Controller to get available materials (filtered by branch and release date)
export const getAvailableMaterials = async (req, res) => {
  try {
    const materials = await Material.find({
      branch: req.user.branch,
      releaseDate: { $lte: Date.now() },
    }).sort({ releaseDate: -1 });

    res.status(200).json(materials);
  } catch (err) {
    console.error("Fetch Materials Error:", err);
    res.status(500).json({ message: "Error fetching materials" });
  }
};

// Admin: Get all uploaded materials (no restrictions)
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (err) {
    console.error("Get All Materials Error:", err);
    res.status(500).json({ message: "Error fetching all materials" });
  }
};

// Admin: Update material review status
export const updateMaterialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const updated = await Material.findByIdAndUpdate(
      id,
      { status, reviewNotes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Material not found" });
    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Material Status Error:", err);
    res.status(500).json({ message: "Error updating material status" });
  }
};

