import React, { useEffect, useState } from "react";
import API from "../../api";
import AdminLayout from "../../layouts/AdminLayout.jsx";

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [newBranch, setNewBranch] = useState({ branchName: "", branchCode: "" });
  const [success, setSuccess] = useState(false);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data } = await API.get("/branch");
        setBranches(data);
      } catch (err) {
        console.error("Error fetching branches:", err);
        setError("Failed to load branches");
      } finally {
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleAddBranch = async () => {
    if (!newBranch.branchName.trim() || !newBranch.branchCode.trim()) return;
    try {
      const { data } = await API.post("/branch/add", newBranch);
      setBranches([...branches, data]);
      setNewBranch({ branchName: "", branchCode: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      console.error("Error adding branch:", err);
    }
  };

  const filteredBranches = branches.filter((b) =>
    b.branchName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Branches">
      <h1 className="text-3xl font-extrabold mb-6">Manage Academic Branches</h1>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <input
          placeholder="Search for a branch..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2"
        />
        <input
          placeholder="Branch Name"
          value={newBranch.branchName}
          onChange={(e) => setNewBranch({ ...newBranch, branchName: e.target.value })}
          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2"
        />
        <input
          placeholder="Branch Code"
          value={newBranch.branchCode}
          onChange={(e) => setNewBranch({ ...newBranch, branchCode: e.target.value })}
          className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2"
        />
        <button
          className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500"
          onClick={handleAddBranch}
        >
          Add Branch
        </button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading branches...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="rounded-2xl overflow-hidden border border-white/10">
          <table className="min-w-full bg-[#121b26]">
            <thead className="text-left text-sm opacity-70">
              <tr>
                <th className="px-6 py-3">BRANCH CODE</th>
                <th className="px-6 py-3">BRANCH NAME</th>
                <th className="px-6 py-3">DATE CREATED</th>
              </tr>
            </thead>
            <tbody>
              {filteredBranches.map((b) => (
                <tr key={b._id} className="border-t border-white/10">
                  <td className="px-6 py-3">{b.branchCode}</td>
                  <td className="px-6 py-3">{b.branchName}</td>
                  <td className="px-6 py-3">
                    {new Date(b.createdAt || b.created).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Toast */}
      {success && (
        <div className="fixed right-8 bottom-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-300 shadow-lg backdrop-blur-sm transition-all duration-500">
          ✅ Branch added successfully
        </div>
      )}
    </AdminLayout>
  );
}
