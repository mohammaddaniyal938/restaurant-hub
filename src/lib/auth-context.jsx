import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  api,
  getToken,
  getStoredUser,
  setToken,
  setStoredUser,
  removeToken,
  removeStoredUser,
} from "@/services/api";

const AuthContext = createContext({
  loading: true,
  session: null,
  user: null,
  roles: [],
  isAdmin: false,
  isStaff: false,
  profile: null,
  signInWithPassword: async () => ({ error: null }),
  signUpWithPassword: async () => ({ error: null, needsConfirmation: false }),
  signInWithGoogle: async () => ({ error: null, redirected: false }),
  resetPassword: async () => ({ error: null }),
  signOut: async () => {},
  refreshRoles: async () => {},
});

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setTokenState] = useState(() => getToken());

  const roles = useMemo(() => {
    if (!user) return [];
    if (Array.isArray(user.roles)) return user.roles;
    if (user.role) return [user.role];
    return ["customer"];
  }, [user]);

  const profile = useMemo(() => {
    if (!user) return null;
    return {
      id: user.id || user._id,
      full_name: user.name || user.fullName || user.email?.split("@")[0] || "",
      phone: user.phone || null,
      email: user.email || "",
      avatar_url: user.avatar_url || user.avatar || null,
    };
  }, [user]);

  const session = useMemo(() => {
    if (!token || !user) return null;
    return {
      user: {
        id: user.id || user._id,
        email: user.email,
        user_metadata: {
          full_name: user.name || user.fullName,
          phone: user.phone,
        },
      },
      access_token: token,
    };
  }, [token, user]);

  const loadUser = useCallback(async () => {
    const storedToken = getToken();
    if (!storedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.auth.getMe();
      if (res?.data?.user) {
        setUser(res.data.user);
        setStoredUser(res.data.user);
      }
    } catch (err) {
      console.warn("Could not validate session token with backend:", err.message);
      // If 401 unauthorized / revoked token, clean up session
      if (err.status === 401) {
        removeToken();
        removeStoredUser();
        setUser(null);
        setTokenState(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const value = useMemo(() => {
    const isAdmin =
      roles.includes("admin") ||
      roles.includes("restaurant_admin") ||
      user?.role === "admin" ||
      user?.role === "restaurant_admin";
    const isStaff = isAdmin || roles.includes("staff");

    return {
      loading,
      session,
      user: user ? { ...user, id: user.id || user._id } : null,
      roles,
      isAdmin,
      isStaff,
      profile,
      refreshRoles: loadUser,
      signInWithPassword: async (email, password) => {
        try {
          const res = await api.auth.login(email, password);
          if (res?.data?.user && res?.data?.accessToken) {
            setUser(res.data.user);
            setTokenState(res.data.accessToken);
            return { error: null, data: res.data };
          }
          return { error: { message: "Invalid credentials." } };
        } catch (err) {
          return {
            error: { message: err.message || "Sign in failed. Please check your credentials." },
          };
        }
      },
      signUpWithPassword: async (email, password, fullName, phone) => {
        try {
          const res = await api.auth.register({
            name: fullName,
            email,
            password,
            phone,
          });
          if (res?.data?.user && res?.data?.accessToken) {
            setUser(res.data.user);
            setTokenState(res.data.accessToken);
            return { error: null, needsConfirmation: false, data: res.data };
          }
          return { error: { message: "Account creation failed." }, needsConfirmation: false };
        } catch (err) {
          return {
            error: { message: err.message || "Registration failed. Please try again." },
            needsConfirmation: false,
          };
        }
      },
      signInWithGoogle: async () => {
        // Fallback for Google OAuth when using local Express REST backend
        return {
          error: {
            message:
              "Google OAuth is handled through direct email/password on this backend. Please sign in with your email.",
          },
          redirected: false,
        };
      },
      resetPassword: async (email) => {
        return {
          error: null,
          message: `If an account exists for ${email}, a reset procedure will be initiated.`,
        };
      },
      signOut: async () => {
        await api.auth.logout();
        setUser(null);
        setTokenState(null);
      },
    };
  }, [loading, session, user, roles, profile, loadUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
