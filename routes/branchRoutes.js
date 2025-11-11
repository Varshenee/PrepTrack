import express from "express";
import { addBranch, getBranches } from "../controllers/branchController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";
const router = express.Router();

router.post("/add", authMiddleware, adminOnly, addBranch);
router.get("/", authMiddleware, adminOnly, getBranches);

export default router;
