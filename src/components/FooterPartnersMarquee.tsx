import { PARTNER_LOGOS, partnerLogoImgClass } from "@/data/partners";

const cardClass =
  "border-glow relative w-full overflow-x-clip rounded-none border border-white/10 bg-background py-5 shadow-[0_0_48px_-16px_hsla(357,90%,26%,0.28)] md:py-6";

function LogoMarqueeInner() {
  return (
    <div className="min-w-0 py-1">
      <div className="flex w-max animate-[marquee_45s_linear_infinite] motion-reduce:animate-none will-change-transform hover:[animation-play-state:paused]">
        {[0, 1].map((strip) => (
          <div
            key={strip}
            className="flex shrink-0 items-center gap-10 py-1 sm:gap-12 md:gap-16 lg:gap-20"
            aria-hidden={strip === 1}
          >
            {PARTNER_LOGOS.map((p) => (
              <div
                key={`${strip}-${p.src}`}
                className="flex shrink-0 items-center justify-center px-2 sm:px-3"
              >
                <div className="inline-flex max-w-[min(85vw,240px)] items-center justify-center opacity-90 transition-opacity hover:opacity-100">
                  <img
                    src={p.src}
                    alt={p.name}
                    width={220}
                    height={72}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className={partnerLogoImgClass("tone" in p ? p.tone : undefined, "footer")}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type Props = {
  /** `footer`: above social dock with top border. `inline`: between Partners heading & copy on home. */
  variant?: "footer" | "inline";
};

export default function FooterPartnersMarquee({ variant = "footer" }: Props) {
  const strip = (
    <div className={cardClass}>
      <LogoMarqueeInner />
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 my-8 md:my-10">
        {strip}
      </div>
    );
  }

  return (
    <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-t border-white/10">
      {strip}
    </div>
  );
}
