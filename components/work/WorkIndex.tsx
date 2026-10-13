"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Picture } from "@/components/Picture";
import { galleries } from "@/content/galleries";
import { photo } from "@/content/photos";
import {
  categories,
  categoryOrder,
  formatDate,
  photosIn,
  projects,
  type Category,
  type Project,
} from "@/content/projects";

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
  const listed = galleries.filter((g): g is typeof g & { category: Category } => g.category !== "sports");
  const archive = filter === "all" ? listed : listed.filter((g) => g.category === filter);
  const heading = filter === "all" ? "Work" : categories[filter].label;
  const blurb =
    filter === "all"
      ? "Concerts, events, and portraits from Gainesville and the University of Florida."
      : categories[filter].blurb;

  return (
    <>
      <header className="gutter pb-10 pt-32 md:pb-14 md:pt-44">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={filter}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="grid gap-6 md:grid-cols-12 md:items-end"
          >
            <h1
              className={`display md:col-span-8 ${
                heading.length > 12 ? "text-[clamp(3.6rem,11vw,10rem)]" : "text-[clamp(4.5rem,16vw,15rem)]"
              }`}
            >
              {heading}
            </h1>
            <p className="max-w-md text-ash md:col-span-4 md:pb-4">{blurb}</p>
          </motion.div>
        </AnimatePresence>
      </header>

      <nav
        aria-label="Filter work by category"
        className="gutter sticky top-16 z-30 border-y border-line bg-ink md:top-[4.5rem]"
      >
        <ul className="-mx-3 flex gap-1 overflow-x-auto py-3 [scrollbar-width:none] md:gap-4">
          {(["all", ...categoryOrder] as Filter[]).map((f) => {
            const active = f === filter;
            return (
              <li key={f} className="shrink-0">
                <Link
                  href={hrefFor(f)}
                  onClick={choose(f)}
                  aria-current={active ? "page" : undefined}
                  className={`meta relative block px-3 py-2 transition-colors hover:text-bone ${
                    active ? "text-bone" : ""
                  }`}
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
      </nav>

      <section aria-label="Projects" className="gutter pb-24 pt-16 md:pb-32 md:pt-24">
        <AnimatePresence mode="wait" initial={false}>
          <motion.ul
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-24 md:space-y-40"
          >
            {shown.map((project, i) => (
              <ProjectRow key={project.slug} project={project} index={i} />
            ))}
          </motion.ul>
        </AnimatePresence>
      </section>

      {archive.length > 0 && (
      <section aria-labelledby="archive-title" className="gutter border-t border-line pb-28 pt-16 md:pb-36 md:pt-20">
        <div className="mb-10 grid gap-4 md:grid-cols-12">
          <h2 id="archive-title" className="display-medium text-[clamp(1.8rem,3vw,2.6rem)] md:col-span-6">
            Client galleries
          </h2>
          <p className="max-w-md text-sm text-ash md:col-span-5 md:col-start-8">
            Full sets for download live on the gallery site. Some events are there but not shown on this page.
          </p>
        </div>
        {archive.length ? (
          <ul className="border-t border-line">
            {archive.map((g) => (
              <li key={g.url} className="border-b border-line">
                <a
                  href={g.url}
                  className="group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 py-4 transition-colors hover:bg-graphite/60 md:grid-cols-12 md:px-2"
                >
                  <span className="exposure md:col-span-2">{formatDate(g.date, "short")}</span>
                  <span className="col-start-1 row-start-2 text-bone md:col-span-6 md:col-start-3 md:row-start-1">
                    <span className="link-line">{g.title}</span>
                  </span>
                  <span className="meta hidden md:col-span-3 md:block">{categories[g.category].label}</span>
                  <span aria-hidden className="row-span-2 self-center text-ash transition-colors group-hover:text-ember md:col-span-1 md:row-span-1 md:text-right">
                    ↗
                  </span>
                  <span className="sr-only">(opens client gallery)</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ash">No client galleries in this category yet.</p>
        )}
      </section>
      )}
    </>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const cover = photo(project.cover);
  const portrait = cover.orientation === "portrait";
  const pattern = index % 3;
  const count = photosIn(project).length;
  const meta = [project.date && formatDate(project.date), project.location].filter(Boolean).join(" — ");
  // Side columns are about 28vw wide; size the title so its longest word fits.
  const longest = Math.max(...project.title.split(/\s+/).map((w) => w.length));
  const wide = !portrait && pattern === 2;
  const titleSize = { "--title": `${wide ? 6 : Math.min(6, 54 / longest).toFixed(2)}vw` } as React.CSSProperties;

  const layout = portrait
    ? {
        image: pattern === 1 ? "md:col-span-5 md:col-start-7 md:row-start-1" : "md:col-span-5 md:col-start-2",
        text: pattern === 1 ? "md:col-span-4 md:col-start-2 md:row-start-1" : "md:col-span-4 md:col-start-8",
        ratio: 4 / 5,
        mobile: pattern === 1 ? "ml-[14%]" : "mr-[14%]",
        sizes: "(min-width: 768px) 42vw, 86vw",
      }
    : pattern === 2
      ? {
          image: "md:col-span-12",
          text: "md:col-span-12",
          ratio: 2.2,
          mobile: "max-md:aspect-[4/3]!",
          sizes: "100vw",
        }
      : {
          image: pattern === 1 ? "md:col-span-7 md:col-start-6 md:row-start-1" : "md:col-span-8",
          text: pattern === 1 ? "md:col-span-4 md:col-start-1 md:row-start-1" : "md:col-span-4 md:col-start-9",
          ratio: 3 / 2,
          mobile: "",
          sizes: "(min-width: 768px) 66vw, 100vw",
        };

  return (
    <motion.li
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <Link href={`/work/${project.slug}`} className="group grid gap-6 md:grid-cols-12 md:gap-x-6">
        <div className={`${layout.image} ${portrait ? layout.mobile : ""}`}>
          <Picture
            id={project.cover}
            ratio={layout.ratio}
            sizes={layout.sizes}
            className={`zoom ${portrait ? "" : layout.mobile}`}
          />
        </div>
        <div
          className={`${layout.text} ${
            !portrait && pattern === 2 ? "md:grid md:grid-cols-12 md:items-end md:gap-x-6" : "flex flex-col md:justify-end"
          }`}
        >
          <div className={!portrait && pattern === 2 ? "md:col-span-7" : ""}>
            <p className="meta mb-3">
              {categories[project.category].label} · {count} {count === 1 ? "photograph" : "photographs"}
            </p>
            <h2 className="display text-[clamp(2.4rem,11vw,4rem)] md:text-[clamp(2rem,var(--title),5.5rem)]" style={titleSize}>
              {project.title}
            </h2>
            {meta && <p className="exposure mt-3">{meta}</p>}
          </div>
          <div className={!portrait && pattern === 2 ? "md:col-span-4 md:col-start-9" : ""}>
            <p className="mt-4 max-w-sm text-ash">{project.summary}</p>
            <span className="link-line mt-6 inline-block pb-0.5 text-sm text-bone">View project →</span>
          </div>
        </div>
      </Link>
    </motion.li>
  );
}
