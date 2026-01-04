import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { getProfile as apiGetProfile, login as apiLogin } from "@/services/auth";
import { toast } from "sonner";

type User = { id: number; email: string; name?: string } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await apiGetProfile();
      setUser({ id: data.id, email: data.email, name: data.name });
    } catch (err: unknown) {
      console.error("Failed to fetch profile", err);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (!user) {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      return;
    }

    const resetInactivityTimer = () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      inactivityTimerRef.current = setTimeout(() => {
        if (user) {
          localStorage.removeItem("token");
          setUser(null);
          toast.error("Você foi desconectado por inatividade (40 segundos sem interação).");
        }
        inactivityTimerRef.current = null;
      }, 40000);
    };

    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    resetInactivityTimer();

    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer, true);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer, true);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      if (!data || !data.token) {
        throw new Error("Token não recebido do servidor");
      }
      
      const token = data.token;
      localStorage.setItem("token", token);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      try {
        const profileData = await apiGetProfile();
        if (profileData && profileData.id) {
          setUser({ id: profileData.id, email: profileData.email, name: profileData.name });
          setLoading(false);
          toast.success("Login realizado com sucesso!");
        } else {
          throw new Error("Dados do perfil inválidos");
        }
      } catch (profileErr: unknown) {
        console.error("Failed to fetch profile after login", profileErr);
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        const error = profileErr as { response?: { data?: { message?: string } }; message?: string };
        toast.error(error?.response?.data?.message || error?.message || "Erro ao carregar perfil do usuário");
        throw profileErr;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = error?.response?.data?.message || error?.message || "Erro ao fazer login";
      console.error("Login error:", errorMessage, err);
      toast.error(errorMessage);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
