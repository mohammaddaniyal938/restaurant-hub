import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
// @ts-expect-error -- JSX auth provider
import { AuthProvider, useAuth } from "@/lib/auth-context.jsx";

type AuthSearch = { redirect?: string | undefined };
type AuthError = { message: string } | null;
type AuthState = {
  loading: boolean;
  user: { id: string } | null;
  resetPassword: (email: string) => Promise<{ error: AuthError }>;
  signUpWithPassword: (
    email: string,
    password: string,
    fullName: string,
    phone: string,
  ) => Promise<{ error: AuthError; needsConfirmation: boolean }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError }>;
  signInWithGoogle: () => Promise<{ error: AuthError; redirected: boolean }>;
};

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — KarachiBites" },
      {
        name: "description",
        content:
          "Sign in or create your KarachiBites account to save your cart, track live orders and reorder your favourite bites.",
      },
      { property: "og:title", content: "Sign in — KarachiBites" },
      {
        property: "og:description",
        content:
          "Create a KarachiBites account to save favourites, track orders and check out faster.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AuthProvider>
      <AuthPage />
    </AuthProvider>
  ),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" }) as AuthSearch;
  const auth = useAuth() as AuthState;

  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  const safeRedirect =
    search.redirect && search.redirect.startsWith("/") && !search.redirect.startsWith("//")
      ? search.redirect
      : "/";

  useEffect(() => {
    if (!auth.loading && auth.user) {
      navigate({ to: safeRedirect, replace: true });
    }
  }, [auth.loading, auth.user, safeRedirect, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage(null);

    if (mode === "forgot") {
      const { error } = await auth.resetPassword(email.trim());
      setBusy(false);
      setMessage(
        error
          ? { kind: "error", text: error.message }
          : { kind: "info", text: "Password reset link sent. Check your inbox." },
      );
      return;
    }

    if (!email.trim() || password.length < 6) {
      setBusy(false);
      setMessage({
        kind: "error",
        text: "Enter a valid email and a password of at least 6 characters.",
      });
      return;
    }

    if (mode === "signup") {
      const { error, needsConfirmation } = await auth.signUpWithPassword(
        email.trim(),
        password,
        fullName.trim(),
        phone.trim(),
      );
      setBusy(false);
      if (error) {
        setMessage({ kind: "error", text: error.message });
      } else if (needsConfirmation) {
        setMessage({
          kind: "info",
          text: "Account created! Check your email and click the confirmation link to finish signing in.",
        });
      }
      return;
    }

    const { error } = await auth.signInWithPassword(email.trim(), password);
    setBusy(false);
    if (error) setMessage({ kind: "error", text: error.message });
  };

  const handleGoogle = async () => {
    setBusy(true);
    setMessage(null);
    const { error, redirected } = await auth.signInWithGoogle();
    if (error) {
      setBusy(false);
      setMessage({ kind: "error", text: error.message });
      return;
    }
    if (!redirected) setBusy(false);
  };

  return (
    <div className="min-h-screen bg-cream-subtle flex flex-col items-center justify-center px-4 py-10">
      <Link to="/" className="flex items-center gap-2 mb-6">
        <span className="w-11 h-11 rounded-2xl bg-chili flex items-center justify-center text-2xl shadow-lg">
          🍔
        </span>
        <span className="font-display font-extrabold text-2xl tracking-tight text-ink">
          Karachi<span className="text-chili">Bites</span>
        </span>
      </Link>

      <div className="w-full max-w-md bg-cream rounded-3xl shadow-xl shadow-black/5 border border-cream-dark p-6 sm:p-8">
        <h1 className="font-display font-extrabold text-2xl text-ink">
          {mode === "signin" && "Welcome back"}
          {mode === "signup" && "Create your account"}
          {mode === "forgot" && "Reset your password"}
        </h1>
        <p className="text-sm text-ink-muted mt-1">
          {mode === "forgot"
            ? "We'll email you a secure link to set a new password."
            : "Save favourites, track live orders and check out in seconds."}
        </p>

        {message && (
          <div
            className={`mt-4 rounded-xl px-3 py-2 text-sm font-medium ${
              message.kind === "error" ? "bg-chili-light text-chili" : "bg-basil-light text-basil"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {mode === "signup" && (
            <>
              <input
                className="w-full rounded-xl border border-cream-dark bg-cream-subtle px-4 py-3 text-sm text-ink outline-none focus:border-[#D4A017]"
                placeholder="Full name"
                value={fullName}
                maxLength={80}
                onChange={(e) => setFullName(e.target.value)}
              />
              <input
                className="w-full rounded-xl border border-cream-dark bg-cream-subtle px-4 py-3 text-sm text-ink outline-none focus:border-[#D4A017]"
                placeholder="Phone (03xx xxxxxxx)"
                value={phone}
                maxLength={20}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border border-cream-dark bg-cream-subtle px-4 py-3 text-sm text-ink outline-none focus:border-[#D4A017]"
            placeholder="Email address"
            value={email}
            maxLength={255}
            onChange={(e) => setEmail(e.target.value)}
          />

          {mode !== "forgot" && (
            <input
              type="password"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              className="w-full rounded-xl border border-cream-dark bg-cream-subtle px-4 py-3 text-sm text-ink outline-none focus:border-[#D4A017]"
              placeholder="Password"
              value={password}
              maxLength={72}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-chili hover:bg-chili-hover disabled:opacity-60 text-white font-bold text-sm py-3 transition-colors"
          >
            {busy
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </button>
        </form>

        {mode !== "forgot" && (
          <>
            <div className="flex items-center gap-3 my-5">
              <span className="h-px flex-1 bg-cream-dark" />
              <span className="text-[11px] uppercase tracking-wider font-bold text-ink-light">
                or
              </span>
              <span className="h-px flex-1 bg-cream-dark" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="w-full rounded-xl border border-cream-dark bg-cream hover:bg-cream-subtle text-ink font-bold text-sm py-3 flex items-center justify-center gap-2 transition-colors"
            >
              <span className="text-base">G</span> Continue with Google
            </button>
          </>
        )}

        <div className="mt-6 space-y-2 text-center text-xs text-ink-muted">
          {mode === "signin" && (
            <>
              <button
                type="button"
                className="font-bold text-chili"
                onClick={() => setMode("signup")}
              >
                New here? Create an account
              </button>
              <div>
                <button type="button" className="underline" onClick={() => setMode("forgot")}>
                  Forgot your password?
                </button>
              </div>
            </>
          )}
          {mode !== "signin" && (
            <button
              type="button"
              className="font-bold text-chili"
              onClick={() => setMode("signin")}
            >
              Back to sign in
            </button>
          )}
          <div>
            <Link to="/" className="underline">
              Continue browsing as guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
