import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import API from "../api";

import {
  TrendingUp,
  BookOpenCheck,
  Trophy,
  Gauge,
  LineChart,
  UploadCloud,
  CalendarDays,
  FileCheck2,
  ClipboardList,
} from "lucide-react";

export default function Progress() {
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [examDate, setExamDate] = useState("");

  const fetchData = async () => {
    try {
      const [resProgress, resResults] = await Promise.all([
        API.get("/progress"),
        API.get("/result"),
      ]);
      setProgress(resProgress.data);
      setResults(resResults.data);
    } catch (err) {
      console.error("Fetch Progress Error:", err);
      setError("Unable to load progress data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        subject,
        marks: Number(marks),
        totalMarks: Number(totalMarks),
        examDate,
      };

      await API.post("/result/upload", payload);
      alert("✅ Result uploaded successfully!");
      await fetchData();

      setSubject("");
      setMarks("");
      setTotalMarks("");
      setExamDate("");
    } catch (err) {
      console.error("Upload error:", err);
      alert(`❌ ${err.response?.data?.message || "Failed to upload result."}`);
    }
  };

  if (loading) return <p className="text-slate-400">Loading progress...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.percentage || 0), 0) /
            results.length
        )
      : 0;

  const trendData = results.map((r) => ({
    x: new Date(r.uploadedAt).toLocaleDateString(),
    y: r.percentage,
  }));

  const confidenceColor =
    progress?.confidence === "High"
      ? "text-emerald-400"
      : progress?.confidence === "Medium"
      ? "text-yellow-400"
      : "text-rose-400";

  let insight = "Upload a few results to see insights.";
  if (results.length >= 3) {
    const lastThree = results.slice(-3).map((r) => r.percentage);
    const diff = lastThree[lastThree.length - 1] - lastThree[0];

    if (diff > 5)
      insight = "📈 You are improving. Keep up the good work!";
    else if (diff < -5)
      insight = "📉 Your performance dipped recently. Revise weak areas.";
    else insight = "➖ Your performance is stable. Maintain consistency.";
  }

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
        <TrendingUp className="text-sky-400" /> Exam Progress Dashboard
      </h1>
      <p className="text-slate-300/80 mb-6 flex items-center gap-2">
        <ClipboardList size={18} /> Track your improvements and upload exam results.
      </p>

      {/* ======== 🧮 Stats Summary ======== */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#121b26] border border-white/10 rounded-xl hover:border-sky-500/30 transition">
          <div className="text-lg font-semibold flex items-center gap-2">
            <BookOpenCheck className="text-blue-300" /> Subjects
          </div>
          <div className="text-3xl font-bold mt-1">{results.length}</div>
          <p className="text-slate-400 text-sm mt-1">Tracked Exams</p>
        </div>

        <div className="p-4 bg-[#121b26] border border-white/10 rounded-xl hover:border-emerald-500/30 transition">
          <div className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="text-yellow-300" /> Average Score
          </div>
          <div className="text-3xl font-bold mt-1">{avgScore}%</div>
          <p className="text-sm mt-1 text-emerald-300">
            {avgScore >= 75
              ? "Excellent!"
              : avgScore >= 60
              ? "Good progress"
              : "Needs improvement"}
          </p>
        </div>

        <div className="p-4 bg-[#121b26] border border-white/10 rounded-xl hover:border-purple-500/30 transition">
          <div className="text-lg font-semibold flex items-center gap-2">
            <Gauge className="text-purple-300" /> Overall Readiness
          </div>
          <div className="text-3xl font-bold mt-1">
            {progress?.progressPercent || 0}%
          </div>
          <p className={`text-sm mt-1 ${confidenceColor}`}>
            Confidence: {progress?.confidence || "Medium"}
          </p>
        </div>
      </div>

      {/* ================= 📈 Trend + Confidence ================= */}
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 mt-6">
        {/* ======== 📊 Trend Chart ======== */}
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="text-sky-300" /> Exam Performance Trend
          </div>

          {trendData.length === 0 ? (
            <p className="text-slate-400 text-sm text-center mt-4">
              No results yet. Upload one to get started!
            </p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: 8, right: 8 }}>
                  <XAxis dataKey="x" />
                  <YAxis domain={[0, 100]} />
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
          )}

          <p className="mt-4 text-slate-300/80 text-sm italic">{insight}</p>
        </div>

        {/* ======== 🌡️ Confidence Bar ======== */}
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gauge className="text-red-300" /> Confidence Overview
          </div>

          <div className="flex items-center justify-between mb-2">
            <span>Preparation Confidence</span>
            <span className={`text-sm px-2 py-1 rounded-lg ${confidenceColor}`}>
              {progress?.confidence || "Medium"}
            </span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                progress?.confidence === "High"
                  ? "bg-emerald-400"
                  : progress?.confidence === "Medium"
                  ? "bg-yellow-400"
                  : "bg-rose-400"
              }`}
              style={{ width: `${progress?.progressPercent || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* ============= 🧾 Upload Result Form ============= */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26] mt-6">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UploadCloud className="text-sky-400" /> Upload New Exam Result
        </div>

        <form
          onSubmit={handleUpload}
          className="grid md:grid-cols-4 gap-4 items-center"
        >
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2"
            required
          />

          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Marks"
            className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2"
            required
          />

          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            placeholder="Total Marks"
            className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2"
            required
          />

          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2"
          />

          <button
            type="submit"
            className="col-span-full md:col-span-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg px-4 py-2"
          >
            Upload Result
          </button>
        </form>
      </div>
    </div>
  );
}
