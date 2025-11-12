import express from "express";
import {
  upload,
  uploadMaterial,
  getAvailableMaterials,
  getAllMaterials,
  updateMaterialStatus,
} from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload, uploadMaterial);
router.get("/", authMiddleware, getAvailableMaterials);

// Admin-only routes
router.get("/all", authMiddleware, adminOnly, getAllMaterials);
router.put("/:id/status", authMiddleware, adminOnly, updateMaterialStatus);

export default router;
