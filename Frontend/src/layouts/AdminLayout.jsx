import React from "react";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import AdminTopbar from "../components/admin/AdminTopbar.jsx";

export default function AdminLayout({ title, children }) {
  return (
    <div className="bg-[#0f1720] text-slate-100 min-h-screen">
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 min-h-screen">
          <AdminTopbar title={title} />
          <div className="p-4 md:p-8 space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
