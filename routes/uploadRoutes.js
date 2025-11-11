import express from "express";
import {
  upload,
  uploadMaterial,
  getAvailableMaterials,
  getAllMaterials
} from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin / Topper upload
router.post("/", authMiddleware, upload, uploadMaterial);

// Student - view released materials
router.get("/", authMiddleware, getAvailableMaterials);

// Admin - view all materials
router.get("/all", authMiddleware, adminOnly, getAllMaterials);

export default router;
