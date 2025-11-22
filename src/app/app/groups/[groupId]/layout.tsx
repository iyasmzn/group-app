import type { Metadata } from 'next'
import { GroupBadgeProvider } from '@/context/GroupBadgeContext'
import { GroupSeenClient } from './GroupSeenClient'
import { supabaseServer } from '@/lib/supabase/server'

// ✅ generateMetadata jalan di server, langsung pakai supabaseServer
export async function generateMetadata({
  params,
}: {
  params: { groupId: string }
}): Promise<Metadata> {
  const supabase = await supabaseServer()
  const { data, error } = await supabase
    .from('groups')
    .select('name')
    .eq('id', params.groupId)
    .single()

  if (error || !data) {
    return { title: 'Group App' }
  }

  return {
    title: `${data.name} – Group App`,
    description: `Halaman grup ${data.name} di aplikasi Group App`,
  }
}

// ✅ params langsung object, tidak perlu Promise
export default async function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { groupId: string }
}) {
  const { groupId } = params

  return (
    <GroupBadgeProvider groupId={groupId}>
      <GroupSeenClient groupId={groupId} />
      {children}
    </GroupBadgeProvider>
  )
}

// ✅ Tambahkan revalidate untuk kontrol cache metadata
export const revalidate = 60 // metadata akan di-refresh setiap 60 detik
