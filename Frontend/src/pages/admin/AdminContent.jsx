import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import API from "../../api";

export default function AdminContent() {
  const [materials, setMaterials] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Fetch all uploaded materials (admin)
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const { data } = await API.get("/upload/all");
        setMaterials(data);
      } catch (err) {
        console.error("Error fetching materials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // Handle status update (Approve/Reject/Revision)
  const handleUpdateStatus = async (status) => {
    if (!selected) return;
    try {
      await API.put(`/upload/${selected._id}/status`, {
        status,
        reviewNotes,
      });
      setMaterials((prev) =>
        prev.map((m) =>
          m._id === selected._id ? { ...m, status, reviewNotes } : m
        )
      );
      setSelected(null);
      setReviewNotes("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Filter visible materials by status
  const filtered = materials.filter((m) =>
    filter === "All" ? true : m.status === filter.toLowerCase()
  );

  return (
    <AdminLayout title="Content Management">
      <h1 className="text-3xl font-extrabold mb-6">Content Management</h1>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        {["Pending", "Approved", "Rejected", "All"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-2 rounded-xl border border-white/10 ${
              filter === f
                ? "bg-sky-600"
                : "bg-white/10 hover:bg-white/20 text-slate-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-[1fr,380px] gap-6">
        {/* Left: Material List */}
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <div className="px-4 py-3 bg-[#121b26] border-b border-white/10 flex gap-3">
            <input
              className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              placeholder="Search by title, student name, or ID"
            />
          </div>

          {loading ? (
            <p className="text-slate-400 p-4">Loading materials...</p>
          ) : (
            <div className="divide-y divide-white/10 bg-[#0f1822]">
              {filtered.map((r) => (
                <div
                  key={r._id}
                  onClick={() => setSelected(r)}
                  className={`px-4 py-4 cursor-pointer hover:bg-sky-700/30 ${
                    selected?._id === r._id ? "bg-sky-800/40" : ""
                  }`}
                >
                  <div className="font-semibold">{r.title}</div>
                  <div className="text-sm opacity-70">
                    {r.uploadedBy || "Unknown User"} • {r.branch || "N/A"} •{" "}
                    {r.type?.toUpperCase()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Review Panel */}
        <div className="rounded-2xl p-6 bg-[#121b26] border border-white/10">
          {selected ? (
            <>
              <div className="text-xl font-bold mb-2">{selected.title}</div>
              <div className="opacity-70">{selected.branch}</div>

              <div className="mt-4">
                <div className="text-sm opacity-70 mb-2">Document Preview</div>
                <a
                  href={selected.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-48 rounded-xl bg-[#0f1822] border border-white/10 grid place-items-center hover:bg-white/5"
                >
                  View File
                </a>
              </div>

              <div className="mt-4">
                <div className="text-sm opacity-70 mb-1">Review Notes (Private)</div>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add feedback for student..."
                  className="w-full h-28 bg-white/10 border border-white/10 rounded-xl p-3"
                />
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleUpdateStatus("approved")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus("rejected")}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleUpdateStatus("revision")}
                  className="px-4 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500"
                >
                  Request Revision
                </button>
              </div>
            </>
          ) : (
            <p className="text-slate-400 text-center mt-10">
              Select a submission to review.
            </p>
          )}
        </div>
      </div>

      {/* ✅ Toast */}
      {success && (
        <div className="fixed right-8 bottom-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-300 shadow-lg backdrop-blur-sm transition-all duration-500">
          ✅ Status updated successfully
        </div>
      )}
    </AdminLayout>
  );
}
