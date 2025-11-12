import express from "express";
import { uploadResult, getResults, getUserResults } from "../controllers/resultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student: get own results
router.get("/", authMiddleware, getUserResults);

// Admin: view specific student's results
router.get("/:studentId", authMiddleware, adminOnly, getResults);

// Admin: upload results for any student
router.post("/upload", authMiddleware, adminOnly, uploadResult);

export default router;
