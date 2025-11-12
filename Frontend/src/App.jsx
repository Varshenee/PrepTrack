import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { RequireStudent, RequireAdmin } from "./utils/guards.jsx";

import Login from "./pages/Login.jsx";

// Student pages
import StudentLayout from "./layouts/StudentLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Discussions from "./pages/Discussions.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Profile from "./pages/Profile.jsx";
import Progress from "./pages/Progress.jsx";
import Resources from "./pages/Resources.jsx";
import Results from "./pages/Results.jsx";

// Admin pages
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminLeaderboard from "./pages/admin/AdminLeaderboard.jsx";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements.jsx";
import AdminSecurityLogs from "./pages/admin/AdminSecurityLogs.jsx";
import AdminContent from "./pages/admin/AdminContent.jsx";
import AdminBranches from "./pages/admin/AdminBranches.jsx";
import AdminStudents from "./pages/admin/AdminStudents.jsx";

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* STUDENT ROUTES (protected) */}
          <Route element={<RequireStudent />}>
            <Route
              path="/"
              element={
                <StudentLayout>
                  <Dashboard />
                </StudentLayout>
              }
            />
            <Route
              path="/discussions"
              element={<StudentLayout><Discussions /></StudentLayout>}
            />
            <Route
              path="/leaderboard"
              element={<StudentLayout><Leaderboard /></StudentLayout>}
            />
            <Route
              path="/profile"
              element={<StudentLayout><Profile /></StudentLayout>}
            />
            <Route
              path="/progress"
              element={<StudentLayout><Progress /></StudentLayout>}
            />
            <Route
              path="/resources"
              element={<StudentLayout><Resources /></StudentLayout>}
            />
            <Route
              path="/results"
              element={<StudentLayout><Results /></StudentLayout>}
            />
          </Route>

          {/* ADMIN ROUTES (protected) */}
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/leaderboard" element={<AdminLeaderboard />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/security" element={<AdminSecurityLogs />} />
            <Route path="/admin/content" element={<AdminContent />} />
            <Route path="/admin/branches" element={<AdminBranches />} />
            <Route path="/admin/students" element={<AdminStudents />} />
          </Route>


          {/* fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </UserProvider>
    </AuthProvider>
  );
}
