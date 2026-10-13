import Link from "next/link";
import { Picture } from "@/components/Picture";
import { Reveal } from "@/components/Reveal";

export function AboutTeaser() {
  return (
    <section aria-labelledby="about-title" className="gutter py-28 md:py-44">
      <div className="grid gap-12 md:grid-cols-12 md:gap-x-6">
        <div className="md:col-span-6">
          <p className="meta mb-6">About</p>
          <h2 id="about-title" className="display text-[clamp(3rem,8vw,7.5rem)]">
            Usually near the stage.
          </h2>
        </div>
        <Reveal className="md:col-span-5 md:col-start-8 md:self-end">
          <div className="space-y-5 text-lg leading-relaxed text-bone/90">
            <p>
              I’m Jackson Kracht, a student at the University of Florida and the photographer behind Photos by
              Jackson.
            </p>
            <p className="text-ash">
              I shoot concerts, campus events, and portraits around Gainesville. Whatever the event, I’m
              looking for the real moment, not a posed version of it.
            </p>
          </div>
          <Link href="/about" className="link-line mt-8 inline-block pb-0.5 text-sm">
            More about me
          </Link>
        </Reveal>
        <Reveal className="col-span-full grid grid-cols-12 gap-x-6 md:mt-10">
          <figure className="col-span-7 md:col-span-3 md:col-start-2">
            <Picture id="live-from-the-lawn-guitar-detail-01" ratio={4 / 5} sizes="(min-width: 768px) 25vw, 58vw" />
            <figcaption className="exposure mt-3">Live From the Lawn, 2026</figcaption>
          </figure>
          <figure className="col-span-5 mt-24 md:col-span-4 md:col-start-6 md:mt-40">
            <Picture id="petty-theft-singer-01" ratio={3 / 2} sizes="(min-width: 768px) 33vw, 42vw" />
            <figcaption className="exposure mt-3">HCGG × Petty Theft, 2026</figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
