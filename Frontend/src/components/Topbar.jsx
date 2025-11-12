import React from "react";
import { useLocation } from "react-router-dom";
import { Search, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const shell = {
  panel: "bg-[#121b26]",
  border: "border border-white/10",
};

export default function Topbar() {
  useLocation(); // reserved for dynamic titles
  const { user } = useAuth();

  return (
    <header
      className={`h-16 flex items-center px-4 md:px-8 sticky top-0 z-20 ${shell.panel} ${shell.border}`}
    >
      {/* Search */}
      <div className="flex-1">
        <div className="relative w-72 max-w-[60vw] hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60"
            size={18}
          />
          <input
            placeholder="Search for notes, PYQs, subjects..."
            className="w-full pl-10 pr-3 py-2 bg-white/10 rounded-xl outline-none border border-white/10 focus:border-sky-500"
          />
        </div>
      </div>

      {/* 👤 User Info */}
      <div className="hidden md:flex items-center gap-3">
        {/* Universal Profile Icon */}
        <div className="w-9 h-9 grid place-items-center rounded-full bg-white/10 border border-white/10">
          <UserIcon size={20} className="text-sky-400" />
        </div>

        <div className="leading-4">
          <div className="font-semibold">{user?.name || "Loading..."}</div>
          <div className="text-xs opacity-70">{user?.branch || "—"}</div>
        </div>
      </div>
    </header>
  );
}
