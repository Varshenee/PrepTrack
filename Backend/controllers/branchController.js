import Branch from "../models/Branch.js";

export const addBranch = async (req, res) => {
  const { branchName, branchCode } = req.body;
  const branch = await Branch.create({ branchName, branchCode });
  res.json(branch);
};

export const getBranches = async (req, res) => {
  const branches = await Branch.find();
  res.json(branches);
};

export const deleteBranch = async (req, res) => {
  const { id } = req.params;
  await Branch.findByIdAndDelete(id);
  res.json({ message: "Branch deleted" });
};
