import React, { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // import your axios instance

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });

  // ✅ LOGIN (backend version)
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });

      const u = {
        token: data.token,
        role: data.role,
        email,
      };

      setUser(u);
      sessionStorage.setItem("auth_user", JSON.stringify(u));
      localStorage.setItem("token", data.token); // for axios interceptor

      if (u.role === "admin") navigate("/admin", { replace: true });
      else navigate("/", { replace: true });

      return { ok: true, role: u.role };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Login failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
