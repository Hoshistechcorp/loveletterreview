export const countWords = (s: string): number => {
  const trimmed = s.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
};

export const clampWords = (s: string, max: number): string => {
  const parts = s.split(/(\s+)/);
  let count = 0;
  const out: string[] = [];
  for (const p of parts) {
    if (/^\s+$/.test(p)) {
      out.push(p);
    } else if (p.length) {
      if (count < max) {
        out.push(p);
        count++;
      } else {
        break;
      }
    }
  }
  return out.join("");
};
