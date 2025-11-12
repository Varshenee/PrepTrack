import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  branchName: String,
  branchCode: String
});

export default mongoose.model("Branch", branchSchema);
