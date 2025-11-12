import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
  studentId: { type: String, ref: "User", required: true },
  subject: { type: String, required: true },
  marks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model("Result", resultSchema);
