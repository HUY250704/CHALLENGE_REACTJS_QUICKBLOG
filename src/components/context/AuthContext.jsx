/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { authApi } from "@/components/services/api/auth";

const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const value = localStorage.getItem("user");
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

function normalizeAuthResponse(data) {
  return {
    accessToken: findAccessToken(data),
    user: normalizeUserResponse(data),
  };
}

function getResponseCandidates(data) {
  return [data, data?.data, data?.result, data?.metadata].filter(Boolean);
}

function findAccessToken(data) {
  for (const item of getResponseCandidates(data)) {
    const token =
      item?.accessToken ||
      item?.access_token ||
      item?.token ||
      item?.jwt ||
      item?.access?.token ||
      item?.tokens?.accessToken ||
      item?.tokens?.access_token ||
      item?.tokens?.token;

    if (token) return token;
  }

  return null;
}

function normalizeUserResponse(data) {
  for (const item of getResponseCandidates(data)) {
    const user = item?.user || item?.account || item?.profile || item?.currentUser;
    if (user) return user;

    const inferredUser = inferUserFromObject(item);
    if (inferredUser) return inferredUser;
  }

  return null;
}

function inferUserFromObject(value) {
  if (!value || typeof value !== "object") return null;
  const hasUserShape = value.email || value.username || value.role || value.id || value._id;
  if (!hasUserShape) return null;

  const user = { ...value };
  delete user.accessToken;
  delete user.access_token;
  delete user.token;
  delete user.jwt;
  delete user.access;
  delete user.tokens;
  delete user.password;
  return user;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem("accessToken"));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("accessToken")));
  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    const syncLogout = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth:logout", syncLogout);
    return () => window.removeEventListener("auth:logout", syncLogout);
  }, []);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const data = await authApi.me();
        const nextUser = normalizeUserResponse(data);
        if (!nextUser) throw new Error("Invalid auth response");
        if (active) {
          setUser(nextUser);
          localStorage.setItem("user", JSON.stringify(nextUser));
        }
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [token]);

  const persistSession = useCallback(async (data) => {
    const session = normalizeAuthResponse(data);
    if (!session.accessToken) {
      throw new Error("Invalid auth response");
    }
    localStorage.setItem("accessToken", session.accessToken);

    let nextUser = session.user;
    if (!nextUser) {
      const me = await authApi.me();
      nextUser = normalizeUserResponse(me);
    }

    if (!nextUser) {
      localStorage.removeItem("accessToken");
      throw new Error("Invalid auth response");
    }

    localStorage.setItem("user", JSON.stringify(nextUser));
    setToken(session.accessToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(async (payload) => {
    const data = await authApi.login(payload);
    await persistSession(data);
    toast.success("Login successful");
    return data;
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const data = await authApi.register(payload);
    await persistSession(data);
    toast.success("Account created");
    return data;
  }, [persistSession]);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    toast.success("Logged out");
  }, []);

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated, login, logout, register }),
    [user, token, loading, isAuthenticated, login, logout, register],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
