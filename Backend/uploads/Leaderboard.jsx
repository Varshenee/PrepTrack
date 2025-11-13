import React, { useEffect, useState } from "react";
import API from "../api";
import { useUser } from "../context/UserContext.jsx";
import { Medal, Users, Star, Trophy, Sparkles } from "lucide-react";

export default function Leaderboard() {
  const { user } = useUser();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get("/leaderboard");
        const sorted = data.sort((a, b) => b.score - a.score);
        setLeaders(sorted);
      } catch (err) {
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <p className="text-slate-400">Loading leaderboard...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  const topThree = leaders.slice(0, 3);

  const medalColors = [
    "text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.6)]",
    "text-gray-300 drop-shadow-[0_0_10px_rgba(200,200,200,0.5)]",
    "text-amber-600 drop-shadow-[0_0_10px_rgba(255,180,70,0.5)]",
  ];

  return (
    <div>
      {/* PAGE TITLE */}
      <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
        <Trophy className="text-yellow-400 drop-shadow" size={32} />
        Leaderboard
      </h1>
      <p className="text-slate-300/70 mb-8 flex items-center gap-2">
        <Users size={18} /> Celebrating the most active contributors of PrepTrack.
      </p>

      {/* 🔥 TOP 3 PODIUM */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {topThree.map((p, i) => (
          <div
            key={i}
            className={`relative rounded-2xl p-6 transition transform hover:-translate-y-1 
              hover:shadow-[0_0_40px_rgba(0,200,255,0.2)]
              ${
                i === 0
                  ? "bg-gradient-to-b from-yellow-500/20 to-[#0f1822] ring-2 ring-yellow-400/50"
                  : "bg-gradient-to-b from-white/5 to-[#121b26]"
              }
              border border-white/10`}
          >
            {/* Medal */}
            <div className="absolute top-4 right-4">
              <Medal className={`${medalColors[i]}`} size={28} />
            </div>

            {/* Avatar */}
            <div
              className="w-24 h-24 mx-auto rounded-full bg-sky-600 
                grid place-items-center text-3xl font-bold text-white
                shadow-[0_0_20px_rgba(56,189,248,0.5)]"
            >
              {p.name?.charAt(0).toUpperCase()}
            </div>

            <div className="text-center mt-4 text-xl font-semibold">
              {p.name}
            </div>

            <div className="text-center text-sky-300 font-bold text-lg mt-1">
              {p.score} Points
            </div>

            <div className="text-center text-sm opacity-70 mt-1">
              {i === 0 ? "🥇 1st Place" : i === 1 ? "🥈 2nd Place" : "🥉 3rd Place"}
            </div>

            {/* Glow line */}
            <div className="h-px w-20 mx-auto mt-4 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-40" />
          </div>
        ))}
      </div>

      {/* 🌟 LEADERBOARD TABLE */}
      <div className="rounded-2xl border border-white/10 backdrop-blur-xl bg-[#0f1625]/60 shadow-xl overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-[#0d121e]/80 text-xs uppercase tracking-wider text-slate-300">
            <tr>
              <th className="px-6 py-3">Rank</th>
              <th className="px-6 py-3">Student</th>
              <th className="px-6 py-3">Branch</th>
              <th className="px-6 py-3">Uploads</th>
              <th className="px-6 py-3">Points</th>
            </tr>
          </thead>

          <tbody>
            {leaders.map((r, i) => (
              <tr
                key={i}
                className={`transition hover:bg-white/5 ${
                  r.name === user?.name ? "bg-sky-500/10" : ""
                }`}
              >
                <td className="px-6 py-4 font-bold text-slate-200">{i + 1}</td>

                {/* Avatar + Name */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-600 grid place-items-center text-white font-semibold shadow">
                    {r.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="font-semibold">
                    {r.name}
                    {r.name === user?.name && (
                      <span className="text-xs text-sky-400 ml-1">(You)</span>
                    )}
                  </div>
                </td>

                <td className="px-6 py-4">{r.branch || "—"}</td>

                <td className="px-6 py-4 text-center">
                  {r.contributions ?? "—"}
                </td>

                <td className="px-6 py-4 font-bold text-sky-300">
                  {r.score ?? 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <p className="text-slate-400 text-sm mt-8 text-center">
        <Sparkles className="inline-block text-yellow-300 mb-1" size={16} /> 
        Leaderboard updates automatically based on contributions.
      </p>
    </div>
  );
}
