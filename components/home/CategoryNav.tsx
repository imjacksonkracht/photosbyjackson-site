import Link from "next/link";
import { Picture } from "@/components/Picture";
import { categories, categoryCovers, categoryOrder } from "@/content/projects";

export function CategoryNav({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <section aria-labelledby="categories-title" className="border-y border-line">
      <H id="categories-title" className="sr-only">
        Browse by category
      </H>
      <ul className="flex flex-col md:h-[min(82vh,56rem)] md:flex-row">
        {categoryOrder.map((c) => (
          <li
            key={c}
            className="group/panel relative h-[30svh] min-h-48 border-b border-line last:border-b-0 md:h-auto md:flex-1 md:border-b-0 md:border-r md:transition-[flex-grow] md:duration-700 md:ease-[cubic-bezier(0.16,1,0.3,1)] md:last:border-r-0 md:hover:grow-[2.4] md:focus-within:grow-[2.4]"
          >
            <Link href={`/work/${c}`} className="group absolute inset-0 block overflow-hidden">
              <Picture id={categoryCovers[c]} fill sizes="(min-width: 768px) 40vw, 100vw" className="zoom" />
              <div
                aria-hidden
                className="absolute inset-0 bg-ink/45 transition-colors duration-700 group-hover:bg-ink/10 group-focus-visible:bg-ink/10"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-[linear-gradient(to_top,rgba(11,11,12,0.8),rgba(11,11,12,0))] p-4 pt-16 md:p-6">
                <span className="display text-[clamp(2.4rem,3.6vw,4.5rem)] text-bone">{categories[c].label}</span>
                <span
                  aria-hidden
                  className="meta mb-1 text-bone transition-transform duration-500 group-hover:translate-x-1 md:hidden"
                >
                  →
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
