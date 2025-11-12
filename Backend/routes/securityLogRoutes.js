import express from "express";
import { getAllSecurityLogs } from "../controllers/securityLogController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, adminOnly, getAllSecurityLogs);

export default router;
