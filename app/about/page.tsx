import type { Metadata } from "next";
import Link from "next/link";
import { Picture } from "@/components/Picture";
import { hasPhoto } from "@/content/photos";
import { site } from "@/content/site";
import { JsonLd, personLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jackson Kracht is a photographer and University of Florida student based in Gainesville and Winter Park, Florida, shooting concerts, campus events, and portraits.",
  alternates: { canonical: "/about" },
};

const BTS = "jackson-behind-the-scenes";

export default function AboutPage() {
  const withPhoto = hasPhoto(BTS);
  return (
    <>
      <JsonLd data={personLd} />
      <section aria-labelledby="about-title" className="gutter pb-20 pt-28 md:pb-28 md:pt-36">
        <div className="grid gap-10 md:grid-cols-12 md:items-end md:gap-x-5">
          {withPhoto && (
            <div className="md:col-span-5">
              <Picture id={BTS} ratio={4 / 5} priority sizes="(min-width: 768px) 42vw, 100vw" />
            </div>
          )}
          <div className={withPhoto ? "md:col-span-6 md:col-start-7" : "md:col-span-8"}>
            <p className="meta mb-6">About</p>
            <h1 id="about-title" className="display text-[clamp(3.6rem,10vw,9rem)]">
              Jackson Kracht
            </h1>
            <div className="mt-8 max-w-xl space-y-4 text-lg leading-relaxed text-bone/85">
              <p>Photographer and University of Florida student, based in Gainesville and Winter Park, Florida.</p>
              <p>
                A lot of what I shoot is live music:{" "}
                <Link className="link-line text-bone" href="/work/hcgg-petty-theft">
                  Petty Theft at Gator Growl
                </Link>
                ,{" "}
                <Link className="link-line text-bone" href="/work/swamp-fest">
                  Swamp Fest
                </Link>
                ,{" "}
                <Link className="link-line text-bone" href="/work/live-from-the-lawn">
                  Live From the Lawn
                </Link>
                , and{" "}
                <Link className="link-line text-bone" href="/work/drake-j-cole-its-all-a-blur-tour">
                  Drake and J. Cole on the It’s All a Blur Tour
                </Link>
                .
              </p>
              <p>
                I also shoot{" "}
                <Link className="link-line text-bone" href="/work/events">
                  campus events
                </Link>{" "}
                for student organizations, plus{" "}
                <Link className="link-line text-bone" href="/work/portraits">
                  headshots and group portraits
                </Link>
                .
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-line pt-6 text-sm">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 bg-bone px-5 py-3 font-medium text-ink transition-colors hover:bg-white"
              >
                Book a shoot
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              <a className="link-line text-bone" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a className="link-line text-bone" href={site.instagram.url} rel="me noopener" target="_blank">
                Instagram ↗
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
