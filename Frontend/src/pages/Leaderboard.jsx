import React, { useEffect, useState } from "react";
import API from "../api";
import { useUser } from "../context/UserContext.jsx";

export default function Leaderboard() {
  const { user } = useUser();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get("/leaderboard");
        // Sort descending by score, just in case backend isn’t sorted
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaders(sorted);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-slate-400">Loading leaderboard...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  const topThree = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">Top Contributors</h1>

      {/* 🏆 Top 3 Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {topThree.map((p, i) => (
          <div
            key={p._id || i}
            className={`rounded-2xl p-6 border border-white/10 transition hover:border-sky-500/30 ${
              i === 0
                ? "bg-[#0f1822] ring-2 ring-yellow-400/60"
                : "bg-[#121b26]"
            }`}
          >
            {/* 🧑 Avatar with initials */}
            <div className="w-20 h-20 mx-auto rounded-full bg-sky-600 grid place-items-center text-xl font-bold text-white">
              {p.name ? p.name.charAt(0).toUpperCase() : "U"}
            </div>

            <div className="text-center mt-3 font-semibold">{p.name}</div>
            <div className="text-center text-sky-300 font-semibold">
              {p.score || 0} Points
            </div>
            <div className="text-center opacity-70 mt-1">
              {i === 0
                ? "1st Place"
                : i === 1
                ? "2nd Place"
                : "3rd Place"}
            </div>
          </div>
        ))}
      </div>

      {/* 📊 Leaderboard Table */}
      <div className="rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#121b26]">
            <thead className="text-left text-sm opacity-70">
              <tr>
                <th className="px-6 py-3">RANK</th>
                <th className="px-6 py-3">STUDENT NAME</th>
                <th className="px-6 py-3">BRANCH</th>
                <th className="px-6 py-3">CONTRIBUTIONS</th>
                <th className="px-6 py-3">TOTAL POINTS</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((r, i) => (
                <tr
                  key={r._id || i}
                  className={`border-t border-white/10 ${
                    r.name === user?.name ? "bg-sky-500/10" : "hover:bg-white/5"
                  } transition`}
                >
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-600 grid place-items-center text-white font-semibold text-sm">
                      {r.name ? r.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <span>
                      {r.name}
                      {r.name === user?.name && (
                        <span className="text-xs text-sky-400 ml-1">(You)</span>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-3">{r.branch || "—"}</td>
                  <td className="px-6 py-3 text-center">
                    {r.contributions ?? "—"}
                  </td>
                  <td className="px-6 py-3 font-semibold">{r.score ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🧠 Footer Info */}
      <p className="text-slate-400 text-sm mt-6 text-center opacity-70">
        Leaderboard updates automatically based on your uploads and activity.
      </p>
    </div>
  );
}
