import React from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  MessagesSquare,
  TrendingUp,
  Award,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx"; // ✅ import auth context

const shell = {
  panel: "bg-[#121b26]",
  border: "border border-white/10",
};

const links = [
  { to: "/", label: "Dashboard", icon: BookOpen },
  { to: "/resources", label: "Study Materials", icon: BookOpen },
  { to: "/discussions", label: "Forum", icon: MessagesSquare },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/leaderboard", label: "Leaderboard", icon: Award },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const { logout } = useAuth(); // ✅ get logout from context

  return (
    <aside
      className={`hidden md:flex md:flex-col w-64 shrink-0 ${shell.panel} ${shell.border}`}
    >
      {/* Top header */}
      <div className="flex items-center gap-3 px-6 h-16 border-b border-white/10">
        <div className="w-8 h-8 grid place-items-center rounded-lg bg-sky-600">
          🎓
        </div>
        <div className="text-xl font-semibold">ExamPrep</div>
      </div>

      {/* Navigation links */}
      <nav className="p-3 space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 ${
                isActive ? "bg-white/10" : ""
              }`
            }
          >
            <l.icon size={18} className="opacity-80" />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom settings + logout */}
      <div className="mt-auto p-3">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10"
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        {/* ✅ Logout Button */}
        <button
          onClick={logout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 text-left"
        >
          <LogOut size={18} />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
