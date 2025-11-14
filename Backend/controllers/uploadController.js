import multer from "multer";
import bucket from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";
import Material from "../models/Material.js";
import fetch from "node-fetch";

// Multer storage in memory
const storage = multer.memoryStorage();
export const upload = multer({ storage }).single("file");

// ===============================
// UPLOAD MATERIAL
// ===============================
export const uploadMaterial = async (req, res) => {
  try {
    const { title, branch, type, uploadedBy, examDate } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    await file.save(req.file.buffer, {
      metadata: {
        contentType: req.file.mimetype,
        metadata: { firebaseStorageDownloadTokens: uuidv4() },
      },
      public: true,
    });

    const fileUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;

    // auto release logic
    let releaseDate = new Date();
    if (examDate) {
      const exam = new Date(examDate);
      if (type === "note" || type === "ppt") {
        releaseDate = new Date(exam.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (type === "pyq") {
        releaseDate = new Date(exam.getTime() - 2 * 24 * 60 * 60 * 1000);
      }
    }

    // save metadata
    const material = await Material.create({
      title,
      branch,
      type,
      uploadedBy,
      releaseDate,
      fileUrl,
      status: "pending", // ALWAYS pending first
    });

    // leaderboard logic
    let points = 10;
    if (type === "pyq") points = 15;
    else if (type === "ppt") points = 8;

    try {
      await fetch(`${process.env.BACKEND_URL || "http://localhost:5000"}/api/leaderboard/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: req.header("Authorization"),
        },
        body: JSON.stringify({
          studentId: req.user.id,
          points,
        }),
      });
    } catch (err) {
      console.error("⚠️ Leaderboard update failed:", err.message);
    }

    res.status(201).json({
      message: "Uploaded successfully!",
      material,
    });

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Error uploading material", error: err.message });
  }
};

// ===============================
// STUDENT: GET AVAILABLE MATERIALS
// ===============================
export const getAvailableMaterials = async (req, res) => {
  try {
    const materials = await Material.find({
      branch: req.user.branch,

      // Students can see ONLY: pending, approved, revision
      status: { $in: ["approved", "pending", "revision"] },

      releaseDate: { $lte: Date.now() },
    }).sort({ releaseDate: -1 });

    res.status(200).json(materials);
  } catch (err) {
    console.error("Fetch Materials Error:", err);
    res.status(500).json({ message: "Error fetching materials" });
  }
};

// ===============================
// ADMIN: GET ALL MATERIALS
// ===============================
export const getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ createdAt: -1 });
    res.status(200).json(materials);
  } catch (err) {
    console.error("Get All Materials Error:", err);
    res.status(500).json({ message: "Error fetching all materials" });
  }
};

// ===============================
// ADMIN: UPDATE MATERIAL STATUS
// ===============================
export const updateMaterialStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const updated = await Material.findByIdAndUpdate(
      id,
      { status, reviewNotes },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Material not found" });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Material Status Error:", err);
    res.status(500).json({ message: "Error updating material status" });
  }
};
