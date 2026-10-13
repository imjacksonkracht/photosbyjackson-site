import Link from "next/link";
import { Picture } from "@/components/Picture";
import { Reveal } from "@/components/Reveal";
import { categories, formatDate, getProject, selectedWork } from "@/content/projects";

// Hand-placed slots on a 12-column grid. Sizes and offsets vary on purpose:
// the two loudest frames run large with the title set on the image; the rest
// sit beside open space.
const slots = [
  { cls: "md:col-span-8", ratio: 3 / 2, overlay: true, sizes: "(min-width: 768px) 66vw, 100vw" },
  { cls: "ml-[18%] md:ml-0 md:col-span-4 md:mt-32", ratio: 2 / 3, sizes: "(min-width: 768px) 33vw, 82vw" },
  { cls: "md:col-span-12 -mx-[clamp(1rem,4vw,3.5rem)] md:mx-0", ratio: 2.39, overlay: true, sizes: "100vw", mobile: "max-md:aspect-[4/3]!" },
  { cls: "md:col-span-6 md:col-start-2", ratio: 4 / 3, sizes: "(min-width: 768px) 50vw, 100vw" },
  { cls: "mr-[22%] md:mr-0 md:col-span-3 md:col-start-10 md:mt-40", ratio: 2 / 3, sizes: "(min-width: 768px) 25vw, 78vw" },
  { cls: "md:col-span-7 md:col-start-4", ratio: 16 / 9, sizes: "(min-width: 768px) 58vw, 100vw" },
];

export function SelectedWork() {
  return (
    <section aria-labelledby="selected-title" className="gutter pb-28 pt-24 md:pb-40 md:pt-36">
      <div className="mb-14 flex items-end justify-between gap-6 md:mb-20">
        <h2 id="selected-title" className="display text-[clamp(3rem,9vw,8rem)]">
          Selected work
        </h2>
        <Link href="/work" className="meta link-line mb-2 shrink-0 pb-1 text-bone">
          All work →
        </Link>
      </div>

      <ul className="grid gap-x-6 gap-y-16 md:grid-cols-12 md:gap-y-28">
        {selectedWork.map((item, i) => {
          const project = getProject(item.slug)!;
          const slot = slots[i];
          const meta = [categories[project.category].label, project.date && formatDate(project.date, "short")]
            .filter(Boolean)
            .join(" — ");
          return (
            <li key={item.slug} className={slot.cls}>
              <Reveal y={40}>
                <Link href={`/work/${project.slug}`} className="group block">
                  <div className="relative">
                    <Picture id={item.photo} ratio={slot.ratio} sizes={slot.sizes} className={`zoom ${"mobile" in slot ? slot.mobile : ""}`} />
                    {slot.overlay && (
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(11,11,12,0.85),rgba(11,11,12,0))] px-4 pb-4 pt-24 md:px-7 md:pb-6">
                        <p className="meta mb-2 text-bone/75">{meta}</p>
                        <h3 className="display text-[clamp(2.4rem,6vw,5.5rem)] text-bone">{project.title}</h3>
                      </div>
                    )}
                  </div>
                  {!slot.overlay && (
                    <div className="mt-4">
                      <p className="meta mb-2">{meta}</p>
                      <h3 className="display-medium text-[clamp(1.6rem,2.6vw,2.4rem)]">
                        <span className="link-line">{project.title}</span>
                      </h3>
                    </div>
                  )}
                </Link>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
