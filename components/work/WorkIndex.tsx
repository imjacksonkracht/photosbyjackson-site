"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Picture } from "@/components/Picture";
import { categories, categoryOrder, projectLabel, projects, type Category, type Project } from "@/content/projects";
import { site } from "@/content/site";

type Filter = Category | "all";

const EASE = [0.16, 1, 0.3, 1] as const;

function hrefFor(f: Filter) {
  return f === "all" ? "/work" : `/work/${f}`;
}

function filterFromPath(path: string): Filter {
  const seg = path.split("/")[2] as Category | undefined;
  return seg && seg in categories ? seg : "all";
}

export function WorkIndex({ initial }: { initial: Filter }) {
  const [filter, setFilter] = useState<Filter>(initial);

  // Keep state in sync with back/forward after a filter pushState.
  useEffect(() => {
    const onPop = () => setFilter(filterFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const choose = (f: Filter) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (f === filter) return;
    setFilter(f);
    window.history.pushState(null, "", hrefFor(f));
    const label = f === "all" ? "Work" : categories[f].title;
    document.title = `${label} — Photos by Jackson`;
  };

  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const heading = filter === "all" ? "Work" : categories[filter].label;

  return (
    <>
      <header className="gutter pb-8 pt-28 md:pb-10 md:pt-36">
        <AnimatePresence mode="wait" initial={false}>
          <motion.h1
            key={filter}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: EASE }}
            className={`display ${
              heading.length > 12 ? "text-[clamp(3.4rem,10vw,9rem)]" : "text-[clamp(4.2rem,14vw,13rem)]"
            }`}
          >
            {heading}
          </motion.h1>
        </AnimatePresence>
      </header>

      <nav
        aria-label="Filter work by category"
        className="gutter sticky top-16 z-30 border-y border-line bg-ink md:top-[4.5rem]"
      >
        <div className="flex items-center justify-between gap-4">
          <ul className="-mx-3 flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] md:gap-4">
            {(["all", ...categoryOrder] as Filter[]).map((f) => {
              const active = f === filter;
              return (
                <li key={f} className="shrink-0">
                  <Link
                    href={hrefFor(f)}
                    onClick={choose(f)}
                    aria-current={active ? "page" : undefined}
                    className={`meta relative block px-3 py-2 transition-colors hover:text-bone ${active ? "text-bone" : ""}`}
                  >
                    {f === "all" ? "All" : categories[f].short}
                    {active && (
                      <motion.span
                        layoutId="filter-underline"
                        className="absolute inset-x-3 -bottom-[0.8rem] h-px bg-ember"
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <a href={site.galleries} className="meta hidden shrink-0 text-bone/80 hover:text-bone sm:block">
            Client Galleries ↗
          </a>
        </div>
      </nav>

      <section aria-label="Projects" className="gutter pb-16 pt-8 md:pb-24 md:pt-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-x-5 gap-y-10 md:grid-cols-2 md:gap-y-12"
          >
            {shown.map((project, i) => (
              <ProjectCard
                key={project.slug}
                project={project}
                // The first card spans both columns; so does the last when the
                // rest would otherwise leave it alone on its row.
                featured={i === 0 || (i === shown.length - 1 && shown.length % 2 === 0)}
                priority={i === 0}
              />
            ))}
          </motion.ul>
        </AnimatePresence>

        <a
          href={site.galleries}
          className="group display-medium mt-14 inline-flex items-center gap-3 text-[clamp(1.3rem,2.2vw,1.9rem)] text-bone md:mt-20"
        >
          <span className="link-line">View client galleries</span>
          <span aria-hidden className="text-ember transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
            ↗
          </span>
        </a>
      </section>
    </>
  );
}

function ProjectCard({ project, featured, priority }: { project: Project; featured: boolean; priority: boolean }) {
  const meta = [projectLabel(project), project.date?.slice(0, 4)].filter(Boolean).join(" · ");
  return (
    <li className={featured ? "md:col-span-2" : ""}>
      <Link href={`/work/${project.slug}`} className="group block">
        <Picture
          id={project.cover}
          ratio={featured ? 2.2 : 4 / 3}
          priority={priority}
          sizes={featured ? "100vw" : "(min-width: 768px) 50vw, 100vw"}
          className={`zoom ${featured ? "max-md:aspect-[4/3]!" : ""}`}
        />
        <div className="mt-3 flex flex-col-reverse gap-1 md:flex-row md:items-baseline md:justify-between md:gap-4">
          <h2
            className={
              featured ? "display text-[clamp(2.4rem,5vw,4.5rem)]" : "display-medium text-[clamp(1.5rem,2.3vw,2.1rem)]"
            }
          >
            <span className="link-line">{project.title}</span>
          </h2>
          <p className="meta shrink-0">{meta}</p>
        </div>
      </Link>
    </li>
  );
}
