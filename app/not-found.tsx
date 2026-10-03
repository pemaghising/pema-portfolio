import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-svh flex-col items-start justify-center gap-6 px-(--gutter)">
      <p className="font-pixel text-foam">ERROR 404 · NO TAPE</p>
      <h1 className="font-display text-[clamp(40px,8vw,120px)] leading-[0.9]">Nothing on this side.</h1>
      <Link href="/" className="label rounded-full border-[1.5px] border-graphite px-3 py-2 hover:bg-graphite hover:text-studio">
        Back to the rack
      </Link>
    </main>
  );
}
