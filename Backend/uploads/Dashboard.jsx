import React, { useEffect, useState } from "react";
import API from "../api";
import { useUser } from "../context/UserContext.jsx";
import {
  BookOpen,
  MessagesSquare,
  TrendingUp,
  Award,
  ChevronRight,
  Bell,
  Info,
  FileText,
  Sparkles,
  Bookmark,
  Clock,
} from "lucide-react";
import Ring from "../components/Ring.jsx";

const shell = {
  card: "rounded-2xl p-5 shadow-lg shadow-black/20 border border-white/10 bg-[#121b26] transition-all hover:border-sky-500/40",
  cardTight:
    "rounded-2xl p-4 shadow-lg shadow-black/20 border border-white/10 bg-[#121b26] transition-all hover:scale-[1.02] hover:border-white/20",
  panel: "bg-[#121b26]",
  subtext: "text-slate-300/80",
  badgeBlue: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
  badgeYellow: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/20",
};

export default function Dashboard() {
  const { user } = useUser();
  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [matRes, noteRes] = await Promise.all([
          API.get("/upload"),
          API.get("/notification"),
        ]);
        setMaterials(matRes.data.slice(0, 4));
        setAnnouncements(noteRes.data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            👋 Welcome, {user?.name || "Student"}!
          </h1>
          <p className={`${shell.subtext} mt-1 flex items-center gap-2`}>
            <Info size={16} /> Here's your personalized learning summary.
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <Bookmark size={18} className="text-sky-300" />
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: "Browse Materials" },
              { icon: MessagesSquare, label: "Join Discussion" },
              { icon: TrendingUp, label: "Track Progress" },
              { icon: Award, label: "View Leaderboard" },
            ].map((a) => (
              <div
                key={a.label}
                className={`${shell.cardTight} grid place-items-center text-center py-6 cursor-pointer`}
              >
                <a.icon className="opacity-90 text-sky-300" size={26} />
                <div className="mt-3 text-sm font-semibold">{a.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Announcements */}
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Bell size={18} className="text-yellow-300" />
            Latest Announcements
          </h2>

          {loading ? (
            <p className="text-slate-300/70">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="text-slate-300/70">📭 No announcements available.</p>
          ) : (
            <div className="space-y-3">
              {announcements.map((n, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 border ${
                    n.priority
                      ? "bg-rose-500/10 border-rose-400/30"
                      : "bg-[#0f1822] border-white/10"
                  } transition-all hover:border-white/20`}
                >
                  <div className="flex items-center gap-2">
                    {n.priority && (
                      <Sparkles size={16} className="text-red-400" />
                    )}
                    <div>{n.message}</div>
                  </div>
                  <div className="text-sm opacity-70 mt-2 flex items-center gap-1">
                    <Clock size={14} />{" "}
                    {new Date(n.createdAt).toLocaleDateString()} • 🎯{" "}
                    {n.audience}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Added Materials */}
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <FileText size={18} className="text-blue-300" />
            Recently Added
          </h2>

          {loading ? (
            <p className="text-slate-300/70">Loading materials...</p>
          ) : materials.length === 0 ? (
            <p className="text-slate-300/70">📂 No new materials available.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {materials.map((it, i) => (
                <div
                  key={i}
                  className={`${shell.card} hover:scale-[1.01] transition-all`}
                >
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`px-2 py-0.5 rounded-full ${
                        it.type === "note"
                          ? shell.badgeBlue
                          : shell.badgeYellow
                      }`}
                    >
                      {it.type.toUpperCase()}
                    </span>

                    <span className="opacity-70">
                      {new Date(it.releaseDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="font-semibold mt-2">{it.title}</div>
                  <p className={`${shell.subtext} mt-1 text-sm`}>
                    📘 {it.branch}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 space-y-6">
        {/* Progress */}
        <div className={`${shell.card}`}>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-300" />
            My Progress
          </h3>
          <Ring value={75} />
          <p className={`${shell.subtext} text-center mt-2`}>
            📊 You're doing great! Keep learning.
          </p>
        </div>

        {/* Upcoming Exams */}
        <div className={`${shell.card}`}>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Clock size={18} className="text-purple-300" />
            Upcoming Exams
          </h3>

          <div className="space-y-3">
            {[
              { d: "NOV 05", t: "Algorithms & Complexity", s: "Midterm Exam" },
              { d: "NOV 12", t: "Operating Systems", s: "Midterm Exam" },
              { d: "NOV 19", t: "Database Management", s: "Midterm Exam" },
            ].map((x, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-16 h-12 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
                  {x.d}
                </div>

                <div className="flex-1">
                  <div className="font-semibold">{x.t}</div>
                  <div className="text-xs opacity-70">{x.s}</div>
                </div>

                <ChevronRight className="opacity-50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
