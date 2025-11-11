import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
  title: String,
  branch: String,
  type: { type: String, enum: ["note", "ppt", "pyq"] },
  filePath: String,
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now },
  releaseDate: { type: Date }
});

export default mongoose.model("Material", materialSchema);
