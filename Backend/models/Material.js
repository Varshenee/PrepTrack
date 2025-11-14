import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    branch: { type: String, required: true },

    type: { 
      type: String, 
      enum: ["note", "ppt", "pyq"],
      required: true
    },

    uploadedBy: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    fileUrl: { type: String, required: true },

    // 🔥 REQUIRED for admin Content Management
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "revision"],
      default: "pending",
    },

    reviewNotes: {
      type: String,
      default: "",
    },

    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // 🔥 needed for createdAt / updatedAt
);

export default mongoose.model("Material", materialSchema);
