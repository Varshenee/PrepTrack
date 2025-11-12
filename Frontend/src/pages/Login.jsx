import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [tab, setTab] = useState("student"); // student | admin (cosmetic)
  const [username, setUsername] = useState("");
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    // call backend login
    const res = await login(username, pwd);

    if (!res.ok) setErr(res.error || "Login failed");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1400&auto=format&fit=crop')] bg-cover bg-center">
      <div className="min-h-screen backdrop-blur-[2px] bg-black/50 grid place-items-center">
        <div className="w-[95%] max-w-xl rounded-2xl border border-white/10 bg-[#121b26]/90 p-6 shadow-xl">
          <div className="text-center mb-5">
            <div className="text-2xl font-bold">ExamPrep Portal</div>
            <div className="opacity-70">Sign in to your account</div>
          </div>

          {/* Tabs (cosmetic) */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-white/10 border border-white/10 mb-4">
            <button
              onClick={() => setTab("student")}
              className={`py-2 rounded-lg ${tab === "student" ? "bg-sky-600" : ""}`}
              type="button"
            >
              Student
            </button>
            <button
              onClick={() => setTab("admin")}
              className={`py-2 rounded-lg ${tab === "admin" ? "bg-sky-600" : ""}`}
              type="button"
            >
              Administrator
            </button>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <div className="text-sm mb-1">
                {tab === "admin" ? "Admin Username" : "Email or Roll Number"}
              </div>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={tab === "admin" ? "admin@example.com" : "student@example.com"}
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
                required
              />
            </div>

            <div>
              <div className="text-sm mb-1">Password</div>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-80"
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {tab !== "admin" && (
                <div className="text-xs opacity-70 mt-1">
                  Use your registered password.
                </div>
              )}
            </div>

            {err && <div className="text-rose-300 text-sm">{err}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 font-semibold disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="text-center opacity-70 text-sm mt-4">
            © 2025 ExamPrep Portal
          </div>
        </div>
      </div>
    </div>
  );
}
