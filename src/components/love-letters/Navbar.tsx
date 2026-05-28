import logo from "@/assets/ibloov-logo.jpeg";
import { Menu } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="iBloov" className="h-8 w-auto object-contain" />
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
            className="rounded-full border border-black/10 bg-white p-2 text-foreground/80 hover:bg-black/5"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>

  );
}
