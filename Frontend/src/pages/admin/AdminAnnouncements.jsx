import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import API from "../../api";

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("All Users");
  const [priority, setPriority] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await API.get("/notification");
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  // Publish new announcement
  const handlePublish = async () => {
    if (!message.trim()) return alert("Please write a message before publishing.");
    try {
      const { data } = await API.post("/notification/create", {
        message,
        audience,
        priority,
      });
      setAnnouncements([data, ...announcements]); // Add new one at top
      setMessage("");
      setPriority(false);
      setAudience("All Users");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error publishing announcement:", err);
      setError("Failed to publish announcement.");
    }
  };

  const filtered = announcements.filter((a) =>
    a.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Announcements">
      <h1 className="text-3xl font-extrabold mb-6">Manage Announcements</h1>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create new announcement */}
        <div className="rounded-2xl p-6 bg-[#121b26] border border-white/10">
          <div className="text-lg font-semibold mb-4">Create a New Announcement</div>

          <textarea
            className="w-full h-40 bg-white/10 border border-white/10 rounded-xl p-3"
            placeholder="Compose your announcement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            <select
              className="bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              <option>All Users</option>
              <option>Computer Science</option>
              <option>Mechanical</option>
              <option>Electrical</option>
              <option>Civil</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={priority}
                onChange={(e) => setPriority(e.target.checked)}
                className="accent-sky-500"
              />{" "}
              Set as High Priority
            </label>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePublish}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500"
            >
              Publish Announcement
            </button>
            <button className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">
              Save as Draft
            </button>
          </div>
        </div>

        {/* Published announcements */}
        <div className="rounded-2xl p-6 bg-[#121b26] border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold">Published Announcements</div>
            <input
              placeholder="Search announcements..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-xl px-3 py-2"
            />
          </div>

          {loading ? (
            <p className="text-slate-400">Loading announcements...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-400">No announcements found.</p>
          ) : (
            <div className="space-y-3">
              {filtered.map((x, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 ${
                    x.priority
                      ? "bg-rose-500/10 border border-rose-400/30"
                      : "bg-[#0f1822] border border-white/10"
                  }`}
                >
                  <div>{x.message}</div>
                  <div className="text-sm opacity-70 mt-2">
                    Published on: {new Date(x.createdAt).toLocaleDateString()}{" "}
                    <span className="ml-4">Audience:</span>{" "}
                    <span className="px-2 py-0.5 rounded-lg bg-white/10 border border-white/10">
                      {x.audience}
                    </span>
                  </div>
                  <div className="mt-2 text-right text-sm opacity-70">✏️ 🗑️</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✅ Toast */}
      {success && (
        <div className="fixed right-8 bottom-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-300 shadow-lg backdrop-blur-sm transition-all duration-500">
          ✅ Announcement published successfully
        </div>
      )}
    </AdminLayout>
  );
}
