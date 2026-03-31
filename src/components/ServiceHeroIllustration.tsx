import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  className?: string;
  "aria-hidden"?: boolean;
};

const HERO_PNG_BASE = "/services/hero-png";
/** Brand red for hero artwork (matches requested hex, not pink) */
const HERO_ACCENT = "#9C0E15";

/**
 * PNG hero art: tints colored pixels toward #9C0E15 via mix-blend + same-URL alpha mask
 * (transparent areas stay clear; no whole-image hue-rotate pink wash).
 */
export default function ServiceHeroIllustration({
  slug,
  className,
  "aria-hidden": ariaHidden,
  ...rest
}: Props) {
  const src = `${HERO_PNG_BASE}/${slug}.png`;
  const [resolvedSrc, setResolvedSrc] = useState(src);
  useEffect(() => {
    setResolvedSrc(src);
  }, [src]);

  const maskStyle = {
    backgroundColor: HERO_ACCENT,
    mixBlendMode: "color" as const,
    WebkitMaskImage: `url("${resolvedSrc}")`,
    maskImage: `url("${resolvedSrc}")`,
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskPosition: "right center",
    maskPosition: "right center",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  };

  return (
    <div
      className={cn("relative isolate w-full service-hero-vector-wrap", className)}
      aria-hidden={ariaHidden}
    >
      <img
        src={resolvedSrc}
        alt=""
        className={cn(
          "relative z-0 block w-full h-auto max-w-none lg:w-full",
          "max-h-[min(92vh,980px)] min-h-[260px] sm:min-h-[320px] lg:min-h-0",
          "object-contain object-[right_center]",
          "pointer-events-none select-none"
        )}
        loading="eager"
        decoding="async"
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.dataset.fallbackTried) {
            el.dataset.fallbackTried = "1";
            const fb = `${HERO_PNG_BASE}/mobile-application.png`;
            el.src = fb;
            setResolvedSrc(fb);
          }
        }}
        {...rest}
      />
      <div className="pointer-events-none absolute inset-0 z-[1]" style={maskStyle} aria-hidden />
    </div>
  );
}
