import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

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
  signInWithGoogle: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  signOut: async () => {},
  refreshRoles: async () => {},
});

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [roles, setRoles] = useState([]);
  const [profile, setProfile] = useState(null);

  const user = session?.user ?? null;

  const loadRolesAndProfile = useCallback(async (currentUser) => {
    if (!currentUser) {
      setRoles([]);
      setProfile(null);
      return;
    }

    const [{ data: roleRows }, { data: profileRow }] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", currentUser.id),
      supabase.from("profiles").select("*").eq("id", currentUser.id).maybeSingle(),
    ]);

    setRoles((roleRows || []).map((r) => r.role));

    if (profileRow) {
      setProfile(profileRow);
    } else {
      // First sign-in: create the customer profile record.
      const { data: created } = await supabase
        .from("profiles")
        .insert({
          id: currentUser.id,
          full_name:
            currentUser.user_metadata?.full_name ||
            currentUser.user_metadata?.name ||
            currentUser.email?.split("@")[0] ||
            "",
          phone: currentUser.user_metadata?.phone || null,
          avatar_url: currentUser.user_metadata?.avatar_url || null,
        })
        .select()
        .maybeSingle();
      setProfile(created || null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession ?? null);
      if (event === "SIGNED_OUT") {
        setRoles([]);
        setProfile(null);
      }
    });

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    })();

    return () => {
      active = false;
      subscription?.subscription?.unsubscribe?.();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setRoles([]);
      setProfile(null);
      return;
    }
    loadRolesAndProfile(user);
  }, [user?.id, loadRolesAndProfile]);

  const value = useMemo(() => {
    const isAdmin = roles.includes("admin");
    const isStaff = isAdmin || roles.includes("staff");

    return {
      loading,
      session,
      user,
      roles,
      isAdmin,
      isStaff,
      profile,
      refreshRoles: () => loadRolesAndProfile(user),
      signInWithPassword: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
      },
      signUpWithPassword: async (email, password, fullName, phone) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName || "", phone: phone || "" },
          },
        });
        return { error, needsConfirmation: !error && !data.session };
      },
      signInWithGoogle: async () => {
        const result = await lovable.auth.signInWithOAuth("google", {
          redirect_uri: window.location.origin,
        });
        return { error: result.error ?? null, redirected: Boolean(result.redirected) };
      },
      resetPassword: async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error };
      },
      signOut: async () => {
        await supabase.auth.signOut();
        setRoles([]);
        setProfile(null);
      },
    };
  }, [loading, session, user, roles, profile, loadRolesAndProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
