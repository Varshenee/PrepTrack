import express from "express";
import {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  addComment
} from "../controllers/discussionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: List all
router.get("/", getDiscussions);

// Public: Get one discussion
router.get("/:id", getDiscussionById);

// Students: Create discussion
router.post("/", authMiddleware, createDiscussion);

// Students: Add comment
router.post("/:id/comment", authMiddleware, addComment);

export default router;
