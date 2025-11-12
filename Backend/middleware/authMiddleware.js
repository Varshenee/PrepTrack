import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Store decoded info on req.user
    req.user = {
      id: decoded.id,
      role: decoded.role,
      branch: decoded.branch,
    };

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(400).json({ message: "Invalid Token" });
  }
};
