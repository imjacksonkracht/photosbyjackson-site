import Link from "next/link";
import { site } from "@/content/site";

export function BookingCTA() {
  return (
    <section aria-labelledby="booking-title" className="gutter border-t border-line py-28 md:py-40">
      <p className="meta mb-8">Bookings</p>
      <h2 id="booking-title" className="display text-[clamp(3.4rem,10vw,10.5rem)]">
        <span className="md:block">Have something </span>
        <span className="md:block">worth capturing?</span>
      </h2>
      <div className="mt-12 flex flex-col gap-8 md:mt-16 md:flex-row md:items-end md:justify-between">
        <Link
          href="/contact"
          className="group display-medium inline-flex items-center gap-4 text-[clamp(1.9rem,4vw,3.4rem)] text-bone"
        >
          <span className="link-line">Let’s work together</span>
          <span
            aria-hidden
            className="text-ember transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
          >
            ↗
          </span>
        </Link>
        <p className="max-w-sm text-ash">
          Concerts, campus events, and headshots. Or email{" "}
          <a className="link-line text-bone" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          .
        </p>
      </div>
    </section>
  );
}
