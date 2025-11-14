import React, { useEffect, useState } from "react";
import API from "../api";
import { Upload, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Resources() {
  const { user } = useAuth();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Upload form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("note");
  const [file, setFile] = useState(null);
  const [examDate, setExamDate] = useState("");

  // Fetch materials (filtered by branch + release date)
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await API.get("/upload"); // backend already filters by branch
        setMaterials(
          data.filter((m) => m.status !== "rejected") // ❌ hide rejected
        );
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // Handle file upload
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("branch", user.branch);
    formData.append("type", type);
    formData.append("uploadedBy", user.name);
    if (examDate) formData.append("examDate", examDate);
    formData.append("file", file);

    try {
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add only if not rejected
      if (data.material.status !== "rejected") {
        setMaterials((prev) => [data.material, ...prev]);
      }

      setTitle("");
      setType("note");
      setExamDate("");
      setFile(null);

      alert("✅ File uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("❌ Upload failed. Please try again.");
    }
  };

  if (loading) return <p className="text-slate-400">Loading resources...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">
        {user?.branch || "General"} Resources
      </h1>

      {/* Upload form */}
      <form
        onSubmit={handleUpload}
        className="mb-6 p-5 rounded-xl bg-[#121b26] border border-white/10 space-y-3"
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Upload size={18} /> Upload a New Material
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title (e.g., OS Notes)"
          className="w-full p-2 bg-white/10 rounded-lg border border-white/10 outline-none focus:border-sky-500"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-2 bg-white/10 rounded-lg border border-white/10 focus:border-sky-500"
        >
          <option value="note">Notes</option>
          <option value="ppt">PPT</option>
          <option value="pyq">Previous Year Questions</option>
        </select>

        <label className="text-sm text-slate-300">Exam Date (optional)</label>
        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full p-2 bg-white/10 rounded-lg border border-white/10 focus:border-sky-500"
        />

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full text-sm text-slate-300"
          required
        />

        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold"
        >
          Upload
        </button>
      </form>

      {/* Display Materials */}
      {materials.length === 0 ? (
        <p className="text-slate-400">No resources available yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {materials.map((m) => (
            <div
              key={m._id}
              className="rounded-2xl p-5 border border-white/10 bg-[#121b26]"
            >
              <div className="text-xl font-semibold">{m.title}</div>

              <div className="text-sm opacity-70 mt-1">
                {m.branch} • {m.type?.toUpperCase()}
              </div>

              {/* Status pill */}
              <div className="mt-2">
                {m.status === "pending" && (
                  <span className="text-xs px-2 py-1 rounded bg-yellow-600/40 border border-yellow-500/30">
                    Pending Review
                  </span>
                )}
                {m.status === "approved" && (
                  <span className="text-xs px-2 py-1 rounded bg-emerald-600/40 border border-emerald-500/30">
                    Approved
                  </span>
                )}
                {m.status === "revision" && (
                  <span className="text-xs px-2 py-1 rounded bg-blue-600/40 border border-blue-500/30">
                    Needs Revision
                  </span>
                )}
              </div>

              <p className="text-slate-300/80 mt-3">
                Uploaded by {m.uploadedBy || "Anonymous"}
              </p>

              <div className="text-xs opacity-70 mt-2">
                Released: {new Date(m.releaseDate).toLocaleDateString()}
              </div>

              <a
                href={m.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 text-sm"
              >
                <Download size={16} /> View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
