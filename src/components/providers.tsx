"use client"

import { pageTransitions } from "@/styles/motions/motion-presets"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  // Pilih animasi berdasarkan route → tapi value-nya dari preset gerakan
  const getAnimation = () => {
    // if (pathname?.includes("/dashboard")) return pageTransitions.fade
    // if (pathname?.includes("/chat")) return pageTransitions.slide
    // if (pathname?.includes("/events")) return pageTransitions.zoom
    return pageTransitions.fade
  }

  const animation = getAnimation()

  return (
    <AnimatePresence mode="wait" initial={true}>
      <motion.div key={pathname} className="min-h-screen" {...animation}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}