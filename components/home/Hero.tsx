import Link from "next/link";
import { Picture } from "@/components/Picture";
import { getProject, heroSlides } from "@/content/projects";
import { HeroRotator } from "./HeroRotator";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative h-[100svh] min-h-[36rem] overflow-hidden bg-ink">
      <HeroRotator count={heroSlides.length}>
        {heroSlides.map((slide, i) => (
          <div
            key={slide.photo}
            data-slide
            data-active={i === 0 ? "" : undefined}
            aria-hidden={i === 0 ? undefined : true}
            className="hero-slide absolute inset-0"
          >
            <div className={i === 0 ? "hero-settle absolute inset-0" : "absolute inset-0"}>
              <Picture id={slide.photo} fill priority={i === 0} sizes="100vw" />
            </div>
          </div>
        ))}

        {/* One scrim for every slide keeps the type legible without per-image tuning. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(11,11,12,0.92)_0%,rgba(11,11,12,0.5)_32%,rgba(11,11,12,0)_60%),linear-gradient(to_bottom,rgba(11,11,12,0.5)_0%,rgba(11,11,12,0)_16%)]"
        />

        <div className="gutter absolute inset-x-0 bottom-0 pb-6 md:pb-10">
          <h1 id="hero-title" className="display text-[clamp(4.25rem,19vw,9rem)] text-bone md:text-[clamp(4.25rem,13vw,13rem)]">
            {["Live in the", "moment."].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.04em]">
                <span className="rise block" style={{ animationDelay: `${0.15 + i * 0.1}s` }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className="fade-up mt-6 flex items-center justify-between gap-6 border-t border-bone/15 pt-5 [animation-delay:0.6s]">
            <div className="flex items-center gap-x-7">
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

            {/* Labels share one grid cell, so changing slides never shifts layout. */}
            <div className="hidden grid-cols-1 grid-rows-1 text-right md:grid">
              {heroSlides.map((slide, i) => {
                const project = getProject(slide.slug)!;
                return (
                  <Link
                    key={slide.photo}
                    data-slide-label
                    data-active={i === 0 ? "" : undefined}
                    inert={i === 0 ? undefined : true}
                    href={`/work/${project.slug}`}
                    className="hero-label meta col-start-1 row-start-1 whitespace-nowrap text-bone/70 hover:text-bone"
                  >
                    {project.title}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </HeroRotator>
    </section>
  );
}
