import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Heart, Mail, Lock, User as UserIcon, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/love-letters/Navbar";
import { Footer } from "@/components/love-letters/Footer";
import { signIn } from "@/lib/love-letters/localStore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — iBloov Love Letters" },
      {
        name: "description",
        content:
          "Sign in to save businesses, track your Love Letters, and manage your iBloov profile.",
      },
      { property: "og:title", content: "Sign in — iBloov" },
      { property: "og:description", content: "Sign in to your iBloov account." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter email and password.");
      return;
    }
    if (mode === "signup" && !name.trim()) {
      toast.error("Please enter your name.");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      const u = signIn(email.trim(), mode === "signup" ? name.trim() : undefined);
      toast.success(mode === "signup" ? `Welcome, ${u.name}!` : `Welcome back, ${u.name}!`);
      navigate({ to: "/profile" });
    }, 400);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto flex max-w-md flex-col items-center px-4 py-12">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-mint">
          <Heart className="h-3 w-3 fill-current" /> iBloov account
        </div>
        <h1 className="font-display text-3xl font-bold">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to keep your saved places and letters synced."
            : "Join iBloov to save places and share Love Letters."}
        </p>

        <form
          onSubmit={submit}
          className="mt-6 w-full rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
        >
          {mode === "signup" && (
            <label className="mb-3 block">
              <span className="mb-1 block text-xs font-semibold text-foreground/70">
                Name
              </span>
              <div className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </label>
          )}
          <label className="mb-3 block">
            <span className="mb-1 block text-xs font-semibold text-foreground/70">Email</span>
            <div className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </label>
          <label className="mb-4 block">
            <span className="mb-1 block text-xs font-semibold text-foreground/70">
              Password
            </span>
            <div className="flex items-center gap-2 rounded-xl border border-black/10 px-3 py-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="text-muted-foreground hover:text-foreground"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-gradient-love py-2.5 text-sm font-bold text-white shadow-glow-pink transition hover:brightness-110 disabled:opacity-70"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {mode === "signin" ? "New to iBloov?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-mint hover:underline"
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Are you a business?{" "}
          <Link to="/business" className="font-semibold text-mint hover:underline">
            Sign in to the business portal →
          </Link>
        </p>
      </main>
      <Footer />
    </div>
  );
}
