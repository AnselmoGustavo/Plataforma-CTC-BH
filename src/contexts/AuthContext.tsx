import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type User = { id: string; email: string; name?: string } | null;

type AuthContextType = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser({ 
          id: session.user.id, 
          email: session.user.email || '', 
          name: session.user.user_metadata?.name 
        });
      } else {
        setUser(null);
      }
    } catch (err: unknown) {
      console.error("Failed to fetch profile", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ 
          id: session.user.id, 
          email: session.user.email || '', 
          name: session.user.user_metadata?.name 
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser({ 
          id: data.user.id, 
          email: data.user.email || '', 
          name: data.user.user_metadata?.name 
        });
        toast.success("Login realizado com sucesso!");
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Erro ao fazer login";
      console.error("Login error:", errorMessage, err);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setUser({ 
          id: data.user.id, 
          email: data.user.email || '', 
          name: data.user.user_metadata?.name 
        });
      }

      toast.success("Cadastro realizado! Verifique seu email para confirmar.");
    } catch (err: any) {
      const errorMessage = err?.message || "Erro ao criar conta";
      console.error("SignUp error:", errorMessage, err);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }

    try {
      // Usa o client do Supabase para incluir apikey + bearer automaticamente
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;

      localStorage.removeItem("token");
      setUser(null);
      toast.success("Logout realizado com sucesso!");
    } catch (err: any) {
      console.error("Logout error:", err?.message || err);
      toast.error(err?.message || "Erro ao fazer logout");
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
