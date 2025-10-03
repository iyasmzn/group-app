"use client"

import Reveal from "@/components/animations/Reveal"
import { MapPin } from "lucide-react"
import { EventStatusBadge } from "@/components/app/events/EventStatusBadge"
import { GroupEvent } from "@/services/eventService/eventService"

export default function DetailTab({ event }: { event: GroupEvent }) {
  return (
    <div className="space-y-4">
      {event.description && (
        <Reveal animation="fadeInUp">
          <p className="text-muted-foreground">{event.description}</p>
        </Reveal>
      )}

      {event.start_at && (
        <Reveal animation="fadeInUp">
          <EventStatusBadge start={event.start_at} end={event.end_at} />
        </Reveal>
      )}

      {event.location && (
        <Reveal animation="fadeInUp">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <MapPin className="w-4 h-4" /> {event.location}
          </div>
        </Reveal>
      )}
    </div>
  )
}