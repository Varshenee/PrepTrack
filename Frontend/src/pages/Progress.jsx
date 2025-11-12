import React, { useEffect, useState } from "react";
import { AreaChart, Area, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import API from "../api";
import StatCard from "../components/StatCard.jsx";

export default function Progress() {
  const [subjects, setSubjects] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user progress data
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await API.get("/progress");
        if (Array.isArray(data)) {
          setSubjects(data);
        } else {
          setSubjects([data]); // fallback if single object returned
        }

        // Generate trend line (mock trend based on progress history)
        const trendData = [
          { x: "4 Wks Ago", y: 45 },
          { x: "3 Wks Ago", y: 55 },
          { x: "2 Wks Ago", y: 65 },
          { x: "1 Wk Ago", y: data.progressPercent || 75 },
          { x: "Today", y: data.progressPercent || 80 },
        ];
        setTrend(trendData);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Unable to load progress data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) return <p className="text-slate-400">Loading progress...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2">My Exam Readiness Dashboard</h1>
      <p className="text-slate-300/80 mb-6">
        Here's a summary of your preparation progress.
      </p>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard title="Notes Read" value="78 / 120" footer="+5% this week" />
        <StatCard title="PYQs Solved" value="250 / 400" footer="+8% this week" />
        <StatCard
          title="Overall Readiness"
          value={`${subjects[0]?.progressPercent || 82}%`}
          footer="+3% this week"
        />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 mt-6">
        {/* Subject Confidence */}
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-lg font-semibold mb-4">Subject Confidence</div>
          <div className="space-y-4">
            {subjects.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-[1fr,140px,100px] items-center gap-4"
              >
                <div>{s.branch || s.name || "Subject"}</div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{ width: `${s.progressPercent || s.completion || 60}%` }}
                  />
                </div>
                <div
                  className={`px-2 py-1 rounded-lg text-sm text-center ${
                    s.confidence === "High"
                      ? "bg-emerald-500/15 text-emerald-300"
                      : s.confidence === "Medium"
                      ? "bg-yellow-500/15 text-yellow-300"
                      : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {s.confidence || "Medium"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness Trend */}
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Readiness Trend</div>
            <div className="flex gap-2 text-xs">
              <button className="px-2 py-1 rounded-lg bg-white/10 border border-white/10">
                30D
              </button>
              <button className="px-2 py-1 rounded-lg border border-white/10/50">
                90D
              </button>
              <button className="px-2 py-1 rounded-lg border border-white/10/50">
                All
              </button>
            </div>
          </div>

          <div className="h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ left: 8, right: 8 }}>
                <XAxis dataKey="x" hide />
                <YAxis hide />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="y"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  strokeWidth={2}
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
