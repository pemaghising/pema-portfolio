import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="surface-ink grid min-h-[100svh] content-end px-[var(--margin)] pb-[var(--margin)]">
      <p className="t-micro muted mb-6">404 — Missing frame</p>
      <h1 className="wide text-[clamp(3rem,12vw,14rem)] leading-[0.85] font-bold tracking-[-0.05em]">Cut.</h1>
      <Link href="/" className="link-u t-micro mt-10 w-fit">
        Back to the opening frame
      </Link>
    </main>
  );
}
