import express from "express";
import { getDiscussions, createDiscussion } from "../controllers/discussionController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getDiscussions);
router.post("/", authMiddleware, createDiscussion);

export default router;
