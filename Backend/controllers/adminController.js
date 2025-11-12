import User from "../models/User.js";
import Material from "../models/Material.js";

export const getAdminStats = async (req, res) => {
  try {
    // Total uploads and approval statuses
    const totalUploads = await Material.countDocuments();
    const approved = await Material.countDocuments({ status: "approved" });
    const pending = await Material.countDocuments({ status: "pending" });
    const rejected = await Material.countDocuments({ status: "rejected" });

    // Active uploaders (distinct users who uploaded)
    const activeUploaders = await Material.distinct("uploadedBy");

    // Total blocked users
    const blocked = await User.countDocuments({ status: "blocked" });

    // Uploads grouped by branch
    const uploadsByBranch = await Material.aggregate([
      { $group: { _id: "$branch", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      totalVerified: approved,
      activeUploaders: activeUploaders.length,
      pending,
      blocked,
      branchData: uploadsByBranch,
      approvalRate: totalUploads
        ? Math.round((approved / totalUploads) * 100)
        : 0,
    });
  } catch (err) {
    console.error("Admin Stats Error:", err);
    res.status(500).json({ message: "Error fetching admin statistics" });
  }
};
