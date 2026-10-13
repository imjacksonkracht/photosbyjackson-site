import Link from "next/link";
import { Picture } from "@/components/Picture";
import { photo } from "@/content/photos";
import { formatDate, getProject } from "@/content/projects";

const HERO_PHOTO = "petty-theft-guitarist-silhouette-01";

export function Hero() {
  const p = photo(HERO_PHOTO);
  const project = getProject("hcgg-petty-theft")!;

  return (
    <section aria-labelledby="hero-title" className="relative h-[100svh] min-h-[38rem] overflow-hidden">
      <div className="hero-settle absolute inset-0">
        <Picture id={HERO_PHOTO} fill priority sizes="100vw" />
      </div>

      {/* Scrim keeps type legible over the bright stage screen. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,12,0.94)_0%,rgba(11,11,12,0.55)_30%,rgba(11,11,12,0)_58%),linear-gradient(to_bottom,rgba(11,11,12,0.55)_0%,rgba(11,11,12,0)_18%)]"
      />

      <div className="gutter absolute inset-x-0 bottom-0 pb-8 md:pb-12">
        <p className="meta fade-up mb-5 flex flex-wrap gap-x-3 text-bone/75 [animation-delay:0.8s]">
          <Link href={`/work/${project.slug}`} className="link-line hover:text-bone">
            {project.title}
          </Link>
          <span aria-hidden>/</span>
          <span>{formatDate(project.date!, "short")}</span>
        </p>

        <h1 id="hero-title" className="display text-[clamp(4.25rem,19vw,9rem)] text-bone md:text-[clamp(4.25rem,14vw,14rem)]">
          {["Live in the", "moment."].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.04em]">
              <span className="rise block" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="fade-up mt-7 grid gap-6 border-t border-bone/15 pt-5 [animation-delay:0.6s] md:mt-9 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <p className="text-lg leading-snug text-bone md:text-xl">Concerts. Events. Portraits.</p>
            <p className="mt-1 text-sm text-ash md:text-base">
              Photography by Jackson Kracht in Gainesville, Florida.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:col-span-3 md:col-start-6">
            <Link
              href="/work"
              className="group inline-flex items-center gap-3 bg-bone px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
            >
              See the work
              <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                →
              </span>
            </Link>
            <Link href="/contact" className="link-line pb-0.5 text-sm text-bone">
              Book a shoot
            </Link>
          </div>
          <p className="exposure hidden whitespace-nowrap text-right md:col-span-4 md:col-start-9 md:block">
            {p.lens} · {p.exposure}
          </p>
        </div>
      </div>
    </section>
  );
}
