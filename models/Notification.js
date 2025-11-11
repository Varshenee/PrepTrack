import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
  message: String,
  branch: String,
  timestamp: { type: Date, default: Date.now }
});
export default mongoose.model("Notification", notificationSchema);
