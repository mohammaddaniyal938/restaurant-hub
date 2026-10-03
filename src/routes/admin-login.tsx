import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/lib/auth-context.jsx";
import { supabase } from "@/integrations/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";

export const Route = createFileRoute("/admin-login")({
  ssr: false,
  component: () => (
    <AuthProvider>
      <AdminLoginPage />
    </AuthProvider>
  ),
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  useEffect(() => {
    if (!auth.loading && auth.user) {
      if (auth.isAdmin) {
        navigate({ to: "/admin", replace: true });
      } else {
        setMessage({
          kind: "error",
          text: "This account is not authorized for the admin dashboard.",
        });
      }
    }
  }, [auth.loading, auth.user, auth.isAdmin, navigate]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || password.length < 6) {
      setBusy(false);
      setMessage({
        kind: "error",
        text: "Enter a valid admin email and password.",
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error) {
      setBusy(false);
      setMessage({
        kind: "error",
        text: error.message || "Invalid admin email or password.",
      });
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setBusy(false);
      setMessage({
        kind: "error",
        text: "The session could not be validated. Please try again.",
      });
      return;
    }

    const { data: roles, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (roleError || !roles?.some((row) => row.role === "admin")) {
      await supabase.auth.signOut();
      setBusy(false);
      setMessage({
        kind: "error",
        text: "This account does not have administrator access.",
      });
      return;
    }

    setBusy(false);
    navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="min-h-screen bg-[#171B19] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] border border-[#3D4540] bg-[#252B28] p-6 shadow-[0_30px_80px_rgba(28,23,21,0.08)] sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#718C56] text-2xl shadow-lg shadow-[#718C56]/25">
              🏪
            </div>
            <div>
              <p className="font-display text-2xl font-extrabold text-[#E4E8E5]">
                Karachi<span className="text-[#718C56]">Bites</span>
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#718C56]">
                Admin Access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/" className="text-xs font-bold text-[#AFB8B0] hover:text-[#E4E8E5]">
              Storefront
            </Link>
          </div>
        </div>

        <h1 className="mt-6 font-display text-3xl font-extrabold text-[#E4E8E5]">
          Admin Login
        </h1>
        <p className="mt-2 text-sm text-[#AFB8B0]">
          Sign in with the authorized administrator account to manage orders, menu, and kitchen ops.
        </p>

        {message && (
          <div
            className={`mt-4 rounded-xl border px-3 py-2 text-sm font-medium ${
              message.kind === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-[#AFB8B0]">
              Admin Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#3D4540] bg-[#171B19] px-4 py-3 text-sm text-[#E4E8E5] outline-none transition focus:border-[#718C56]"
              placeholder="admin@karachibites.com"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-[#AFB8B0]">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#3D4540] bg-[#171B19] px-4 py-3 text-sm text-[#E4E8E5] outline-none transition focus:border-[#718C56]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-[#718C56] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#607A46] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Signing in..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
