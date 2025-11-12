import React, { useEffect, useState } from "react";
import API from "../../api";
import AdminLayout from "../../layouts/AdminLayout.jsx";

function Ring({ value = 75 }) {
  const radius = 64,
    C = 2 * Math.PI * radius,
    off = C * (1 - value / 100);
  return (
    <svg width="180" height="180" viewBox="0 0 180 180" className="mx-auto">
      <circle
        cx="90"
        cy="90"
        r={radius}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="14"
        fill="none"
      />
      <circle
        cx="90"
        cy="90"
        r={radius}
        stroke="#34d399"
        strokeWidth="14"
        fill="none"
        strokeDasharray={C}
        strokeDashoffset={off}
        strokeLinecap="round"
        transform="rotate(-90 90 90)"
      />
      <text
        x="90"
        y="92"
        textAnchor="middle"
        className="fill-white text-3xl font-semibold"
      >
        {value}%
      </text>
      <text
        x="90"
        y="116"
        textAnchor="middle"
        className="fill-slate-300/80 text-xs"
      >
        Approved
      </text>
    </svg>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/admin/stats");
        setStats(data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-slate-400">Loading dashboard...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <AdminLayout title="Admin Dashboard">
      <div>
        <h1 className="text-3xl font-extrabold">Dashboard Overview</h1>
        <p className="text-slate-300/80 mt-1">
          Overview of platform activity and key metrics.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mt-6">
        {[
          { label: "Total Verified Uploads", value: stats.totalVerified },
          { label: "Active Student Uploaders", value: stats.activeUploaders },
          {
            label: "Pending Approvals",
            value: stats.pending,
            accent: "text-yellow-400",
          },
          { label: "Blocked Users", value: stats.blocked, accent: "text-rose-400" },
        ].map((c, i) => (
          <div key={i} className="rounded-2xl p-5 bg-[#121b26] border border-white/10">
            <div className="text-slate-300/80 text-sm">{c.label}</div>
            <div className={`text-3xl font-extrabold mt-2 ${c.accent || ""}`}>
              {c.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.3fr,1fr] gap-6 mt-6">
        <div className="rounded-2xl p-6 bg-[#121b26] border border-white/10">
          <div className="text-lg font-semibold mb-4">Uploads by Academic Branch</div>
          <div className="h-48 grid grid-cols-3 gap-4 items-end">
            {stats.branchData.slice(0, 3).map((b, i) => (
              <div
                key={i}
                className="bg-white/10 rounded-lg"
                style={{
                  height: `${40 + b.count}%`,
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center text-sm opacity-70 mt-3">
            {stats.branchData.slice(0, 3).map((b, i) => (
              <div key={i}>{b._id}</div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 bg-[#121b26] border border-white/10">
          <div className="text-lg font-semibold mb-4">Content Approval Status</div>
          <Ring value={stats.approvalRate || 0} />
          <div className="mt-4 space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span> Approved{" "}
              <span className="ml-auto opacity-70">{stats.approvalRate}%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Pending{" "}
              <span className="ml-auto opacity-70">
                {Math.round(
                  (stats.pending /
                    (stats.pending + stats.totalVerified + stats.blocked)) *
                    100 || 0
                )}
                %
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400"></span> Rejected{" "}
              <span className="ml-auto opacity-70">10%</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
