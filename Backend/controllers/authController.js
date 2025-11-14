import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { addSecurityLog } from "./securityLogController.js";

// =============================
// REGISTER USER
// =============================
export const register = async (req, res) => {
  try {
    const { name, email, rollNumber, branch, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      rollNumber,
      branch,
      role: role || "student",
      password: hashed,
    });

    //SECURITY LOG — Registration
    await addSecurityLog(
      user._id,
      "Admin Action",
      req.ip,
      `New account registered (${user.email})`
    );

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        branch: user.branch,
        rollNumber: user.rollNumber,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(400).json({ message: err.message });
  }
};

// =============================
// LOGIN USER
// =============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      // SECURITY LOG — Login failure: email not found
      await addSecurityLog(null, "Login Failure", req.ip, `Email not found: ${email}`);
      return res.status(400).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      // SECURITY LOG — Wrong password
      await addSecurityLog(user._id, "Login Failure", req.ip, "Wrong password");
      return res.status(400).json({ message: "Invalid password" });
    }

    // SECURITY LOG — Successful login
    await addSecurityLog(user._id, "Login Success", req.ip, "User logged in");

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        branch: user.branch,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      branch: user.branch,
      name: user.name,
      email: user.email,
      rollNumber: user.rollNumber,
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// =============================
// GET CURRENT USER PROFILE
// =============================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// =============================
// UPDATE USER PROFILE
// =============================
export const updateProfile = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    // SECURITY LOG — Profile update
    await addSecurityLog(req.user.id, "Admin Action", req.ip, "Profile updated");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
