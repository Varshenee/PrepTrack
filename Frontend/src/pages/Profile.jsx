import React, { useEffect, useState } from "react";
import API from "../api";
import { useUser } from "../context/UserContext.jsx";

export default function Profile() {
  const { user: loggedUser, setUser } = useUser();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [tab, setTab] = useState("personal");
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setProfile(data);

        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          rollNumber: data.rollNumber || "",
          branch: data.branch || "",
          year: data.year || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const { data } = await API.put("/auth/profile", formData);

      setProfile(data);
      setUser(data);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) return <p className="text-slate-400">Loading profile...</p>;

  return (
    <div className="grid lg:grid-cols-[340px,1fr] gap-6">

      {/* LEFT CARD */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
        {/* DEFAULT USER ICON */}
        <div className="w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-14 h-14 text-slate-300"
          >
            <path
              fillRule="evenodd"
              d="M12 2a5 5 0 100 10 5 5 0 000-10zm-7 18a7 7 0 1114 0H5z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div className="text-center mt-4 text-xl font-semibold">
          {profile.name}
        </div>
        <div className="text-center opacity-70">{profile.rollNumber}</div>

        {/* REAL BACKEND PROGRESS */}
        <div className="mt-6">
          <div className="text-sm opacity-80 mb-2">Overall Progress</div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-emerald-400 transition-all"
              style={{ width: `${profile.progressPercent || 0}%` }}
            />
          </div>
          <div className="text-sm opacity-70 mt-1">
            {profile.progressPercent || 0}% of {profile.branch} goals completed
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26] relative">

        {/* TABS */}
        <div className="flex gap-6 text-sm border-b border-white/10 pb-4">
          <button
            className={`px-3 py-1 rounded-lg ${
              tab === "personal"
                ? "bg-white/10 border border-white/10"
                : "hover:bg-white/10 border border-white/10/50"
            }`}
            onClick={() => setTab("personal")}
          >
            Personal Details
          </button>

          <button
            className={`px-3 py-1 rounded-lg ${
              tab === "academic"
                ? "bg-white/10 border border-white/10"
                : "hover:bg-white/10 border border-white/10/50"
            }`}
            onClick={() => setTab("academic")}
          >
            Academic Details
          </button>
        </div>

        {/* PERSONAL TAB */}
        {tab === "personal" && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-sm opacity-80 mb-1">Full Name</div>
              <input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm opacity-80 mb-1">Contact Email</div>
              <input
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>

            <div className="md:col-span-2">
              <div className="text-sm opacity-80 mb-1">Phone Number</div>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="Add phone number"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>
          </div>
        )}

        {/* ACADEMIC TAB */}
        {tab === "academic" && (
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div>
              <div className="text-sm opacity-80 mb-1">Roll Number</div>
              <input
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData({ ...formData, rollNumber: e.target.value })
                }
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm opacity-80 mb-1">Branch</div>
              <input
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
              />
            </div>

            <div>
              <div className="text-sm opacity-80 mb-1">Current Year</div>
              <input
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2"
                placeholder="E.g., 2nd Year"
              />
            </div>
          </div>
        )}

        {/* SAVE/CANCEL BUTTONS */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
            onClick={() =>
              setFormData({
                name: profile.name,
                email: profile.email,
                phone: profile.phone,
                rollNumber: profile.rollNumber,
                branch: profile.branch,
                year: profile.year,
              })
            }
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500"
            onClick={handleSave}
          >
            Save Changes
          </button>
        </div>

        {/* SUCCESS TOAST */}
        {success && (
          <div className="fixed right-8 bottom-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-300 shadow-lg backdrop-blur-sm">
            ✅ Profile updated successfully
          </div>
        )}
      </div>
    </div>
  );
}
