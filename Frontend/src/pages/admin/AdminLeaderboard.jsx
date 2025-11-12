import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import API from "../../api";

export default function AdminLeaderboard() {
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Fetch leaderboard data (admin)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get("/leaderboard/admin");
        setRows(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Handle flag/unflag
  const handleFlagUser = async (studentId, flagged) => {
    try {
      await API.put("/leaderboard/flag", { studentId, flagged });
      setRows((prev) =>
        prev.map((r) =>
          r.studentId._id === studentId ? { ...r, flagged } : r
        )
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Error flagging user:", err);
    }
  };

  // Filter by search
  const filtered = rows.filter(
    (r) =>
      r.studentId?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.studentId?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Admin Leaderboard">
      <h1 className="text-3xl font-extrabold mb-4">Admin Leaderboard</h1>

      <div className="rounded-2xl border border-white/10 overflow-hidden">
        {/* Search bar */}
        <div className="px-4 py-3 bg-[#121b26] border-b border-white/10">
          <input
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
          />
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-slate-400 px-6 py-4">Loading leaderboard...</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-400 px-6 py-4">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#0f1822]">
              <thead className="text-left text-sm opacity-70">
                <tr>
                  <th className="px-6 py-3">RANK</th>
                  <th className="px-6 py-3">STUDENT</th>
                  <th className="px-6 py-3">BRANCH</th>
                  <th className="px-6 py-3">TOTAL POINTS</th>
                  <th className="px-6 py-3">UPLOADS</th>
                  <th className="px-6 py-3">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr
                    key={r._id}
                    className={`border-t border-white/10 ${
                      r.flagged ? "bg-rose-500/10" : ""
                    }`}
                  >
                    <td className="px-6 py-3">{i + 1}</td>
                    <td className="px-6 py-3 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-[url('https://i.pravatar.cc/100?img=8')] bg-cover"
                        alt=""
                      />
                      <div>
                        <div>{r.studentId?.name || "Unknown"}</div>
                        <div className="text-xs opacity-70">
                          {r.studentId?.email || ""}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      {r.studentId?.branch || "N/A"}
                    </td>
                    <td className="px-6 py-3 font-semibold">{r.score}</td>
                    <td className="px-6 py-3">{r.uploads || 0}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() =>
                          handleFlagUser(r.studentId._id, !r.flagged)
                        }
                        className={`px-3 py-1 rounded-lg border text-sm ${
                          r.flagged
                            ? "bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white"
                            : "bg-rose-600 hover:bg-rose-500 border-rose-400 text-white"
                        }`}
                      >
                        {r.flagged ? "Unflag" : "Flag"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Placeholder */}
        <div className="px-6 py-4 flex items-center gap-2">
          <button className="px-3 py-1 rounded-lg bg-white/10 border border-white/10">
            {"<"}
          </button>
          <button className="px-3 py-1 rounded-lg bg-sky-600">1</button>
          {[2, 3, 8, 9, 10].map((n) => (
            <button
              key={n}
              className="px-3 py-1 rounded-lg bg-white/10 border border-white/10"
            >
              {n}
            </button>
          ))}
          <button className="px-3 py-1 rounded-lg bg-white/10 border border-white/10">
            {">"}
          </button>
        </div>
      </div>

      {/* ✅ Toast Notification */}
      {success && (
        <div className="fixed right-8 bottom-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-300 shadow-lg backdrop-blur-sm transition-all duration-500">
          ✅ User flag status updated successfully
        </div>
      )}
    </AdminLayout>
  );
}
