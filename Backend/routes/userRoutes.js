import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Admin-only route
router.get("/all", authMiddleware, adminOnly, getAllUsers);

export default router;
