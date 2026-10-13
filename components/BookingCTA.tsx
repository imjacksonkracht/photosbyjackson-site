import Link from "next/link";

export function BookingCTA() {
  return (
    <section aria-labelledby="booking-title" className="gutter border-t border-line py-20 md:py-28">
      <h2 id="booking-title" className="display text-[clamp(3.2rem,9vw,9.5rem)]">
        <span className="md:block">Have something </span>
        <span className="md:block">worth capturing?</span>
      </h2>
      <Link
        href="/contact"
        className="group display-medium mt-8 inline-flex items-center gap-4 text-[clamp(1.7rem,3.4vw,3rem)] text-bone md:mt-10"
      >
        <span className="link-line">Let’s work together</span>
        <span
          aria-hidden
          className="text-ember transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1"
        >
          ↗
        </span>
      </Link>
    </section>
  );
}
