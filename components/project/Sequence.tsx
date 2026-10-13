"use client";

import { motion } from "motion/react";
import { useState, type CSSProperties, type ReactNode } from "react";
import { Picture } from "@/components/Picture";
import { photo } from "@/content/photos";
import type { Row } from "@/content/projects";
import { Lightbox } from "./Lightbox";

const EASE = [0.16, 1, 0.3, 1] as const;

// One spacing unit for the whole gallery: the gap between rows equals the gap
// between photos in a row.
const GAP = "gap-3 md:gap-5";

type FrameProps = {
  id: string;
  index: number;
  total: number;
  sizes: string;
  onOpen: (i: number) => void;
  priority?: boolean;
  /** Justified rows: grow by aspect ratio so every photo in the row is the same height. */
  justify?: boolean;
  className?: string;
  imgBox?: string;
};

function Frame({ id, index, total, sizes, onOpen, priority, justify, className = "", imgBox = "" }: FrameProps) {
  const p = photo(id);
  const style: CSSProperties | undefined = justify ? { flexGrow: p.aspect } : undefined;
  return (
    <figure className={`min-w-0 ${className}`} style={style}>
      <button
        type="button"
        onClick={() => onOpen(index)}
        className="group block w-full cursor-zoom-in"
        aria-label={`Open photo ${index + 1} of ${total} full screen`}
      >
        <Picture id={id} sizes={sizes} priority={priority} className={`zoom ${imgBox}`} />
      </button>
    </figure>
  );
}

const sumAspect = (ids: readonly string[]) => ids.reduce((n, id) => n + photo(id).aspect, 0);

export function Sequence({ rows, title }: { rows: Row[]; title: string }) {
  const ids = rows.flatMap((r) => ("photos" in r ? r.photos : [r.photo]));
  const [open, setOpen] = useState<number | null>(null);
  const common = (id: string, r: number) => ({
    id,
    index: ids.indexOf(id),
    total: ids.length,
    onOpen: setOpen,
    priority: r === 0,
  });

  const renderRow = (row: Row, r: number): ReactNode => {
    switch (row.kind) {
      case "full":
        return <Frame {...common(row.photo, r)} sizes="100vw" imgBox="max-h-[92svh] w-full" />;
      case "wide":
        return (
          <div className="gutter">
            <Frame {...common(row.photo, r)} sizes="(min-width: 768px) 92vw, 100vw" imgBox="max-h-[90svh] w-full" />
          </div>
        );
      case "pair": {
        // Two portraits stay side by side on phones; anything wider stacks.
        const sideBySide = sumAspect(row.photos) < 1.7;
        return (
          <div className={`gutter flex ${sideBySide ? "flex-row" : "flex-col md:flex-row"} ${GAP}`}>
            {row.photos.map((id) => (
              <Frame
                key={id}
                {...common(id, r)}
                justify
                sizes={sideBySide ? "(min-width: 768px) 46vw, 50vw" : "(min-width: 768px) 46vw, 100vw"}
                className={sideBySide ? "basis-0" : "md:basis-0"}
              />
            ))}
          </div>
        );
      }
      case "trio": {
        // Phones: first photo full width, the other two as a justified pair.
        const [a, b, c] = row.photos;
        return (
          <div className={`gutter flex flex-col md:flex-row ${GAP}`}>
            <Frame
              {...common(a, r)}
              justify
              sizes="(min-width: 768px) 31vw, 100vw"
              className="md:basis-0"
              imgBox="max-md:max-h-[72svh]"
            />
            <div className={`flex md:contents ${GAP}`}>
              <Frame {...common(b, r)} justify sizes="(min-width: 768px) 31vw, 50vw" className="basis-0" />
              <Frame {...common(c, r)} justify sizes="(min-width: 768px) 31vw, 50vw" className="basis-0" />
            </div>
          </div>
        );
      }
    }
  };

  return (
    <>
      <div className={`flex flex-col ${GAP}`}>
        {rows.map((row, r) => (
          <motion.div
            key={r}
            // The opening frame paints immediately; later rows ease in.
            initial={r === 0 ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -6% 0px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            {renderRow(row, r)}
          </motion.div>
        ))}
      </div>

      <Lightbox ids={ids} index={open} title={title} onClose={() => setOpen(null)} onIndex={setOpen} />
    </>
  );
}
