import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
    branchName: { type: String, required: true },
    branchCode: { type: String, required: true },
  },
  { timestamps: true } // <-- Adds createdAt & updatedAt automatically
);

export default mongoose.model("Branch", branchSchema);
