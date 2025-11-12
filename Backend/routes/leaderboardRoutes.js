import express from "express";
import {
  getLeaderboard,
  updateLeaderboard,
  getAdminLeaderboard,
  flagUser,
} from "../controllers/leaderboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Student routes
router.get("/", authMiddleware, getLeaderboard);
router.post("/update", authMiddleware, updateLeaderboard);

// Admin-only routes
router.get("/admin", authMiddleware, adminOnly, getAdminLeaderboard);
router.put("/flag", authMiddleware, adminOnly, flagUser);

export default router;
