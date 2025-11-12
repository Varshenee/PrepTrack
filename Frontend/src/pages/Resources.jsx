import React, { useEffect, useState } from "react";
import API from "../api";
import { ThumbsUp, Download } from "lucide-react";

export default function Resources() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await API.get("/upload");
        setMaterials(data);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError("Failed to load resources");
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  if (loading) return <p className="text-slate-400">Loading resources...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">Computer Science Resources</h1>

      {materials.length === 0 ? (
        <p className="text-slate-400">No resources available yet.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {materials.map((m, i) => (
            <div
              key={m._id || i}
              className={`rounded-2xl p-5 border border-white/10 ${
                i === 0 ? "ring-2 ring-yellow-400/70" : ""
              } bg-[#121b26]`}
            >
              <div className="text-xl font-semibold">{m.title}</div>
              <div className="text-sm opacity-70 mt-1">
                Subject: {m.branch} • Type: {m.type?.toUpperCase()}
              </div>
              <p className="text-slate-300/80 mt-3">
                Uploaded educational material available for your branch.
              </p>

              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="opacity-80">{m.uploadedBy || "Anonymous"}</div>
                <div className="opacity-60">
                  {new Date(m.releaseDate).toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4">
                {/* Likes placeholder — to be hooked to a future like system */}
                <div className="flex items-center gap-2 text-emerald-300">
                  <ThumbsUp size={16} /> {Math.floor(Math.random() * 200)} {/* demo */}
                </div>
                {m.fileUrl && (
                  <a
                    href={m.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 flex items-center gap-2 hover:bg-white/20"
                  >
                    <Download size={16} /> View
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
