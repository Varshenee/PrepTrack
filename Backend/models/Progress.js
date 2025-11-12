import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  branch: { type: String, default: "General" },
  progressPercent: { type: Number, default: 0 },
  confidence: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.models.Progress || mongoose.model("Progress", progressSchema);
