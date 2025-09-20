"use client"
import { motion } from "framer-motion"
import clsx from "clsx"

type LoaderProps = {
  type?: "spinner" | "dots" | "heartbeat"
  size?: number // px
  color?: string // tailwind color class
  spinnerColor?: string // tailwind color class for heartbeat spinner
  spinnerSize?: number // px for heartbeat spinner
}

function Spinner({ size = 40, color = "border-primary" }: LoaderProps) {
  return (
    <motion.div
      className={clsx(
        "rounded-full border-4 border-t-transparent",
        color
      )}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1.2,
        ease: [0.77, 0, 0.175, 1], // smooth cubic-bezier
      }}
    />
  )
}


function HeartbeatSpinnerLoader({
  size = 16,
  color = "bg-primary",
  spinnerColor = "border-primary",
  spinnerSize = 48,
}: LoaderProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Spinner luar */}
      <motion.div
        className={`rounded-full border-4 border-t-transparent ${spinnerColor}`}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          position: "absolute",
        }}
        animate={{
          rotate: 360,
          scale: [0.7, 1, 0.7], // ikut irama heartbeat
        }}
        transition={{
          rotate: {
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          },
          scale: {
            repeat: Infinity,
            duration: 1.2,
            ease: [0.4, 0, 0.2, 1], // cubic-bezier mirip detak jantung
          },
        }}
      />

      {/* Titik heartbeat di tengah */}
      <motion.span
        className={`rounded-full ${color}`}
        style={{ width: size, height: size, display: "inline-block" }}
        animate={{
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  )
}

function Dots({ size = 10, color = "bg-primary" }: LoaderProps) {
  return (
    <div className="flex gap-2 items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={clsx("rounded-full", color)}
          style={{ width: size, height: size }}
          animate={{ y: [0, -size / 2, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            ease: [0.65, 0, 0.35, 1], // easeInOutCubic
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  )
}

export function Loader({ type = "spinner", size, color }: LoaderProps) {
  if (type === "dots") {
    return <Dots size={size} color={color} />
  }
  if (type === "heartbeat") {
    return <HeartbeatSpinnerLoader size={size} color={color} />
  }
  return <Spinner size={size} color={color} />
}
