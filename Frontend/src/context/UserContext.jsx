import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import API from "../api";

const UserCtx = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/me"); // backend route
        setUser(data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);
  return <UserCtx.Provider value={value}>{children}</UserCtx.Provider>;
}

export function useUser() {
  return useContext(UserCtx);
}
