"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * `template.tsx` re-mounts on every navigation (unlike `layout.tsx`, which
 * persists), which makes it the right place for a page-transition animation
 * without needing to key it off the pathname manually.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
