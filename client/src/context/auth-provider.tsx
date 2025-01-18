// context/auth-provider.tsx
import React, { createContext, useState, useEffect } from "react";

interface AuthContextProps {
  user: unknown;
  accessToken: string | null;
  setUser: React.Dispatch<React.SetStateAction<unknown>>;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("accessToken");
    console.log(`access tocken local store: `);
    if (savedToken) {
      setAccessToken(savedToken);
      // Do not call `fetchUserProfile` yet; keep it minimal to avoid side effects
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, accessToken, setUser, setAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
