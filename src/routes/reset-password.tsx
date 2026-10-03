import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Set a new password — KarachiBites" },
      { name: "description", content: "Choose a new password for your KarachiBites account." },
      { property: "og:title", content: "Set a new password — KarachiBites" },
      {
        property: "og:description",
        content: "Choose a new password for your KarachiBites account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Password updated. Taking you to the menu…");
    setTimeout(() => navigate({ to: "/", replace: true }), 1200);
  };

  return (
    <div className="min-h-screen bg-cream-subtle flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-cream border border-cream-dark rounded-3xl shadow-xl shadow-black/5 p-7"
      >
        <h1 className="font-display font-extrabold text-2xl text-ink">Set a new password</h1>
        <p className="text-sm text-ink-muted mt-1">
          Enter a new password for your KarachiBites account.
        </p>

        {message && (
          <div className="mt-4 rounded-xl bg-[#303A2B] text-ink text-sm font-medium px-3 py-2">
            {message}
          </div>
        )}

        <input
          type="password"
          required
          autoComplete="new-password"
          className="mt-5 w-full rounded-xl border border-cream-dark bg-cream-subtle px-4 py-3 text-sm text-ink outline-none focus:border-[#718C56]"
          placeholder="New password"
          value={password}
          maxLength={72}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-3 w-full rounded-xl bg-chili hover:bg-chili-hover disabled:opacity-60 text-white font-bold text-sm py-3 transition-colors"
        >
          {busy ? "Saving…" : "Update password"}
        </button>

        <div className="mt-5 text-center text-xs text-ink-muted">
          <Link to="/auth" className="underline">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
}
