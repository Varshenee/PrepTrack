import mongoose from "mongoose";
const resultSchema = new mongoose.Schema({
  studentId: { type: String, ref: "User" },
  subject: String,
  marks: Number,
  percentage: Number,
  uploadedAt: { type: Date, default: Date.now }
});
export default mongoose.model("Result", resultSchema);
