import { GroupNavigation } from '@/components/app/groups/GroupNavigation'
import GroupTopbar from '@/components/app/groups/GroupTopbar'

// ✅ params sekarang Promise
export default async function GroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GroupTopbar />
      <div className="flex justify-center">
        <GroupNavigation />
        <main className="flex-1 max-w-4xl md:ml-56 pb-15">{children}</main>
      </div>
    </>
  )
}
