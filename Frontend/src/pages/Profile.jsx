import React, { useEffect, useState } from "react";
import API from "../api";
import { useUser } from "../context/UserContext.jsx";

export default function Profile() {
  const { user } = useUser(); // context already stores login data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false); // ✅ Toast state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setProfile(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          rollNumber: data.rollNumber || "",
          branch: data.branch || "",
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
      setSuccess(true); // ✅ Show toast
      setTimeout(() => setSuccess(false), 3000); // Hide after 3s
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  if (loading) {
    return <p className="text-slate-400">Loading profile...</p>;
  }

  return (
    <div className="grid lg:grid-cols-[340px,1fr] gap-6">
      {/* Left Card */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26]">
        <div
          className="w-28 h-28 rounded-full bg-cover mx-auto"
          style={{
            backgroundImage: `url('https://i.pravatar.cc/200?u=${profile.email}')`,
          }}
        />
        <div className="text-center mt-4 text-xl font-semibold">
          {profile.name}
        </div>
        <div className="text-center opacity-70">{profile.rollNumber}</div>
        <div className="mt-6">
          <div className="text-sm opacity-80 mb-2">Overall Progress</div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full w-[75%] bg-emerald-400"></div>
          </div>
          <div className="text-sm opacity-70 mt-1">
            75% of {profile.branch} PYQs completed
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="rounded-2xl p-6 border border-white/10 bg-[#121b26] relative">
        <div className="flex gap-6 text-sm border-b border-white/10 pb-4">
          <button className="px-3 py-1 rounded-lg bg-white/10 border border-white/10">
            Personal Details
          </button>
          <button className="px-3 py-1 rounded-lg hover:bg-white/10 border border-white/10/50">
            Academic Details
          </button>
        </div>

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

        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/10"
            onClick={() => setFormData(profile)}
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

        {/* ✅ Toast Notification */}
        {success && (
          <div className="fixed right-8 bottom-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 px-4 py-3 text-sm text-emerald-300 shadow-lg backdrop-blur-sm transition-all duration-500">
            ✅ Profile updated successfully
          </div>
        )}
      </div>
    </div>
  );
}
