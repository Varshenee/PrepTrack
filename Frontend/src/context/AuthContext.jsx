import React, { createContext, useContext, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"; // axios instance

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });

  // LOGIN
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });

      const u = {
        token: data.token,
        role: data.role || data.user?.role,
        email: data.user?.email || email,
        name: data.name,       
        branch: data.branch,
      };

      setUser(u);
      sessionStorage.setItem("auth_user", JSON.stringify(u));
      localStorage.setItem("token", data.token);

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

  // REGISTER (Signup)
  const register = async ({ name, email, branch, password, role }) => {
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        branch,
        password,
        role,
      });

      const u = {
        token: data.token || null,
        role: data.user?.role || role,
        email: data.user?.email || email,
      };

      if (data.token) {
        setUser(u);
        sessionStorage.setItem("auth_user", JSON.stringify(u));
        localStorage.setItem("token", data.token);
      }

      // Redirect to login
      navigate("/login", { replace: true });

      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || "Signup failed",
      };
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const value = useMemo(() => ({ user, login, register, logout }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
