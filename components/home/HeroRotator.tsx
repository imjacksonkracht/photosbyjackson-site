"use client";

import { useEffect, useRef, type ReactNode } from "react";

const HOLD_MS = 7000;

/**
 * Crossfades between server-rendered slides by toggling `data-active` on
 * children marked `data-slide` / `data-slide-label`. The first slide is
 * active in the HTML, so an image shows before hydration. Pauses while the
 * tab is hidden and stays on the first slide for reduced motion.
 */
export function HeroRotator({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const slides = [...root.querySelectorAll<HTMLElement>("[data-slide]")];
    const labels = [...root.querySelectorAll<HTMLElement>("[data-slide-label]")];
    let index = 0;
    let timer: number | undefined;

    const show = (i: number) => {
      slides.forEach((s, k) => s.toggleAttribute("data-active", k === i));
      labels.forEach((l, k) => {
        l.toggleAttribute("data-active", k === i);
        l.toggleAttribute("inert", k !== i);
      });
    };

    const ready = (i: number) => {
      const img = slides[i]?.querySelector("img");
      if (!img) return Promise.resolve();
      img.loading = "eager";
      return img.decode().catch(() => undefined);
    };

    const tick = () => {
      const next = (index + 1) % count;
      ready(next).then(() => {
        if (document.hidden) return;
        index = next;
        show(index);
        ready((index + 1) % count);
        timer = window.setTimeout(tick, HOLD_MS);
      });
    };

    const start = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(tick, HOLD_MS);
    };
    const onVisibility = () => (document.hidden ? window.clearTimeout(timer) : start());

    ready(1);
    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}
