import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // ✅ this tells Mongoose to link to the User collection
    required: true,
  },
  score: { type: Number, default: 0 },
  contributions: { type: Number, default: 0 },
  rank: { type: Number, default: 0 },
  flagged: { type: Boolean, default: false },
});

export default mongoose.models.Leaderboard ||
  mongoose.model("Leaderboard", leaderboardSchema);
