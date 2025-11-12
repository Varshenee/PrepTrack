import React from "react";
import { useLocation } from "react-router-dom";
import { Search, Bell } from "lucide-react";

const shell = {
  panel: "bg-[#121b26]",
  border: "border border-white/10",
};

export default function Topbar() {
  // Title not strictly required visually, but search + user matches the screenshots
  useLocation(); // retained if you want dynamic titles later

  return (
    <header className={`h-16 flex items-center px-4 md:px-8 sticky top-0 z-20 ${shell.panel} ${shell.border}`}>
      <div className="flex-1">
        <div className="relative w-72 max-w-[60vw] hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" size={18} />
          <input
            placeholder="Search for notes, PYQs, subjects..."
            className="w-full pl-10 pr-3 py-2 bg-white/10 rounded-xl outline-none border border-white/10 focus:border-sky-500"
          />
        </div>
      </div>
      <div className="hidden md:flex items-center gap-4">
        <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10">
          <Bell />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[url('https://i.pravatar.cc/100?img=12')] bg-cover" />
          <div className="leading-4">
            <div className="font-semibold">Rohan Sharma</div>
            <div className="text-xs opacity-70">Computer Science</div>
          </div>
        </div>
      </div>
    </header>
  );
}
