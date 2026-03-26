import {
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextType {
  luidId: string | null;
  setLuidId: (id: string | null) => void;
  logout: () => void;
  isAdminLoggedIn: boolean;
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [luidId, setLuidIdState] = useState<string | null>(() =>
    localStorage.getItem("luidMarketUser"),
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(
    () => localStorage.getItem("adminAuth") === "true",
  );

  const setLuidId = (id: string | null) => {
    setLuidIdState(id);
    if (id) localStorage.setItem("luidMarketUser", id);
    else localStorage.removeItem("luidMarketUser");
  };

  const logout = () => setLuidId(null);

  const adminLogin = (username: string, password: string): boolean => {
    if (username === "SidneiCosta00" && password === "Nikebolado@4") {
      localStorage.setItem("adminAuth", "true");
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    localStorage.removeItem("adminAuth");
    setIsAdminLoggedIn(false);
  };

  useEffect(() => {
    const stored = localStorage.getItem("luidMarketUser");
    if (stored) setLuidIdState(stored);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        luidId,
        setLuidId,
        logout,
        isAdminLoggedIn,
        adminLogin,
        adminLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
