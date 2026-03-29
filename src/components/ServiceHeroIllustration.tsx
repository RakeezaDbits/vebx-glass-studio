import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  className?: string;
  "aria-hidden"?: boolean;
};

const HERO_PNG_BASE = "/services/hero-png";

/** Generated PNG hero art per service — theme-matched isometric illustrations (not inline SVG). */
export default function ServiceHeroIllustration({ slug, className, ...rest }: Props) {
  const src = `${HERO_PNG_BASE}/${slug}.png`;

  return (
    <img
      src={src}
      alt=""
      className={cn(
        "w-full h-auto max-w-none lg:w-full",
        "max-h-[min(92vh,980px)] min-h-[260px] sm:min-h-[320px] lg:min-h-0",
        "object-contain object-[right_center]",
        "pointer-events-none select-none",
        "drop-shadow-[0_0_100px_hsl(var(--primary)/0.22)]",
        className
      )}
      loading="eager"
      decoding="async"
      onError={(e) => {
        const el = e.currentTarget;
        if (!el.dataset.fallbackTried) {
          el.dataset.fallbackTried = "1";
          el.src = `${HERO_PNG_BASE}/mobile-application.png`;
        }
      }}
      {...rest}
    />
  );
}
