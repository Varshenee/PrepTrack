import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";

export default function StudentLayout({ children }) {
  return (
    <div className="bg-[#0f1720] text-slate-100 min-h-screen">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <Topbar />
          <div className="p-4 md:p-8 space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
