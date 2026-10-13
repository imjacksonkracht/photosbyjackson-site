"use client";

import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fallbackSrc, photo, srcSet } from "@/content/photos";

type Props = {
  ids: string[];
  index: number | null;
  title: string;
  onClose: () => void;
  onIndex: (i: number) => void;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function Lightbox({ ids, index, title, onClose, onIndex }: Props) {
  const open = index !== null;
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState(0);

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      setDirection(delta);
      onIndex((index + delta + ids.length) % ids.length);
    },
    [index, ids.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const returnTo = document.activeElement as HTMLElement | null;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = previous;
      returnTo?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll<HTMLElement>("button")];
        const i = items.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          items[items.length - 1].focus();
        } else if (!e.shiftKey && i === items.length - 1) {
          e.preventDefault();
          items[0].focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  // Warm the cache for neighbouring frames.
  useEffect(() => {
    if (index === null) return;
    for (const d of [1, -1]) {
      const p = photo(ids[(index + d + ids.length) % ids.length]);
      const img = new Image();
      img.sizes = "100vw";
      img.srcset = srcSet(p);
    }
  }, [index, ids]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
  };

  const p = index !== null ? photo(ids[index]) : null;

  return (
    <AnimatePresence>
      {open && p && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title}, photo viewer`}
          className="fixed inset-0 z-[60] flex flex-col bg-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="gutter flex h-16 shrink-0 items-center justify-between">
            <p className="meta" aria-live="polite">
              <span className="text-bone">{String(index! + 1).padStart(2, "0")}</span> / {String(ids.length).padStart(2, "0")}
            </p>
            <button ref={closeRef} type="button" onClick={onClose} className="meta -mr-2 px-2 py-3 text-bone">
              Close
            </button>
          </div>

          <div className="relative min-h-0 flex-1">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={p.id}
                custom={direction}
                className="absolute inset-0 flex items-center justify-center px-2 md:px-24"
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.5, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
              >
                <picture className="contents">
                  <source type="image/avif" srcSet={srcSet(p)} sizes="100vw" />
                  <img
                    src={fallbackSrc(p)}
                    alt={p.alt}
                    width={p.width}
                    height={p.height}
                    draggable={false}
                    className="h-auto max-h-full w-auto max-w-full select-none"
                  />
                </picture>
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="group absolute inset-y-0 left-0 hidden w-24 items-center justify-center md:flex"
            >
              <span aria-hidden className="text-2xl text-ash transition-colors group-hover:text-bone">←</span>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="group absolute inset-y-0 right-0 hidden w-24 items-center justify-center md:flex"
            >
              <span aria-hidden className="text-2xl text-ash transition-colors group-hover:text-bone">→</span>
            </button>
          </div>

          <div className="gutter flex min-h-16 shrink-0 items-center justify-between gap-4 py-3">
            <p className="exposure">{p.exposure ? `${p.lens} · ${p.exposure}` : title}</p>
            <div className="flex gap-2 md:hidden">
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="h-11 w-11 text-bone">
                ←
              </button>
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className="h-11 w-11 text-bone">
                →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
