import express from "express";
import { uploadResult, getResults } from "../controllers/resultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/upload", authMiddleware, uploadResult);
router.get("/:studentId", authMiddleware, getResults);
export default router;
