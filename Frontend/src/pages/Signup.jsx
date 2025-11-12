import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [branch, setBranch] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const res = await register({ name, email, rollNumber, branch, password, role });
    setLoading(false);

    if (res.ok) navigate("/login");
    else setErr(res.error || "Signup failed");
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-[#0a0f18] via-[#101926] to-[#0d1723] p-6">
      <div className="w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden grid md:grid-cols-2 border border-white/10 bg-white/5 backdrop-blur-md">
        {/* Left Section */}
        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1400&auto=format&fit=crop"
            alt="signup"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40 p-8 flex flex-col justify-center">
            <h3 className="text-white text-2xl font-bold mb-2">
              Welcome to ExamPrep Portal
            </h3>
            <p className="text-slate-200 max-w-xs leading-relaxed">
              Your journey to academic excellence starts here.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-[#0f1720]/90 p-8 text-slate-100">
          <h2 className="text-2xl font-extrabold mb-1">Create Your Account</h2>
          <p className="text-slate-300 mb-6">
            Join ExamPrep and start your success journey today.
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-slate-300">Full Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 bg-[#0b1114] border border-white/10 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-sky-600"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 bg-[#0b1114] border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-600"
                placeholder="example@college.edu"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Roll Number</label>
              <input
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full mt-2 bg-[#0b1114] border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-600"
                placeholder="AM.SC.U4CSE23140"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300">Academic Branch</label>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full mt-2 bg-[#0b1114] border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-600"
                required
              >
                <option value="">Select your branch</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="MECH">Mechanical</option>
                <option value="CIVIL">Civil</option>
                <option value="CHEM">Chemical</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 bg-[#0b1114] border border-white/10 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-600"
                placeholder="Enter your password"
                required
              />
            </div>

            <div>
              <label className="text-sm text-slate-300 block mb-2">Role</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`px-4 py-2 rounded-lg transition ${
                    role === "student"
                      ? "bg-sky-600 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`px-4 py-2 rounded-lg transition ${
                    role === "admin"
                      ? "bg-sky-600 text-white"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>

            {err && <div className="text-rose-400 text-sm">{err}</div>}

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-500 px-4 py-3 rounded-lg font-semibold transition"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>

            <div className="text-center text-sm text-slate-400 mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-sky-400 hover:underline">
                Log In
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
