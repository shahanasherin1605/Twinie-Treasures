import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenKey } from "./api";

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem(tokenKey)) {
      setAuthLoading(false);
      return;
    }
    api("/profile").then(({ user: profile }) => setUser(profile)).catch(() => localStorage.removeItem(tokenKey)).finally(() => setAuthLoading(false));
  }, []);

  const authenticate = async (mode, form) => {
    const result = await api(`/auth/${mode}`, { method: "POST", body: form });
    localStorage.setItem(tokenKey, result.token);
    setUser(result.user);
    return result.user;
  };

  const signOut = async () => {
    try { await api("/auth/logout", { method: "POST" }); } catch { /* End the local session even if the server is unavailable. */ }
    localStorage.removeItem(tokenKey);
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const result = await api("/profile", { method: "PATCH", body: updates });
    setUser(result.user);
    return result.user;
  };

  const value = useMemo(() => ({ user, authLoading, authenticate, signOut, updateProfile }), [user, authLoading]);
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used inside UserProvider");
  return context;
}
