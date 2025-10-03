"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { eventService, GroupEvent } from "@/services/eventService/eventService"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit } from "lucide-react"
import Reveal from "@/components/animations/Reveal"

// Import tab components
import DetailTab from "./components/DetailTab"
import PesertaTab from "./components/PesertaTab"
import TaskTab from "./components/TaskTab"
import KontribusiTab from "./components/KontribusiTab"
import NotulenTab from "./components/NotulenTab"

export default function EventDetailPage() {
  const { eventId } = useParams() as { eventId: string }
  const [event, setEvent] = useState<GroupEvent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.read({ id: eventId })
        setEvent(data[0] ?? null)
      } catch (err) {
        console.log("Error fetching event:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [eventId])

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    )
  }

  if (!event) {
    return <p className="p-4 text-muted-foreground">Event tidak ditemukan.</p>
  }

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Reveal animation="fadeInDown">
          <h1 className="text-2xl font-bold">{event.title}</h1>
        </Reveal>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4 mr-1" /> Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="detail" className="w-full">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="peserta">Peserta</TabsTrigger>
          <TabsTrigger value="task">Task</TabsTrigger>
          <TabsTrigger value="kontribusi">Kontribusi</TabsTrigger>
          <TabsTrigger value="notulen">Notulen</TabsTrigger>
        </TabsList>

        <TabsContent value="detail" className="mt-4">
          <DetailTab event={event} />
        </TabsContent>
        <TabsContent value="peserta" className="mt-4">
          <PesertaTab eventId={event.id} />
        </TabsContent>
        <TabsContent value="task" className="mt-4">
          <TaskTab eventId={event.id} />
        </TabsContent>
        <TabsContent value="kontribusi" className="mt-4">
          <KontribusiTab eventId={event.id} />
        </TabsContent>
        <TabsContent value="notulen" className="mt-4">
          <NotulenTab eventId={event.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}