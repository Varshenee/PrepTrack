import Discussion from "../models/Discussion.js";

// GET all discussions (filter by branch optional)
export const getDiscussions = async (req, res) => {
  try {
    const filter = req.user?.branch ? { branch: req.user.branch } : {};
    const discussions = await Discussion.find(filter).sort({ createdAt: -1 });
    res.status(200).json(discussions);
  } catch (err) {
    console.error("Get Discussions Error:", err);
    res.status(500).json({ message: "Error fetching discussions" });
  }
};

// POST a new discussion
export const createDiscussion = async (req, res) => {
  try {
    const { title, tags, body } = req.body;
    const discussion = await Discussion.create({
      title,
      body,
      tags,
      author: req.user.name,
      branch: req.user.branch,
    });
    res.status(201).json(discussion);
  } catch (err) {
    console.error("Create Discussion Error:", err);
    res.status(500).json({ message: "Error creating discussion" });
  }
};
