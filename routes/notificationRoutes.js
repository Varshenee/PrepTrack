import express from "express";
import { createNotification, getNotifications } from "../controllers/notificationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();
router.post("/create", authMiddleware, adminOnly, createNotification);
router.get("/:branch", authMiddleware, getNotifications);
export default router;
