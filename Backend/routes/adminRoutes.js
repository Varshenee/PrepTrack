import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, adminOnly, getAdminStats);

export default router;
