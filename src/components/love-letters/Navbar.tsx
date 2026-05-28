import logo from "@/assets/ibloov-logo.jpeg";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="iBloov" className="h-9 w-auto object-contain" />
          <span className="hidden text-xs font-semibold tracking-widest text-mint sm:inline">
            LOVE LETTERS
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="https://auralink.ibloov.com"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full bg-gradient-love px-4 py-2 text-sm font-semibold text-white shadow-glow-pink transition hover:brightness-110 sm:inline-block"
          >
            Claim your venue
          </a>
          <button
            aria-label="Menu"
            className="rounded-full border border-white/10 bg-white/5 p-2 text-foreground/80 hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
