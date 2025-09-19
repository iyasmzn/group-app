"use client"

import { AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={true}>
      {/* key = pathname, jadi setiap halaman beda → bisa di-animate */}
      <div key={pathname} className="min-h-screen">
        {children}
      </div>
    </AnimatePresence>
  )
}
