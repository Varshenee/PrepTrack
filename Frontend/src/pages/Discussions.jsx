import React, { useEffect, useState } from "react";
import API from "../api";
import { useUser } from "../context/UserContext.jsx";
import Tag from "../components/Tag.jsx";
import { useNavigate } from "react-router-dom";
import {
  MessageSquarePlus,
  Hash,
  BookOpen,
  Sparkles,
  Users,
} from "lucide-react";

export default function Discussions() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newTags, setNewTags] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await API.get("/discussions");
        setPosts(data);
      } catch {
        console.error("Error fetching discussions");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreateDiscussion = async () => {
    if (!newTitle.trim()) return;

    try {
      const { data } = await API.post("/discussions", {
        title: newTitle,
        tags: newTags.split(",").map((t) => t.trim()),
      });
      setPosts([data, ...posts]);
      setNewTitle("");
      setNewTags("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Error creating discussion:", err);
    }
  };

  if (loading) return <p className="text-slate-400">Loading discussions...</p>;

  return (
    <div className="flex gap-8 relative">
      {/* Sidebar */}
      <div className="hidden lg:block w-64 shrink-0 space-y-6">
        <div className="text-sm font-semibold opacity-80 flex items-center gap-2">
          <BookOpen size={16} className="text-sky-300" />
          Subjects
        </div>

        <div className="space-y-2">
          {["Data Structures", "Algorithms", "Operating Systems", "Computer Networks"].map((s) => (
            <button
              key={s}
              className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              {s}
            </button>
          ))}
        </div>

        <div className="text-sm font-semibold opacity-80 mt-6 flex items-center gap-2">
          <Hash size={16} className="text-purple-300" />
          Popular Tags
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {["mid-terms", "lab-exam", "pyqs", "arrays", "pointers"].map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      </div>

      {/* Discussions Feed */}
      <div className="flex-1">
        <h1 className="text-3xl font-extrabold mb-4 flex items-center gap-2">
          <Users size={28} className="text-sky-400" />
          {user?.branch || "CSE"} Discussions
        </h1>

        {/* New Post Box */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 p-4 rounded-xl bg-[#121b26] border border-white/10 shadow-md">
          <input
            placeholder="Start a new discussion..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
          />
          <input
            placeholder="Tags (comma separated)"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            className="w-full sm:w-64 bg-white/10 border border-white/10 rounded-xl px-3 py-2"
          />
          <button
            onClick={handleCreateDiscussion}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 flex items-center gap-2"
          >
            <MessageSquarePlus size={18} /> Post
          </button>
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/discussions/${p._id}`)}
              className="rounded-2xl p-5 border border-white/10 bg-[#0f1822] hover:border-sky-500/40 transition-all cursor-pointer"
            >
              <div className="font-semibold text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-300" />
                {p.title}
              </div>

              <div className="text-sm opacity-70 mb-2">
                Posted by {p.author} • {new Date(p.createdAt).toLocaleDateString()}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {p.tags.map((t, idx) => (
                  <Tag key={idx}>{t}</Tag>
                ))}
              </div>

              <div className="text-sm opacity-70 mt-2">
                💬 {p.commentsCount} comments
              </div>
            </div>
          ))}
        </div>

        {success && (
          <div className="fixed right-8 bottom-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-300 shadow-lg backdrop-blur-sm">
            ✅ Discussion posted successfully
          </div>
        )}
      </div>
    </div>
  );
}
