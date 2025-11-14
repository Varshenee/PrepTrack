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
import { useNavigate } from "react-router-dom"; 

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
  const navigate = useNavigate(); 

  const [materials, setMaterials] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  const [progressData, setProgressData] = useState(null);
  const [prepSubjects, setPrepSubjects] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [matRes, noteRes, progRes] = await Promise.all([
          API.get("/upload"),
          API.get("/notification"),
          API.get("/progress"), // <-- REAL progress
        ]);

        setMaterials(matRes.data.slice(0, 4));
        setAnnouncements(noteRes.data.slice(0, 3));

        setProgressData(progRes.data);
        setPrepSubjects(progRes.data.prepSubjects || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ================= Upcoming Exams =================
  const upcoming = [...prepSubjects]
    .filter((s) => s.examDate)
    .sort((a, b) => new Date(a.examDate) - new Date(b.examDate))
    .slice(0, 3);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

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
              { icon: BookOpen, label: "Browse Materials", route: "/resources" },
              { icon: MessagesSquare, label: "Join Discussion", route: "/discussions" },
              { icon: TrendingUp, label: "Track Progress", route: "/progress" },
              { icon: Award, label: "View Leaderboard", route: "/leaderboard" },
            ].map((a) => (
              <div
                key={a.label}
                onClick={() => navigate(a.route)}
                className={`${shell.cardTight} grid place-items-center text-center py-6 cursor-pointer hover:bg-white/10 transition`}
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
                    <Clock size={14} />
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

      {/* RIGHT SIDEBAR */}
      <div className="w-full lg:w-80 xl:w-96 space-y-6">
        {/* ==== PROGRESS (REAL) ==== */}
        <div className={`${shell.card}`}>
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-green-300" />
            My Progress
          </h3>

          <Ring value={progressData?.progressPercent || 0} />

          <p className={`${shell.subtext} text-center mt-2`}>
            Confidence: {progressData?.confidence || "Medium"}
          </p>
        </div>

        {/* ==== UPCOMING EXAMS (REAL) ==== */}
        <div className={`${shell.card}`}>
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Clock size={18} className="text-purple-300" />
            Upcoming Exams
          </h3>

          {upcoming.length === 0 ? (
            <p className="text-slate-400 text-sm">No upcoming exams added yet.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((x) => (
                <div
                  key={x._id}
                  onClick={() => navigate("/progress")} // ✅ CLICK TO GO TO PROGRESS
                  className="flex items-center gap-3 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition"
                >
                  <div className="w-16 h-12 grid place-items-center rounded-xl bg-white/5 border border-white/10 text-xs font-semibold">
                    {formatDate(x.examDate)}
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold">{x.subject}</div>
                    <div className="text-xs opacity-70">
                      Confidence: {x.confidence}
                    </div>
                  </div>

                  <ChevronRight className="opacity-50" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
