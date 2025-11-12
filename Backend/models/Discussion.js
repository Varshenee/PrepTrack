import mongoose from "mongoose";

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String },
  author: { type: String, required: true },
  branch: { type: String },
  tags: [String],
  commentsCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Discussion", discussionSchema);
