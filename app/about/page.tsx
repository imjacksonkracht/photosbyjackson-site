import type { Metadata } from "next";
import Link from "next/link";
import { BookingCTA } from "@/components/BookingCTA";
import { Picture } from "@/components/Picture";
import { Reveal } from "@/components/Reveal";
import { hasPhoto } from "@/content/photos";
import { site } from "@/content/site";
import { JsonLd, personLd } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "About",
  description:
    "Jackson Kracht is a University of Florida student and photographer in Gainesville, FL, shooting concerts, campus events, portraits, and headshots.",
  alternates: { canonical: "/about" },
};

const specialties = [
  {
    href: "/work/music",
    title: "Concerts and live music",
    body: "Campus shows, festival stages, and touring acts. Fast light, low light, and no second takes.",
    photo: "petty-theft-lead-vocalist-04",
  },
  {
    href: "/work/events",
    title: "Events and campus organizations",
    body: "Cookouts, parades, socials, and the group photo everyone actually wants to post.",
    photo: "gator-grill-club-cookout-01",
  },
  {
    href: "/work/portraits",
    title: "Portraits and headshots",
    body: "Clean, natural-light headshots and group portraits for LinkedIn, resumes, and organization rosters.",
    photo: "cicerones-general-body-headshot-02",
  },
];

// From the EXIF data in the photographs on this site.
const kit = ["Sony α7 III", "Sony FE 70–200mm F2.8 GM OSS II", "Samyang AF 35mm F1.8"];

const BTS = "jackson-behind-the-scenes";

export default function AboutPage() {
  const withPhoto = hasPhoto(BTS);
  return (
    <>
      <JsonLd data={personLd} />
      <header className="gutter pb-14 pt-32 md:pb-20 md:pt-44">
        <p className="meta mb-8">About</p>
        <h1 className="display text-[clamp(4rem,15vw,14rem)]">Jackson Kracht</h1>
      </header>

      <section aria-label="Biography" className="gutter pb-24 md:pb-36">
        <div className={`grid gap-12 md:grid-cols-12 md:gap-x-6 ${withPhoto ? "" : "md:items-start"}`}>
          {withPhoto && (
            <figure className="md:col-span-5">
              <Picture
                id={BTS}
                ratio={4 / 5}
                priority
                sizes="(min-width: 768px) 42vw, 100vw"
                className="max-md:aspect-[4/5]!"
              />
              <figcaption className="exposure mt-3">On the floor at Homecoming and Gator Growl, 2026.</figcaption>
            </figure>
          )}
          <div className={withPhoto ? "md:col-span-6 md:col-start-7 md:pt-4" : "md:col-span-8"}>
            <p className="text-[clamp(1.35rem,2.3vw,2rem)] leading-snug text-bone">
              I’m a student at the {site.university} and the photographer behind Photos by Jackson, based in{" "}
              {site.location}.
            </p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ash">
              <p>
                I photograph concerts, campus events, and portraits. I’m drawn to live performance: the light
                changes every second and a moment only happens once.
              </p>
              <p>
                I bring the same attention to an organization’s big night or a headshot session. Watch closely,
                stay out of the way, and let people be themselves.
              </p>
            </div>
            <dl className="mt-12 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="meta mb-2">In the bag</dt>
                <dd>
                  <ul className="space-y-1 text-bone">
                    {kit.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="meta mb-2">Captions</dt>
                <dd className="text-sm text-ash">
                  Where a file still has its camera data, the caption under it lists the real lens and exposure
                  settings.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="specialties-title" className="gutter pb-28 md:pb-40">
        <h2 id="specialties-title" className="display mb-14 text-[clamp(2.8rem,7vw,6rem)] md:mb-20">
          What I shoot
        </h2>
        <ul className="border-t border-line">
          {specialties.map((s, i) => (
            <li key={s.href} className="border-b border-line">
              <Reveal delay={i * 0.05} y={16}>
                <Link
                  href={s.href}
                  className="group grid grid-cols-[5.5rem_1fr] items-center gap-5 py-6 md:grid-cols-12 md:gap-6 md:py-8"
                >
                  <div className="md:col-span-2">
                    <Picture id={s.photo} ratio={1} sizes="(min-width: 768px) 15vw, 88px" className="zoom" />
                  </div>
                  <h3 className="display-medium text-[clamp(1.5rem,3vw,2.6rem)] md:col-span-5">
                    <span className="link-line">{s.title}</span>
                  </h3>
                  <p className="col-span-2 text-ash md:col-span-4 md:col-start-8">{s.body}</p>
                  <span
                    aria-hidden
                    className="hidden text-right text-ash transition-colors group-hover:text-ember md:col-span-1 md:block"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <BookingCTA />
    </>
  );
}
