export const FLOATING_LOGO_SRC = "/images/logos/genchemph-logo-transparent.png";

export default function FloatingLogo() {
  return (
    <div className="floating-logo" aria-hidden={false}>
      <div className="floating-logo__mark">
        <img
          className="floating-logo__img"
          src={FLOATING_LOGO_SRC}
          alt="GenChem"
          width={300}
          height={168}
          decoding="async"
        />
      </div>
    </div>
  );
}
