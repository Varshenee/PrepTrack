import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  branch: String,
  type: { type: String, enum: ["note", "ppt", "pyq"] },
  uploadedBy: String,
  releaseDate: Date,
  fileUrl: String, // Firebase URL
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Material", materialSchema);
