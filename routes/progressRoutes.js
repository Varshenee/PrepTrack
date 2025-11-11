import express from "express";
import { updateProgress, getAllProgress } from "../controllers/progressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
const router = express.Router();

router.post("/update", authMiddleware, updateProgress);
router.get("/all", authMiddleware, adminOnly, getAllProgress);

export default router;
