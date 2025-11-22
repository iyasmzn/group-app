import type { Metadata } from 'next'
import { GroupBadgeProvider } from '@/context/GroupBadgeContext'
import { GroupSeenClient } from './GroupSeenClient'
import { supabaseServer } from '@/lib/supabase/server'

// ✅ generateMetadata: params is now a Promise, so await it
export async function generateMetadata({
  params,
}: {
  params: Promise<{ groupId: string }>
}): Promise<Metadata> {
  const { groupId } = await params // Await to get the actual params object
  const supabase = await supabaseServer()
  const { data, error } = await supabase.from('groups').select('name').eq('id', groupId).single()

  if (error || !data) {
    return { title: 'Group App' }
  }

  return {
    title: `${data.name} – Group App`,
    description: `Halaman grup ${data.name} di aplikasi Group App`,
  }
}

// ✅ Layout: params is now a Promise, so await it
export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ groupId: string }>
}) {
  const { groupId } = await params // Await to get the actual params object

  return (
    <GroupBadgeProvider groupId={groupId}>
      <GroupSeenClient groupId={groupId} />
      {children}
    </GroupBadgeProvider>
  )
}

// ✅ Tambahkan revalidate untuk kontrol cache metadata
export const revalidate = 60 // metadata akan di-refresh setiap 60 detik
