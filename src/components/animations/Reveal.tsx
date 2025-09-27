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
}

export default function Reveal({
  children,
  delay = 0.2,
  distance = 50,
  animation = "fadeInUp",
  className = "",
  scale = 0.8,
  rotateDeg = 45
}: RevealProps) {
  const controls = useAnimation()
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 })

  useEffect(() => {
    if (inView) {
      controls.start("visible")
    }
  }, [controls, inView])

  // Tentukan arah animasi berdasarkan props
  const getVariants = (): Variants => {
    switch (animation) {
      case "fadeIn":
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }
      case "fadeInDown":
        return {
          hidden: { opacity: 0, y: -distance },
          visible: { opacity: 1, y: 0 },
        }
      case "fadeInRight":
        return {
          hidden: { opacity: 0, x: -distance },
          visible: { opacity: 1, x: 0 },
        }
      case "fadeInLeft":
        return {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0 },
        }
      case "fadeInUp":
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 },
        }
      case "zoomIn":
        return {
          hidden: { opacity: 0, scale: scale },
          visible: { opacity: 1, scale: 1 },
        }
      case "zoomOut":
        return {
          hidden: { opacity: 0, scale: 1.2 },
          visible: { opacity: 1, scale: 1 },
        }
      case "rotateIn":
        return {
          hidden: { opacity: 0, rotate: -rotateDeg },
          visible: { opacity: 1, rotate: 0 },
        }
      case "rotateInLeft":
        return {
          hidden: { opacity: 0, rotate: -rotateDeg, x: -distance },
          visible: { opacity: 1, rotate: 0, x: 0 },
        }
      case "rotateInRight":
        return {
          hidden: { opacity: 0, rotate: rotateDeg, x: distance },
          visible: { opacity: 1, rotate: 0, x: 0 },
        }
      case "bounceIn":
        return {
          hidden: { opacity: 0, scale: 0.3 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 500,
              damping: 30,
            },
          },
        }
      case "slideInX":
        return {
          hidden: { opacity: 0, x: distance },
          visible: { opacity: 1, x: 0 },
        }
      case "slideInY":
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 },
        }
      default:
        return {
          hidden: { opacity: 0, y: distance },
          visible: { opacity: 1, y: 0 },
        }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={getVariants()}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
