import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [hasRecovery, setHasRecovery] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Supabase puts type=recovery in the URL hash when arriving from the email link.
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (hash.includes("type=recovery")) setHasRecovery(true);

    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setHasRecovery(true);
    });
    setReady(true);
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (password.length < 6) return toast.error("Password must be at least 6 characters.");
    if (password !== confirm) return toast.error("Passwords don't match.");
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You're signed in.");
      navigate({ to: "/business" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-12 sm:py-16">
        <Link
          to="/business"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-foreground/60 hover:text-mint"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="mb-6 text-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-mint">
              <Sparkles className="h-3 w-3" /> Reset password
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold">
              Set a new <span className="text-gradient-love">password</span>
            </h1>
            <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/65">
              Choose a strong password to get back into your business dashboard.
            </p>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-7">
            {!ready ? (
              <div className="flex justify-center py-6 text-foreground/50">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : !hasRecovery ? (
              <p className="text-center text-sm text-foreground/65">
                This link is invalid or expired. Request a new password reset email
                from the sign-in page.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="New password (min 6)"
                    className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
                  />
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Confirm new password"
                    className="w-full rounded-full border border-foreground/15 bg-foreground/[0.03] px-10 py-3 text-sm outline-none transition focus:border-mint/60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting || password.length < 6}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-love px-4 py-3 text-sm font-bold text-white shadow-glow-pink transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Update password <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
