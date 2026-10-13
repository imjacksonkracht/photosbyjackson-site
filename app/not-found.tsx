import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[80svh] flex-col justify-end pb-24 pt-32">
      <p className="meta mb-6">404</p>
      <h1 className="display text-[clamp(4rem,14vw,13rem)]">Missed this one.</h1>
      <p className="mt-6 max-w-md text-lg text-ash">This page doesn’t exist, or it moved when the site was rebuilt.</p>
      <div className="mt-10 flex gap-8 text-sm">
        <Link href="/work" className="link-line text-bone">See the work</Link>
        <Link href="/" className="link-line text-bone">Go home</Link>
      </div>
    </div>
  );
}
