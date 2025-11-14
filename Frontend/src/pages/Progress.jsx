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
  ClipboardList,
} from "lucide-react";

export default function Progress() {
  // existing result/progress state
  const [results, setResults] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // upload result form
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [examDate, setExamDate] = useState("");

  // subjects modal
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);

  // prep-subjects (personal exam prep tracker)
  const [prepSubjects, setPrepSubjects] = useState([]);
  const [prepSubject, setPrepSubject] = useState("");
  const [prepDate, setPrepDate] = useState("");
  const [prepConfidence, setPrepConfidence] = useState("Medium");

  // edit mode for a prep subject
  const [editId, setEditId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editConfidence, setEditConfidence] = useState("Medium");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resProgress, resResults] = await Promise.all([
        API.get("/progress"),
        API.get("/result"),
      ]);
      setProgress(resProgress.data);
      setPrepSubjects(resProgress.data.prepSubjects || []);
      setResults(resResults.data);
      setError(null);
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

  // === Upload exam result (existing) ===
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

  // === Prep Subjects CRUD ===

  const handleAddPrep = async (e) => {
    e.preventDefault();
    if (!prepSubject.trim()) {
      alert("Please enter a subject name.");
      return;
    }
    try {
      const payload = {
        subject: prepSubject.trim(),
        examDate: prepDate || null,
        confidence: prepConfidence,
      };
      const res = await API.post("/progress/prep/add", payload);
      setPrepSubjects(res.data.prepSubjects || []);
      setPrepSubject("");
      setPrepDate("");
      setPrepConfidence("Medium");
    } catch (err) {
      console.error("Add prep subject error:", err);
      alert(`❌ ${err.response?.data?.message || "Failed to add subject."}`);
    }
  };

  const startEditPrep = (sub) => {
    setEditId(sub._id);
    setEditDate(sub.examDate ? new Date(sub.examDate).toISOString().slice(0, 10) : "");
    setEditConfidence(sub.confidence || "Medium");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditDate("");
    setEditConfidence("Medium");
  };

  const saveEditPrep = async (id) => {
    try {
      const payload = {
        examDate: editDate || null,
        confidence: editConfidence,
      };
      const res = await API.patch(`/progress/prep/update/${id}`, payload);
      setPrepSubjects(res.data.prepSubjects || []);
      cancelEdit();
    } catch (err) {
      console.error("Update prep subject error:", err);
      alert(`❌ ${err.response?.data?.message || "Failed to update subject."}`);
    }
  };

  const deletePrep = async (id) => {
    try {
      if (!confirm("Delete this prep subject? This action is permanent.")) return;
      const res = await API.delete(`/progress/prep/delete/${id}`);
      setPrepSubjects(res.data.prepSubjects || []);
      if (editId === id) cancelEdit();
    } catch (err) {
      console.error("Delete prep subject error:", err);
      alert(`❌ ${err.response?.data?.message || "Failed to delete subject."}`);
    }
  };

  if (loading) return <p className="text-slate-400">Loading progress...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  // COMPUTATIONS ------------------------------------
  const avgScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + (r.percentage || 0), 0) / results.length
        )
      : 0;

  const trendData = results.map((r) => ({
    x: new Date(r.uploadedAt).toLocaleDateString(),
    y: r.percentage,
  }));

  // UNIQUE SUBJECTS (for modal)
  const subjects = [...new Set(results.map((r) => r.subject))];

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

    if (diff > 5) insight = "📈 You are improving. Keep up the good work!";
    else if (diff < -5) insight = "📉 Your performance dipped recently. Revise weak areas.";
    else insight = "➖ Your performance is stable. Maintain consistency.";
  }

  // simple helper for display date
  const displayDate = (d) => {
    if (!d) return "Not set";
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-2 flex items-center gap-2">
        <TrendingUp className="text-sky-400" /> Exam Progress Dashboard
      </h1>
      <p className="text-slate-300/80 mb-6 flex items-center gap-2">
        <ClipboardList size={18} /> Track your improvements and upload exam results.
      </p>

      {/* ======== SUMMARY CARDS ======== */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* SUBJECTS CARD WITH MODAL TRIGGER */}
        <div
          onClick={() => setShowSubjectsModal(true)}
          className="p-4 bg-[#121b26] border border-white/10 rounded-xl hover:border-sky-500/30 transition cursor-pointer"
        >
          <div className="text-lg font-semibold flex items-center gap-2">
            <BookOpenCheck className="text-blue-300" /> Subjects
          </div>
          <div className="text-3xl font-bold mt-1">{subjects.length}</div>
          <p className="text-slate-400 text-sm mt-1">Tracked Exams</p>
        </div>

        <div className="p-4 bg-[#121b26] border border-white/10 rounded-xl hover:border-emerald-500/30 transition">
          <div className="text-lg font-semibold flex items-center gap-2">
            <Trophy className="text-yellow-300" /> Average Score
          </div>
          <div className="text-3xl font-bold mt-1">{avgScore}%</div>
          <p className="text-sm mt-1 text-emerald-300">
            {avgScore >= 75 ? "Excellent!" : avgScore >= 60 ? "Good progress" : "Needs improvement"}
          </p>
        </div>

        <div className="p-4 bg-[#121b26] border border-white/10 rounded-xl hover:border-purple-500/30 transition">
          <div className="text-lg font-semibold flex items-center gap-2">
            <Gauge className="text-purple-300" /> Overall Readiness
          </div>
          <div className="text-3xl font-bold mt-1">{progress?.progressPercent || 0}%</div>
          <p className={`text-sm mt-1 ${confidenceColor}`}>Confidence: {progress?.confidence || "Medium"}</p>
        </div>
      </div>

      {/* ======== TREND + CONFIDENCE ======== */}
      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-6 mt-6">
        {/* TREND CHART */}
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <LineChart className="text-sky-300" /> Exam Performance Trend
          </div>

          {trendData.length === 0 ? (
            <p className="text-slate-400 text-sm text-center mt-4">No results yet. Upload one to get started!</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ left: 8, right: 8 }}>
                  <XAxis dataKey="x" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="y" stroke="#38bdf8" fill="#38bdf8" strokeWidth={2} fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          <p className="mt-4 text-slate-300/80 text-sm italic">{insight}</p>
        </div>

        {/* CONFIDENCE BAR */}
        <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
          <div className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Gauge className="text-red-300" /> Confidence Overview
          </div>

          <div className="flex items-center justify-between mb-2">
            <span>Preparation Confidence</span>
            <span className={`text-sm px-2 py-1 rounded-lg ${confidenceColor}`}>{progress?.confidence || "Medium"}</span>
          </div>

          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                progress?.confidence === "High" ? "bg-emerald-400" : progress?.confidence === "Medium" ? "bg-yellow-400" : "bg-rose-400"
              }`}
              style={{ width: `${progress?.progressPercent || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* ======== UPLOAD RESULT FORM ======== */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26] mt-6">
        <div className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UploadCloud className="text-sky-400" /> Upload New Exam Result
        </div>

        <form onSubmit={handleUpload} className="grid md:grid-cols-4 gap-4 items-center">
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2" required />

          <input type="number" value={marks} onChange={(e) => setMarks(e.target.value)} placeholder="Marks" className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2" required />

          <input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="Total Marks" className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2" required />

          <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className="bg-[#0f1720] border border-white/10 rounded-lg px-3 py-2" />

          <button type="submit" className="col-span-full md:col-span-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg px-4 py-2">
            Upload Result
          </button>
        </form>
      </div>

      {/* ================= PERSONAL EXAM PREP TRACKER ================= */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26] mt-6">
        <h2 className="text-xl font-semibold mb-4">Personal Exam Prep Tracker</h2>

        {/* ADD SUBJECT FORM */}
        <form onSubmit={handleAddPrep} className="grid md:grid-cols-3 gap-4 mb-4">
          <input value={prepSubject} onChange={(e) => setPrepSubject(e.target.value)} placeholder="Subject" required className="bg-[#0f1720] border border-white/10 px-3 py-2 rounded-lg" />

          <input type="date" value={prepDate} onChange={(e) => setPrepDate(e.target.value)} className="bg-[#0f1720] border border-white/10 px-3 py-2 rounded-lg" />

          <select value={prepConfidence} onChange={(e) => setPrepConfidence(e.target.value)} className="bg-[#0f1720] border border-white/10 px-3 py-2 rounded-lg">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button type="submit" className="col-span-full md:col-span-3 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg">
            Add Subject
          </button>
        </form>

        {/* SUBJECT LIST */}
        <div className="space-y-3">
          {prepSubjects.length === 0 && <p className="text-slate-400">No prep subjects yet. Add a subject to start tracking confidence.</p>}

          {prepSubjects.map((sub) => (
            <div key={sub._id} className="p-4 bg-[#14212e] rounded-lg border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-lg font-semibold truncate">{sub.subject}</p>

                  {/* show date + confidence in one small column on wide screens */}
                  <div className="hidden md:flex items-center gap-4">
                    <p className="text-slate-300 text-sm">Exam: {displayDate(sub.examDate)}</p>
                    <p className="text-sm">
                      Confidence:{" "}
                      <span className={sub.confidence === "High" ? "text-emerald-400" : sub.confidence === "Medium" ? "text-yellow-400" : "text-rose-400"}>
                        {sub.confidence}
                      </span>
                    </p>
                  </div>
                </div>

                {/* mobile view of date/confidence */}
                <div className="md:hidden mt-2 flex items-center gap-4 text-sm text-slate-300">
                  <span>Exam: {displayDate(sub.examDate)}</span>
                  <span>
                    Confidence:{" "}
                    <span className={sub.confidence === "High" ? "text-emerald-400" : sub.confidence === "Medium" ? "text-yellow-400" : "text-rose-400"}>
                      {sub.confidence}
                    </span>
                  </span>
                </div>

                {/* EDIT ROW (shown when this item is in edit mode) */}
                {editId === sub._id && (
                  <div className="mt-3 grid md:grid-cols-3 gap-3">
                    <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} className="bg-[#0f1720] border border-white/10 px-3 py-2 rounded-lg" />
                    <select value={editConfidence} onChange={(e) => setEditConfidence(e.target.value)} className="bg-[#0f1720] border border-white/10 px-3 py-2 rounded-lg">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>

                    <div className="flex gap-2">
                      <button onClick={() => saveEditPrep(sub._id)} className="bg-blue-600 px-3 py-2 rounded-lg text-white">
                        Save
                      </button>
                      <button onClick={cancelEdit} className="bg-gray-600 px-3 py-2 rounded-lg text-white">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3 md:mt-0">
                {editId !== sub._id && (
                  <>
                    <button
                      className="px-3 py-1 bg-blue-600 rounded-lg text-white"
                      onClick={() => startEditPrep(sub)}
                    >
                      Edit
                    </button>

                    <button
                      className="px-3 py-1 bg-red-600 rounded-lg text-white"
                      onClick={() => deletePrep(sub._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SUBJECTS MODAL ================= */}
      {showSubjectsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#101820] border border-white/10 rounded-xl p-6 w-80 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Subjects</h2>

            {subjects.length === 0 ? (
              <p className="text-slate-400 text-sm">No subjects uploaded yet.</p>
            ) : (
              <ul className="space-y-2 max-h-64 overflow-auto pr-2">
                {subjects.map((sub, idx) => (
                  <li key={idx} className="bg-[#14212e] px-3 py-2 rounded-lg border border-white/10 text-slate-200">
                    {sub}
                  </li>
                ))}
              </ul>
            )}

            <button onClick={() => setShowSubjectsModal(false)} className="mt-4 w-full bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-white">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
