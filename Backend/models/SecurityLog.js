import mongoose from "mongoose";

const SecurityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    eventType: {
      type: String,
      enum: [
        "Login Success",
        "Login Failure",
        "Password Reset",
        "Account Lock",
        "Admin Action",
      ],
      required: true,
    },
    ipAddress: String,
    details: String,
  },
  { timestamps: true }
);

export default mongoose.model("SecurityLog", SecurityLogSchema);
