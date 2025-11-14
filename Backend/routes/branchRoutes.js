import express from "express";
import { addBranch, getBranches, deleteBranch } from "../controllers/branchController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✔ Students + Admins can VIEW branches
router.get("/", authMiddleware, getBranches);

// ✔ Only Admins can ADD branches
router.post("/add", authMiddleware, adminOnly, addBranch);

// ✔ Only Admins can DELETE branches
router.delete("/:id", authMiddleware, adminOnly, deleteBranch);

export default router;
