import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";

interface EmptyStateProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCta?: () => void;
  ctaHref?: string;
}

export function EmptyState({ title, subtitle, ctaLabel, onCta, ctaHref }: EmptyStateProps) {
  const CtaWrapper = ctaHref ? "a" : "button";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-mint/10">
        <Heart className="h-7 w-7 text-mint" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">
        {title}
      </h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {subtitle}
      </p>
      <CtaWrapper
        {...(ctaHref
          ? { href: ctaHref }
          : { onClick: onCta })}
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-gradient-love px-5 py-2.5 text-sm font-semibold text-white shadow-glow-pink transition hover:brightness-110"
      >
        {ctaLabel}
        <ArrowRight className="h-4 w-4" />
      </CtaWrapper>
    </motion.div>
  );
}
