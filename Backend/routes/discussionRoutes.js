import express from "express";
import { getDiscussions, createDiscussion } from "../controllers/discussionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/discussions
router.get("/", getDiscussions);

// POST /api/discussions
router.post("/", authMiddleware, createDiscussion);

export default router;
