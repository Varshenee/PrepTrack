import express from "express";
import { getLeaderboard, updateLeaderboard } from "../controllers/leaderboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authMiddleware, getLeaderboard);
router.post("/update", authMiddleware, updateLeaderboard);
export default router;
