import mongoose from "mongoose";
const leaderboardSchema = new mongoose.Schema({
  studentId: { type: String, ref: "User" },
  score: Number,
  rank: Number
});
export default mongoose.model("Leaderboard", leaderboardSchema);
