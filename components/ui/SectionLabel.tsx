export default function SectionLabel({
  index,
  className = "",
}: {
  index: string;
  className?: string;
}) {
  return (
    <p
      className={`font-sans text-xs uppercase tracking-[0.2em] text-accent ${className}`}
    >
      PG / {index}
    </p>
  );
}
