import React from "react";
const shell = { card: "rounded-2xl p-5 shadow-lg shadow-black/20 border border-white/10", panel: "bg-[#121b26]" };

export default function StatCard({ title, value, footer }) {
  return (
    <div className={`${shell.card} ${shell.panel}`}>
      <div className="text-slate-300 text-sm">{title}</div>
      <div className="text-3xl font-bold mt-1">{value}</div>
      <div className="text-emerald-300/90 text-sm mt-2">{footer}</div>
    </div>
  );
}
