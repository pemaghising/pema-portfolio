export function NoiseOverlay() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-[0.04]"
    >
      <filter id="pg-noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves={2}
          stitchTiles="stitch"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#pg-noise)" />
    </svg>
  );
}

export function ArchitecturalGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 grid grid-cols-editorial gap-x-4 px-6 md:px-10"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-full border-r border-primary/[0.04]" />
      ))}
    </div>
  );
}
