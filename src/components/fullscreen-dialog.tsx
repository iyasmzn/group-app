"use client"

import * as React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogOverlay,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "./ui/scroll-area"

type AnimationVariant = "fade" | "slide-up" | "slide-right" | "zoom"

type FullscreenDialogProps = {
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  footer?: React.ReactNode
  className?: string
  animation?: AnimationVariant
}

const variants: Record<AnimationVariant, any> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  "slide-up": {
    hidden: { y: "100%", opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: "100%", opacity: 0 },
  },
  "slide-right": {
    hidden: { x: "100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "100%", opacity: 0 },
  },
  zoom: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
  },
}

export function FullscreenDialog({
  title,
  description,
  children,
  trigger,
  open,
  onOpenChange,
  footer,
  className,
  animation = "fade",
}: FullscreenDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <AnimatePresence>
        {open && (
          <DialogContent
            forceMount
            className="fixed z-50 m-0 h-full w-400 max-w-none rounded-none p-0 overflow-hidden bg-transparent"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={variants[animation]}
              transition={{ duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }}
              className={cn(
                "relative h-full w-full bg-background flex flex-col",
                className
              )}
            >
              {/* Header */}
              <header className="flex items-start justify-between gap-4 p-5 border-b">
                <div>
                  {title && (
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">
                        {title}
                      </DialogTitle>
                    </DialogHeader>
                  )}
                  {description && (
                    <DialogDescription className="mt-1 text-sm text-muted-foreground">
                      {description}
                    </DialogDescription>
                  )}
                </div>
              </header>

              {/* Body */}
              <div className="flex-1">
                <div className="h-full">
                  {children}
                </div>
              </div>

              {/* Footer */}
              <footer className="border-t p-4">
                <div className="flex items-center justify-end gap-3">
                  {footer ?? (
                    <>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button>Save</Button>
                    </>
                  )}
                </div>
              </footer>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

export default FullscreenDialog
