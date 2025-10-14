"use client"

import { motion, useAnimation, Variants } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect } from "react"

type RevealProps = {
  children: React.ReactNode
  delay?: number
  distance?: number
  animation?:
    | "fadeIn"
    | "fadeInUp"
    | "fadeInDown"
    | "fadeInLeft"
    | "fadeInRight"
    | "zoomIn"
    | "zoomOut"
    | "rotateIn"
    | "rotateInLeft"
    | "rotateInRight"
    | "bounceIn"
    | "slideInX"
    | "slideInY"
  className?: string
  scale?: number
  rotateDeg?: number
  exit?: boolean
  duration?: number // ✅ durasi animasi
}

export default function Reveal({
  children,
  delay = 0.2,
  distance = 50,
  animation = "fadeInUp",
  className = "",
  scale = 0.8,
  rotateDeg = 45,
  exit = false,
  duration = 0.6, // ✅ default 0.6
}: RevealProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  const getVariants = (): Variants => {
    switch (animation) {
      case "fadeIn":
        return { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } }
      case "fadeInDown":
        return { hidden: { opacity: 0, y: -distance }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -distance } }
      case "fadeInRight":
        return { hidden: { opacity: 0, x: -distance }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -distance } }
      case "fadeInLeft":
        return { hidden: { opacity: 0, x: distance }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: distance } }
      case "fadeInUp":
        return { hidden: { opacity: 0, y: distance }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: distance } }
      case "zoomIn":
        return { hidden: { opacity: 0, scale }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale } }
      case "zoomOut":
        return { hidden: { opacity: 0, scale: 1.2 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.2 } }
      case "rotateIn":
        return { hidden: { opacity: 0, rotate: -rotateDeg }, visible: { opacity: 1, rotate: 0 }, exit: { opacity: 0, rotate: rotateDeg } }
      case "rotateInLeft":
        return { hidden: { opacity: 0, rotate: -rotateDeg, x: -distance }, visible: { opacity: 1, rotate: 0, x: 0 }, exit: { opacity: 0, rotate: -rotateDeg, x: -distance } }
      case "rotateInRight":
        return { hidden: { opacity: 0, rotate: rotateDeg, x: distance }, visible: { opacity: 1, rotate: 0, x: 0 }, exit: { opacity: 0, rotate: rotateDeg, x: distance } }
      case "bounceIn":
        return {
          hidden: { opacity: 0, scale: 0.3 },
          visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
          exit: { opacity: 0, scale: 0.3 },
        }
      case "slideInX":
        return { hidden: { opacity: 0, x: distance }, visible: { opacity: 1, x: 0 }, exit: { opacity: 0, x: distance } }
      case "slideInY":
        return { hidden: { opacity: 0, y: distance }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: distance } }
      default:
        return { hidden: { opacity: 0, y: distance }, visible: { opacity: 1, y: 0 }, exit: { opacity: 0, y: distance } }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      exit={exit ? "exit" : undefined}
      variants={getVariants()}
      transition={{ duration, delay }} // ✅ pakai props duration
      className={className}
    >
      {children}
    </motion.div>
  )
}