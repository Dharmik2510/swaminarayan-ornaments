import Link from "next/link";

/**
 * The tilak-chandlo mark, drawn rather than rasterised so it stays crisp at
 * header size and can be animated in the close. Proportions are measured from
 * /logo.jpg: arms about 58% as wide as the mark is tall, the dot a little over
 * a third of the width, sitting just above the middle.
 */
export function TilakMark({
  className,
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 172"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <path
        d="M14 10 V118 A36 36 0 0 0 86 118 V10"
        fill="none"
        stroke="currentColor"
        strokeWidth="20"
        strokeLinecap="round"
      />
      <circle cx="50" cy="78" r="17" fill="var(--vt-chandlo)" />
    </svg>
  );
}

export function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      className="vt-brand"
      aria-label="Swaminarayan Ornaments, home"
      onClick={onNavigate}
    >
      <TilakMark className="vt-brand__mark" />
      <span className="vt-brand__word">
        Swaminarayan
        <small>Ornaments</small>
      </span>
    </Link>
  );
}
