import React, { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout.jsx";
import API from "../../api";

export default function AdminSecurityLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Events");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("🔵 AdminSecurityLogs Mounted!");

    const fetchLogs = async () => {
      console.log("📡 Calling /security-logs API...");
      try {
        const { data } = await API.get("/security-logs");
        console.log("✅ Logs received:", data);
        setLogs(data);
      } catch (err) {
        console.error("❌ Error fetching security logs:", err);
        setError("Failed to load logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      log.userId?.email?.toLowerCase().includes(search.toLowerCase()) ||
      log.userId?.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All Events" ? true : log.eventType === filter;

    return matchSearch && matchFilter;
  });

  return (
    <AdminLayout title="Security Logs">
      <h1 className="text-3xl font-extrabold mb-6">Security Logs</h1>

      <div className="rounded-2xl p-6 bg-[#121b26] border border-white/10">
        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-3">
          <input
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-2"
            placeholder="Date Range (UI only)"
            disabled
          />
          <select
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All Events</option>
            <option>Login Success</option>
            <option>Login Failure</option>
            <option>Password Reset</option>
            <option>Admin Action</option>
          </select>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 md:col-span-2"
            placeholder="Search by name or email..."
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-5">
          {loading ? (
            <p className="text-slate-400 p-4">Loading logs...</p>
          ) : error ? (
            <p className="text-red-400 p-4">{error}</p>
          ) : filteredLogs.length === 0 ? (
            <p className="text-slate-400 p-4">No matching logs found.</p>
          ) : (
            <table className="min-w-full bg-[#0f1822]">
              <thead className="text-left text-sm opacity-70">
                <tr>
                  <th className="px-6 py-3">Timestamp</th>
                  <th className="px-6 py-3">Event Type</th>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">IP Address</th>
                  <th className="px-6 py-3">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((r, i) => (
                  <tr key={i} className="border-t border-white/10">
                    <td className="px-6 py-3">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-3">
                      {r.eventType}
                    </td>
                    <td className="px-6 py-3">
                      {r.userId?.name || "Unknown"} ({r.userId?.email})
                    </td>
                    <td className="px-6 py-3">{r.ipAddress}</td>
                    <td className="px-6 py-3">{r.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
