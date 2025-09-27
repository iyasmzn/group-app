import { GroupNavigation } from "@/components/group/GroupNavigation"
import GroupTopbar from "@/components/group/GroupTopbar"

// ✅ params sekarang Promise
export default async function GroupLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <GroupTopbar />
      <div className="flex justify-center">
        <GroupNavigation />
        <main className="flex-1 max-w-4xl md:ml-56">
          {children}
        </main>
      </div>
    </>
  )
}