import express from "express";
import {
  createNotification,
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin can publish announcements
router.post("/create", authMiddleware, adminOnly, createNotification);

// Students and admins can view announcements
router.get("/", authMiddleware, getNotifications);

// Mark as read
router.post("/:id/read", authMiddleware, markAsRead);

export default router;
