import React from "react";
import { Search, Bell, HelpCircle } from "lucide-react";

export default function AdminTopbar({ title = "Admin Dashboard" }) {
  return (
    <header className="h-16 flex items-center px-4 md:px-8 sticky top-0 z-20 bg-[#121b26] border border-white/10">
      <div className="font-semibold text-lg hidden md:block">{title}</div>
      <div className="flex-1" />
      <div className="relative w-80 max-w-[50vw] hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60" size={18} />
        <input
          placeholder="Search..."
          className="w-full pl-10 pr-3 py-2 bg-white/10 rounded-xl outline-none border border-white/10 focus:border-sky-500"
        />
      </div>
      <div className="flex items-center gap-2 ml-4">
        <button className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"><Bell size={18}/></button>
        <button className="px-3 py-2 rounded-xl bg-white/10 border border-white/10"><HelpCircle size={18}/></button>
        <div className="w-9 h-9 rounded-full bg-[url('https://i.pravatar.cc/100?img=1')] bg-cover ml-2" />
      </div>
    </header>
  );
}
