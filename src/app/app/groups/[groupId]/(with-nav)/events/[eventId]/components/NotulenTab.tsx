"use client"

import Reveal from "@/components/animations/Reveal"
import { FileText } from "lucide-react"

export default function NotulenTab({ eventId }: { eventId: string }) {
  return (
    <Reveal animation="fadeInUp">
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <FileText className="w-4 h-4" /> Notulen awal untuk event {eventId} (coming soon)
      </div>
    </Reveal>
  )
}