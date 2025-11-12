import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FolderOpenDot, Users, Megaphone, Shield, Settings, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/content", label: "Content Management", icon: FolderOpenDot },
  { to: "/admin/students", label: "User Management", icon: Users },
  { to: "/admin/leaderboard", label: "Leaderboard", icon: BarChart3 },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/security", label: "Security", icon: Shield },
  { to: "/admin/branches", label: "Branches", icon: Settings },
];

export default function AdminSidebar() {
  const { logout } = useAuth();
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 bg-[#121b26] border border-white/10">
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
        <div className="w-8 h-8 grid place-items-center rounded-lg bg-sky-600">🎓</div>
        <div className="text-xl font-semibold">ExamPrep</div>
      </div>

      <nav className="p-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 ${isActive ? "bg-white/10" : ""}`
            }
          >
            <l.icon size={18} className="opacity-80" />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto p-3">
        <button
          onClick={logout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
