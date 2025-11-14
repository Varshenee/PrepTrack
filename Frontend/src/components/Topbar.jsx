import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api";

export default function Topbar() {
  useLocation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [materials, setMaterials] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // load notes/materials once
  useEffect(() => {
    API.get("/upload")
      .then((res) => setMaterials(res.data))
      .catch((err) => console.log(err));
  }, []);

  // filter as user types
  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      return;
    }

    const q = query.toLowerCase();
    const results = materials.filter((item) =>
      item.title.toLowerCase().includes(q)
    );

    setFiltered(results.slice(0, 5)); // show first 5 matches
  }, [query, materials]);

  return (
    <header className="h-16 flex items-center px-4 md:px-8 sticky top-0 z-20 bg-[#121b26] border border-white/10">
      <div className="flex-1 relative">
        <div className="relative w-72 max-w-[60vw] hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
            size={18}
          />
          <input
            placeholder="Search notes..."
            className="w-full pl-10 pr-3 py-2 bg-white/10 rounded-xl border border-white/10 outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* 🔽 SMALL SEARCH DROPDOWN */}
        {filtered.length > 0 && (
          <div className="absolute mt-2 w-72 bg-[#0f1822] border border-white/10 rounded-xl shadow-lg p-2 z-30 hidden sm:block">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer"
                onClick={() => {
                  window.open(item.fileUrl, "_blank"); // open note
                  setQuery("");
                  setFiltered([]);
                }}
              >
                <div className="font-semibold text-sm">{item.title}</div>
                <div className="text-xs opacity-70">{item.branch}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="hidden md:flex items-center gap-3">
        <div className="w-9 h-9 grid place-items-center rounded-full bg-white/10 border border-white/10">
          <UserIcon size={20} className="text-sky-400" />
        </div>

        <div className="leading-4">
          <div className="font-semibold">{user?.name || "User"}</div>
          <div className="text-xs opacity-70">{user?.branch || "—"}</div>
        </div>
      </div>
    </header>
  );
}
