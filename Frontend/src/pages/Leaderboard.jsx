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
        setLeaders(data);
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
            key={i}
            className={`rounded-2xl p-6 border border-white/10 ${
              i === 1
                ? "bg-[#0f1822] ring-2 ring-yellow-400/60"
                : "bg-[#121b26]"
            }`}
          >
            <div
              className="w-20 h-20 rounded-full bg-cover bg-center mx-auto"
              style={{
                backgroundImage: `url('https://i.pravatar.cc/200?u=${p.name}')`,
              }}
            />
            <div className="text-center mt-3 font-semibold">{p.name}</div>
            <div className="text-center text-sky-300 font-semibold">
              {p.score} Points
            </div>
            <div className="text-center opacity-70">
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
                  key={i}
                  className={`border-t border-white/10 ${
                    r.name === user?.name ? "bg-sky-500/10" : ""
                  }`}
                >
                  <td className="px-6 py-3">{i + 1}</td>
                  <td className="px-6 py-3 flex items-center gap-2">
                    {r.name}
                    {r.name === user?.name && (
                      <span className="text-xs text-sky-400">(You)</span>
                    )}
                  </td>
                  <td className="px-6 py-3">{r.branch}</td>
                  <td className="px-6 py-3">{r.contributions || "—"}</td>
                  <td className="px-6 py-3">{r.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
