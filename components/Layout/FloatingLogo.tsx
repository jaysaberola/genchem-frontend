export const FLOATING_LOGO_SRC =
  "/images/genchemph/logos/genchemph-logo-transparent.png";

type FloatingLogoVariant = "home" | "subpage";

interface FloatingLogoProps {
  variant?: FloatingLogoVariant;
}

export default function FloatingLogo({ variant = "subpage" }: FloatingLogoProps) {
  return (
    <div
      className={[
        "floating-logo",
        variant === "home" ? "floating-logo--home" : "floating-logo--subpage",
      ].join(" ")}
      aria-hidden={false}
    >
      <div className="floating-logo__inner">
        <div className="floating-logo__mark">
          <img
            className="floating-logo__img py-2"
            src={FLOATING_LOGO_SRC}
            alt="GenChem"
            width={300}
            height={168}
            decoding="async"
          />
        </div>
      </div>
    </div>
  );
}
