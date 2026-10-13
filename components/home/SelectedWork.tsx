import Link from "next/link";
import type { CSSProperties } from "react";
import { Picture } from "@/components/Picture";
import { Reveal } from "@/components/Reveal";
import { getProject, projectLabel, selectedWork } from "@/content/projects";

type TileProps = {
  index: number;
  /** Presentation ratio (width / height). Tiles in a row share a height. */
  ratio: number;
  sizes: string;
  overlay?: boolean;
  className?: string;
  mobileRatio?: string;
};

function Tile({ index, ratio, sizes, overlay, className = "", mobileRatio = "" }: TileProps) {
  const item = selectedWork[index];
  const project = getProject(item.slug)!;
  const meta = [projectLabel(project), project.date?.slice(0, 4)].filter(Boolean).join(" · ");
  const style = { flexGrow: ratio, "--r": ratio } as CSSProperties;

  return (
    <li className={`min-w-0 md:basis-0 ${className}`} style={style}>
      <Link href={`/work/${project.slug}`} className="group block">
        <div className={`relative overflow-hidden md:aspect-[var(--r)] ${mobileRatio}`}>
          <Picture id={item.photo} fill sizes={sizes} className="zoom" />
          {overlay && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(11,11,12,0.8),rgba(11,11,12,0))] px-4 pb-4 pt-20 md:px-6 md:pb-5">
              <p className="meta mb-2 text-bone/75">{meta}</p>
              <h3 className="display text-[clamp(2.4rem,6vw,5.5rem)] text-bone">{project.title}</h3>
            </div>
          )}
        </div>
        {!overlay && (
          <div className="mt-3">
            <p className="meta mb-1">{meta}</p>
            <h3 className="display-medium text-[clamp(1.4rem,2vw,1.9rem)]">
              <span className="link-line">{project.title}</span>
            </h3>
          </div>
        )}
      </Link>
    </li>
  );
}

const row = "flex flex-col gap-y-8 md:flex-row md:gap-x-5";

export function SelectedWork() {
  return (
    <section aria-labelledby="selected-title" className="gutter py-20 md:py-28">
      <div className="mb-8 flex items-end justify-between gap-6 md:mb-12">
        <h2 id="selected-title" className="display text-[clamp(2.8rem,7vw,6.5rem)]">
          Selected work
        </h2>
        <Link href="/work" className="meta link-line mb-1 shrink-0 pb-1 text-bone">
          All work →
        </Link>
      </div>

      <div className="space-y-8 md:space-y-12">
        {/* Featured pair: one wide frame and one tall frame, same height. */}
        <Reveal y={24}>
          <ul className={row}>
            <Tile index={0} ratio={1.45} sizes="(min-width: 768px) 66vw, 100vw" mobileRatio="aspect-[4/3]" />
            <Tile index={1} ratio={0.72} sizes="(min-width: 768px) 33vw, 100vw" mobileRatio="aspect-[4/5]" />
          </ul>
        </Reveal>

        {/* Full width. */}
        <Reveal y={24}>
          <ul>
            <Tile
              index={2}
              ratio={2.4}
              sizes="100vw"
              overlay
              mobileRatio="aspect-[4/3]"
              className="-mx-[clamp(1rem,4vw,3.5rem)] md:mx-0"
            />
          </ul>
        </Reveal>

        {/* Three portraits. On phones: one large, then two side by side. */}
        <Reveal y={24}>
          <ul className="flex flex-wrap gap-x-3 gap-y-8 md:flex-nowrap md:gap-x-5">
            <Tile index={3} ratio={0.8} sizes="(min-width: 768px) 33vw, 100vw" mobileRatio="aspect-[4/5]" className="w-full md:w-auto" />
            <Tile index={4} ratio={0.8} sizes="(min-width: 768px) 33vw, 50vw" mobileRatio="aspect-[4/5]" className="w-[calc(50%-0.375rem)] md:w-auto" />
            <Tile index={5} ratio={0.8} sizes="(min-width: 768px) 33vw, 50vw" mobileRatio="aspect-[4/5]" className="w-[calc(50%-0.375rem)] md:w-auto" />
          </ul>
        </Reveal>

        {/* Closing pair. */}
        <Reveal y={24}>
          <ul className={row}>
            <Tile index={6} ratio={1.5} sizes="(min-width: 768px) 50vw, 100vw" mobileRatio="aspect-[3/2]" />
            <Tile index={7} ratio={1.5} sizes="(min-width: 768px) 50vw, 100vw" mobileRatio="aspect-[3/2]" />
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
