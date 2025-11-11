import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  userId: String,
  branch: String,
  progressPercent: Number,
  confidence: Number,
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model("Progress", progressSchema);
