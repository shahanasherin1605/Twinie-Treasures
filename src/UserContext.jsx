import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const UserContext = createContext(null);
const storageKey = "twinie-treasures-user";
const defaultUser = {
  name: "Twinie Shopper",
  email: "",
  phone: "",
  address: "",
};

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      return stored ? { ...defaultUser, ...JSON.parse(stored) } : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(user));
  }, [user]);

  const updateProfile = (updates) => {
    setUser((current) => ({ ...current, ...updates }));
  };

  const value = useMemo(() => ({ user, updateProfile }), [user]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return context;
}
