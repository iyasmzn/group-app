"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LoadingOverlay from "@/components/loading-overlay"

export default function GroupIdIndexPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params) // ✅ unwrap promise
  const router = useRouter()

  useEffect(() => {
    router.replace(`/app/groups/${groupId}/dashboard`)
  }, [groupId, router])

  return <LoadingOverlay isLoading={true} />
}