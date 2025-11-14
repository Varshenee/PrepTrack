import React from "react";
import { User } from "lucide-react";

export default function AdminTopbar({ title = "Admin Dashboard" }) {
  return (
    <header className="h-16 flex items-center px-4 md:px-8 sticky top-0 z-20 bg-[#121b26] border-b border-white/10">
      {/* Title */}
      <div className="font-semibold text-lg">{title}</div>

      <div className="flex-1" />

      {/* Profile Icon */}
      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 grid place-items-center">
        <User size={20} className="text-white/70" />
      </div>
    </header>
  );
}
