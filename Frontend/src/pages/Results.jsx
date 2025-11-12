import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import API from "../api";

export default function Results() {
  const [results, setResults] = useState([]);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await API.get("/result");
        setResults(data);

        // Generate trend (average of results grouped by semester, if applicable)
        const trendData = data.map((r, i) => ({
          x: `Exam ${i + 1}`,
          y: parseInt(r.percentage) || 0,
        }));
        setTrend(trendData);
      } catch (err) {
        console.error("Error fetching results:", err);
        setError("Unable to load results data.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) return <p className="text-slate-400">Loading results...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  // Calculate summary data
  const avg =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (parseInt(r.percentage) || 0), 0) /
            results.length
        )
      : 0;
  const best = results.reduce(
    (a, b) => ((parseInt(a.percentage) || 0) > (parseInt(b.percentage) || 0) ? a : b),
    {}
  );
  const recent = results[results.length - 1] || {};

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-6">My Academic Performance</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-sm opacity-80">Overall Average</div>
          <div className="text-4xl font-bold mt-1">{avg || 0}%</div>
          <div className="text-emerald-300/90 text-sm mt-2">
            Great job! Keep improving.
          </div>
        </div>
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-sm opacity-80">Best Subject</div>
          <div className="text-2xl font-bold mt-1">
            {best.subject || "—"}
          </div>
          <div className="opacity-80 mt-2">
            {best.percentage ? `${best.percentage}%` : "N/A"}
          </div>
        </div>
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-sm opacity-80">Recent Score</div>
          <div className="text-4xl font-bold mt-1">
            {recent.percentage || "—"}%
          </div>
          <div className="opacity-80 mt-2">{recent.subject || "—"}</div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26] mt-6">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">Score Trends</div>
          <button className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-sm">
            Last Exams
          </button>
        </div>
        <div className="h-56 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ left: 8, right: 8 }}>
              <XAxis dataKey="x" />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="y"
                stroke="#38bdf8"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-2xl border border-white/10 bg-[#121b26] mt-6 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">Results History</div>
          <input
            placeholder="Search by subject..."
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-2"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="text-left text-sm opacity-70">
              <tr>
                <th className="px-6 py-3">SUBJECT</th>
                <th className="px-6 py-3">EXAM TYPE</th>
                <th className="px-6 py-3">SCORE</th>
                <th className="px-6 py-3">DATE</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i} className="border-t border-white/10">
                  <td className="px-6 py-3">{r.subject}</td>
                  <td className="px-6 py-3">{r.examType || "—"}</td>
                  <td className="px-6 py-3">{r.percentage || r.marks}%</td>
                  <td className="px-6 py-3">
                    {new Date(r.createdAt || r.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
