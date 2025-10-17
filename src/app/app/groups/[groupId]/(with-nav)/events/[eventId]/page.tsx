'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { eventService, GroupEvent } from '@/services/eventService/eventService'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Edit } from 'lucide-react'
import Reveal from '@/components/animations/Reveal'

// Import tab components
import DetailTab from './components/DetailTab'
import PesertaTab from './components/PesertaTab'
import TaskTab from './components/TaskTab'
import KontribusiTab from './components/KontribusiTab'
import NotulenTab from './components/NotulenTab'
import { useGroupRole } from '@/lib/hooks/useGroupRole'

export default function EventDetailPage() {
  const { eventId, groupId } = useParams() as { eventId: string; groupId: string }
  const [event, setEvent] = useState<GroupEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const { role, loading: roleLoading } = useGroupRole(groupId)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.read({ id: eventId })
        setEvent(data[0] ?? null)
      } catch (err) {
        console.log('Error fetching event:', err)
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Reveal animation="fadeInDown">
          <h1 className="text-2xl font-bold">{event.title}</h1>
        </Reveal>
        {/* <Button variant="outline" size="sm" className="self-start sm:self-auto">
          <Edit className="w-4 h-4 mr-1" /> Edit
        </Button> */}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="detail" className="w-full">
        {/* Desktop TabsList */}
        <TabsList
          className="
            hidden sm:grid sm:grid-cols-5
            w-full rounded-md
          "
        >
          <TabsTrigger value="detail">Detail</TabsTrigger>
          <TabsTrigger value="peserta">Peserta</TabsTrigger>
          <TabsTrigger value="task">Task</TabsTrigger>
          <TabsTrigger value="kontribusi">Kontribusi</TabsTrigger>
          <TabsTrigger value="notulen">Notulen</TabsTrigger>
        </TabsList>

        {/* Mobile Bottom Tab Bar */}
        <div className="sm:hidden fixed bottom-18 left-0 right-0 border mx-1 bg-background h-14 flex items-center z-50 px-2 rounded-2xl">
          <TabsList className="flex justify-around w-full">
            <TabsTrigger value="detail" className="flex flex-col items-center text-xs">
              Detail
            </TabsTrigger>
            <TabsTrigger value="peserta" className="flex flex-col items-center text-xs">
              Peserta
            </TabsTrigger>
            <TabsTrigger value="task" className="flex flex-col items-center text-xs">
              Task
            </TabsTrigger>
            <TabsTrigger value="kontribusi" className="flex flex-col items-center text-xs">
              Kontribusi
            </TabsTrigger>
            <TabsTrigger value="notulen" className="flex flex-col items-center text-xs">
              Notulen
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="detail" className="mt-4">
          <DetailTab event={event} />
          <div className="h-30 sm:hidden" /> {/* spacer biar konten tidak ketutup navbar */}
        </TabsContent>
        <TabsContent value="peserta" className="mt-4">
          {!roleLoading && (
            <PesertaTab eventId={event.id} groupId={groupId} roleCode={role?.code ?? 'member'} />
          )}
          <div className="h-30 sm:hidden" /> {/* spacer biar konten tidak ketutup navbar */}
        </TabsContent>
        <TabsContent value="task" className="mt-4">
          <TaskTab eventId={event.id} />
          <div className="h-30 sm:hidden" /> {/* spacer biar konten tidak ketutup navbar */}
        </TabsContent>
        <TabsContent value="kontribusi" className="mt-4">
          <KontribusiTab eventId={event.id} />
          <div className="h-30 sm:hidden" /> {/* spacer biar konten tidak ketutup navbar */}
        </TabsContent>
        <TabsContent value="notulen" className="mt-4">
          <NotulenTab eventId={event.id} />
          <div className="h-30 sm:hidden" /> {/* spacer biar konten tidak ketutup navbar */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
