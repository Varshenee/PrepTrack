import express from "express";
import {
  uploadResult,
  getResults,
  getUserResults,
} from "../controllers/resultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student: fetch own results
router.get("/", authMiddleware, getUserResults);

// Admin: fetch specific student's results
router.get("/:studentId", authMiddleware, adminOnly, getResults);

// ✅ Allow both student & admin uploads
// - If admin: can upload for any student (uses studentId from body)
// - If student: automatically uses req.user.id
router.post("/upload", authMiddleware, uploadResult);

export default router;
