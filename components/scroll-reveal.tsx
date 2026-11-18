"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

export function ScrollReveal({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={false}
      animate="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.05 }}
      variants={{
        hidden: {
          opacity: reducedMotion ? 1 : 0,
          y: reducedMotion ? 0 : 32,
          filter: reducedMotion ? "blur(0px)" : "blur(8px)",
        },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      transition={{ duration: reducedMotion ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
