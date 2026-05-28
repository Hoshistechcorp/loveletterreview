export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-8 text-center text-xs text-muted-foreground">
      <p>
        Made with 💌 by <span className="font-semibold text-foreground">iBloov</span>
        {" — "}solving for X, where X = Love.
      </p>
      <p className="mt-1">
        <a
          href="https://ibloov.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-mint"
        >
          ibloov.com
        </a>{" "}
        ·{" "}
        <a
          href="https://auralink.ibloov.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-neon-pink"
        >
          auralink.ibloov.com
        </a>
      </p>
    </footer>
  );
}
