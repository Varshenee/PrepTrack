import Discussion from "../models/Discussion.js";

// GET all discussions
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

// GET single discussion
export const getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);
    if (!discussion) {
      return res.status(404).json({ message: "Discussion not found" });
    }
    res.status(200).json(discussion);
  } catch (err) {
    console.error("Get Discussion Error:", err);
    res.status(500).json({ message: "Error fetching discussion" });
  }
};

// CREATE discussion
export const createDiscussion = async (req, res) => {
  try {
    const { title, tags, body } = req.body;

    const discussion = await Discussion.create({
      title,
      body: body || "",
      tags: tags || [],
      author: req.user.name,
      branch: req.user.branch,
    });

    res.status(201).json(discussion);
  } catch (err) {
    console.error("Create Discussion Error:", err);
    res.status(500).json({ message: "Error creating discussion" });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const updated = await Discussion.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          comments: {
            author: req.user.name,
            text,
          },
        },
        $inc: { commentsCount: 1 },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Discussion not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Add Comment Error:", err);
    res.status(500).json({ message: "Error adding comment" });
  }
};
