"use client";

import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

// Short cross-fade between routes. Skipped on the first page load so the
// server-rendered page (and its hero image) paints immediately.
let navigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animate = navigated;
  useEffect(() => {
    navigated = true;
  }, []);
  return (
    <motion.div
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
