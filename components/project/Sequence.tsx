"use client";

import { motion } from "motion/react";
import { useState, type CSSProperties } from "react";
import { Picture } from "@/components/Picture";
import { photo } from "@/content/photos";
import type { Row } from "@/content/projects";
import { Lightbox } from "./Lightbox";

const EASE = [0.16, 1, 0.3, 1] as const;

type FrameProps = {
  id: string;
  priority?: boolean;
  index: number;
  total: number;
  sizes: string;
  onOpen: (i: number) => void;
  className?: string;
  style?: CSSProperties;
  imgBox?: string;
  captionClass?: string;
};

function Frame({ id, priority, index, total, sizes, onOpen, className = "", style, imgBox = "", captionClass = "" }: FrameProps) {
  const p = photo(id);
  return (
    <figure className={className} style={style}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="group block w-full cursor-zoom-in"
        aria-label={`Open photo ${index + 1} of ${total} full screen`}
      >
        <Picture id={id} sizes={sizes} priority={priority} className={`zoom ${imgBox}`} />
      </button>
      {p.exposure && (
        <figcaption className={`exposure mt-3 ${captionClass}`}>
          {p.lens} · {p.exposure}
        </figcaption>
      )}
    </figure>
  );
}

function offsetClass(id: string, side: "left" | "right") {
  const portrait = photo(id).orientation === "portrait";
  if (portrait) {
    return side === "left"
      ? "col-span-10 md:col-span-5 md:col-start-2"
      : "col-span-10 col-start-3 md:col-span-5 md:col-start-7";
  }
  return side === "left" ? "col-span-11 md:col-span-7" : "col-span-11 col-start-2 md:col-span-7 md:col-start-6";
}

export function Sequence({ rows, title }: { rows: Row[]; title: string }) {
  const ids = rows.flatMap((r) => ("photos" in r ? r.photos : [r.photo]));
  const [open, setOpen] = useState<number | null>(null);
  const common = { total: ids.length, onOpen: setOpen };

  return (
    <>
      <div className="space-y-20 md:space-y-36">
        {rows.map((row, r) => (
          <motion.div
            key={r}
            // The opening frame paints immediately; later rows ease in.
            initial={r === 0 ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 1, ease: EASE }}
          >
            {row.kind === "full" && (
              <Frame
                {...common}
                priority={r === 0}
                id={row.photo}
                index={ids.indexOf(row.photo)}
                sizes="100vw"
                imgBox="max-h-[92svh] w-full"
                captionClass="gutter"
              />
            )}

            {row.kind === "wide" && (
              <div className="gutter">
                <Frame
                  {...common}
                  priority={r === 0}
                  id={row.photo}
                  index={ids.indexOf(row.photo)}
                  sizes="(min-width: 768px) 92vw, 100vw"
                  imgBox="max-h-[90svh] w-full"
                />
              </div>
            )}

            {(row.kind === "pair" || row.kind === "trio") && (
              // Justified row: each frame's flex-grow is its aspect ratio, so
              // every photo in the row ends up the same height, uncropped.
              <div className="gutter flex flex-col gap-10 md:flex-row md:items-start md:gap-6">
                {row.photos.map((id, k) => {
                  const p = photo(id);
                  const mobile = p.orientation === "portrait" ? (k % 2 ? "ml-auto w-[80%]" : "w-[80%]") : "w-full";
                  return (
                    <Frame
                      key={id}
                      {...common}
                      priority={r === 0}
                      id={id}
                      index={ids.indexOf(id)}
                      sizes={`(min-width: 768px) ${Math.round(95 / row.photos.length)}vw, 100vw`}
                      className={`${mobile} md:w-auto md:min-w-0 md:basis-0`}
                      style={{ flexGrow: p.aspect }}
                    />
                  );
                })}
              </div>
            )}

            {row.kind === "offset" && (
              <div className="gutter grid grid-cols-12 gap-6">
                <Frame
                  {...common}
                  priority={r === 0}
                  id={row.photo}
                  index={ids.indexOf(row.photo)}
                  sizes="(min-width: 768px) 55vw, 88vw"
                  className={offsetClass(row.photo, row.side)}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <Lightbox ids={ids} index={open} title={title} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
