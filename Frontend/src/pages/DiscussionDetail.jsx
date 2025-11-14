import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import Tag from "../components/Tag.jsx";
import { Send } from "lucide-react";

export default function DiscussionDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);

  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/discussions/${id}`);
      setPost(data);

      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      console.error("Error fetching discussion:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      await API.post(`/discussions/${id}/comment`, { text: commentText });
      setCommentText("");
      fetchPost(); // reload comments
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading) return <p className="text-slate-400">Loading discussion...</p>;
  if (!post) return <p className="text-slate-400">Discussion not found</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Title */}
      <h1 className="text-3xl font-extrabold">{post.title}</h1>

      <div className="opacity-70 mb-2">
        Posted by <span className="font-semibold">{post.author}</span> •{" "}
        {new Date(post.createdAt).toLocaleString()}
      </div>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        {post.tags.map((t, i) => (
          <Tag key={i}>{t}</Tag>
        ))}
      </div>

      {/* Comments Section */}
      <div className="rounded-2xl p-5 bg-[#121b26] border border-white/10">

        <h2 className="text-xl font-semibold mb-3">Discussion</h2>

        {/* All messages */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-3">

          {post.comments.length === 0 ? (
            <p className="opacity-60">No comments yet. Start the conversation!</p>
          ) : (
            post.comments.map((c, i) => (
              <div key={i} className="flex items-start gap-3">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-sky-600/20 border border-sky-500/40 text-sky-300 flex items-center justify-center font-bold">
                  {c.author.charAt(0).toUpperCase()}
                </div>

                {/* Message Bubble */}
                <div className="flex-1">
                  <div className="font-semibold">{c.author}</div>
                  <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-sm">
                    {c.text}
                  </div>
                  <div className="opacity-40 text-xs mt-1">
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>

              </div>
            ))
          )}

          <div ref={bottomRef}></div>
        </div>

        {/* Input box */}
        <div className="flex gap-2 mt-5">
          <input
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a message..."
            className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
          <button
            onClick={addComment}
            className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 flex items-center gap-2 font-semibold"
          >
            <Send size={18} /> Send
          </button>
        </div>

      </div>
    </div>
  );
}
