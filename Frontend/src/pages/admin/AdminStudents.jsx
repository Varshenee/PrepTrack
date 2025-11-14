import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import API from "../../api";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users and progress
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, progressRes] = await Promise.all([
          API.get("/users/all"),
          API.get("/progress/all"),
        ]);
        setStudents(userRes.data);
        setProgressData(progressRes.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError("Unable to load student data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-slate-400">Loading students...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  const getStudentProgress = (id) =>
    progressData.find((p) => p.userId === id) || { progressPercent: 0, confidence: "Unknown" };

  return (
    <AdminLayout title="Student Progress Tracker">
      <h1 className="text-3xl font-extrabold mb-4">Student Progress Tracker</h1>

      <div className="grid lg:grid-cols-[380px,1fr] gap-6">
        {/* Left Panel - Student List */}
        <div className="rounded-2xl bg-[#121b26] border border-white/10 overflow-hidden">
          {students.map((s, i) => {
            const p = getStudentProgress(s._id);
            return (
              <div
                key={s._id}
                onClick={() => setSelected(s)}
                className={`px-4 py-4 border-b border-white/10 cursor-pointer ${
                  selected?._id === s._id ? "bg-sky-800/30" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 grid place-items-center rounded-full bg-white/10 border border-white/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 h-5 text-sky-300"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 1114 0H5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>

                  <div className="font-semibold">{s.name}</div>
                  <div className="ml-auto opacity-70">{p.progressPercent}%</div>
                </div>
                <div className="h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-cyan-400"
                    style={{ width: `${p.progressPercent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Panel - Student Details */}
        <div className="space-y-4">
          {selected ? (
            <>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { title: "Name", main: selected.name },
                  { title: "Email", main: selected.email },
                  { title: "Branch", main: selected.branch || "N/A" },
                ].map((c, i) => (
                  <div
                    key={i}
                    className="rounded-2xl p-6 bg-[#121b26] border border-white/10"
                  >
                    <div className="text-sm opacity-80">{c.title}</div>
                    <div className="text-xl font-semibold mt-1">{c.main}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl p-6 bg-[#121b26] border border-white/10">
                <div className="text-lg font-semibold mb-3">Performance Overview</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    {
                      s: "Overall Progress",
                      progress: getStudentProgress(selected._id).progressPercent,
                      badge: getStudentProgress(selected._id).confidence,
                    },
                    { s: "Modules Completed", progress: 80, badge: "Estimated" },
                  ].map((x, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl p-4 bg-[#0f1822] border border-white/10"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{x.s}</div>
                        <div
                          className={`px-2 py-0.5 rounded-lg text-xs ${
                            x.badge === "High"
                              ? "bg-emerald-500/15 text-emerald-300"
                              : x.badge === "Medium"
                              ? "bg-yellow-500/15 text-yellow-300"
                              : "bg-rose-500/15 text-rose-300"
                          }`}
                        >
                          {x.badge}
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-white/10 mt-2 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400"
                          style={{ width: `${x.progress}%` }}
                        />
                      </div>
                      <div className="opacity-70 text-sm mt-2">
                        {x.progress}% completion
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-slate-400 text-center mt-20">
              Select a student to view details.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
