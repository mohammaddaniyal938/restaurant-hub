import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/services/api";

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
  const [currentPassword, setCurrentPassword] = useState("");
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
    try {
      await api.auth.changePassword({ currentPassword, newPassword: password });
      setMessage("Password updated successfully. Taking you to the menu…");
      setTimeout(() => navigate({ to: "/", replace: true }), 1200);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Password update failed. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-subtle flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-cream border border-cream-dark rounded-3xl shadow-xl shadow-black/5 p-7"
      >
        <h1 className="font-display font-extrabold text-2xl text-ink">Change Password</h1>
        <p className="text-sm text-ink-muted mt-1">
          Enter your current and new password for your KarachiBites account.
        </p>

        {message && (
          <div className="mt-4 rounded-xl bg-[#3B3020] text-ink text-sm font-medium px-3 py-2">
            {message}
          </div>
        )}

        <input
          type="password"
          required
          autoComplete="current-password"
          className="mt-5 w-full rounded-xl border border-cream-dark bg-cream-subtle px-4 py-3 text-sm text-ink outline-none focus:border-[#D4A017]"
          placeholder="Current password"
          value={currentPassword}
          maxLength={72}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          required
          autoComplete="new-password"
          className="mt-3 w-full rounded-xl border border-cream-dark bg-cream-subtle px-4 py-3 text-sm text-ink outline-none focus:border-[#D4A017]"
          placeholder="New password"
          value={password}
          maxLength={72}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          disabled={busy}
          className="mt-4 w-full rounded-xl bg-chili hover:bg-chili-hover disabled:opacity-60 text-white font-bold text-sm py-3 transition-colors cursor-pointer"
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
