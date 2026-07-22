import logo from "@/assets/ibloov-logo.jpeg";
import { Bookmark, User as UserIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getUser, useLocalStore } from "@/lib/love-letters/localStore";

export function Navbar() {
  const user = useLocalStore(getUser);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="iBloov" className="h-8 w-auto object-contain" />
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to="/saved"
            className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-mint/40 hover:text-foreground"
            aria-label="Saved businesses"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </Link>
          <Link
            to="/business"
            className="hidden rounded-full bg-gradient-love px-4 py-1.5 text-xs font-semibold text-white shadow-glow-pink transition hover:brightness-110 sm:inline-block"
          >
            For business
          </Link>
          {user ? (
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-love text-xs font-bold text-white"
              aria-label="Your profile"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name
                  .split(/\s+/)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
              )}
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold text-foreground/70 hover:border-mint/40 hover:text-foreground"
            >
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
