"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import PageWrapper from "@/components/page-wrapper"
import { AppTopbar } from "@/components/app/topbar"
import { ArrowDownZA, ArrowUpAZ, BellDot, CalendarArrowDown, CalendarArrowUp, Home, MessageCircleWarning, Settings2 } from "lucide-react"
import { AppBottombar } from "@/components/app/bottombar"
import { GroupAvatar } from "@/components/group-avatar"
import { useAuth } from "@/lib/supabase/auth"
import { motion } from "framer-motion"
import { AddGroupDialog } from "./components/addGroupDialog"
import LoadingOverlay from "@/components/loading-overlay"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"

const motionUl = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // delay antar anak
      delayChildren: 0.1,    // jeda awal sebelum mulai
    },
  },
}

const motionLi = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function GroupsPageWrapper() {
  const { user } = useAuth()

  if (!user) {
    return (
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <p className="text-center">Please <Link href="/login" className="text-blue-600 hover:underline">login</Link> to view your groups.</p>
        </div>
      </PageWrapper>
    )
  }

  return <GroupsPage userId={user.id} />
}

function GroupsPage({ userId }: { userId: string }) {
  const [groups, setGroups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<"name" | "createdat">("createdat")
  const [ascending, setAscending] = useState(false)
  const [offset, setOffset] = useState(0)
  const [searchGroupName, setSearchGroupName] = useState("")
  const [totalRow, setTotalRow] = useState(0)
  const limit = 3
  const totalPages = Math.ceil(totalRow / limit)
  const currentPage = Math.floor(offset / limit) +  1

  useEffect(() => {    
    setLoading(true)
    // ✅ Fetch groups where user is a member and get total group members
    const fetchGroups = async () => {
      const query = supabase
        .from("groups")
        .select(`
          *,
          group_members!inner(*)
        `)
        .eq("group_members.user_id", userId)
        .ilike("name", `%${searchGroupName}%`)
        .order(sortBy, { ascending: ascending })
      
      const {data: totalData} = await query
      setTotalRow(totalData ? totalData.length : 0)
      console.log('totalData',totalData)
      const { data, error } = await query
        .range(offset, offset + limit - 1) // pagination
        
      
      if (error) {
        console.error("Error fetching groups:", error)
      } else {
        setGroups(data || [])
        console.log("Fetched groups:", data)
      }
    }

    fetchGroups()
      .finally(() => setLoading(false))
  }, [userId , sortBy, ascending, searchGroupName, offset])



  return (
    <>
      <LoadingOverlay isLoading={loading} />
      <AppTopbar title="Groups" titleIcon={<Home className="h-6 w-6" />} />
      <PageWrapper>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold">Your Groups</h1>
              <span className="text-sm text-muted-foreground">{groups.length} group{groups.length !== 1 ? 's' : ''}</span>
            </div>
            {/* Button Create Group */}
            <AddGroupDialog setGroups={setGroups} setLoading={setLoading} />
          </div>

          {/* filter */}
          <div className="flex gap-4 items-center justify-between mb-4 flex-wrap">
            {/* search */}
            <div className="flex-1 min-w-50">
              <Input type="text" placeholder="Search by Group Name" value={searchGroupName} onChange={e => setSearchGroupName(e.target.value)} />
            </div>
            {/* filter */}
            <div className="flex items-center gap-2">
              <label htmlFor="sortBy" className="text-sm font-medium">Sort by:</label>
              <Select
                defaultValue="createdat"
                onValueChange={(value: "name" | "createdat") => setSortBy(value)}
              >
                <SelectTrigger id="sortBy" className="w-[150px]">
                  {sortBy === "name" ? "Name" : "Creation Date"}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="createdat">Creation Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setAscending(!ascending)}
                className="border rounded px-2 py-1 text-sm"
                variant={"outline"}
              >
                {
                  sortBy === "name" ? (
                    ascending ? <ArrowUpAZ className={`inline-block mr-1 w-4 h-4`} /> : <ArrowDownZA className={`inline-block mr-1 w-4 h-4`} />
                  ) : (
                    ascending ? <CalendarArrowUp className={`inline-block mr-1 w-4 h-4`} /> : <CalendarArrowDown className={`inline-block mr-1 w-4 h-4`} />
                  )
                }
                {ascending ? "Asc" : "Desc"}
              </Button>
            </div>
          </div>
          
          {/* List groups */}
          <motion.ul 
            className="space-y-2"
            initial="hidden"
            animate="show"
            variants={motionUl}
          >
            {groups.length ? groups.map((group, gIndex) => (
              <motion.li 
                key={group.id} 
                variants={motionLi}
                transition={{ delay: gIndex * 0.15, duration: 0.4, ease: "easeOut" }}
                className="flex items-center justify-between py-2 px-4 border rounded-lg hover:bg-muted"
              >
                <Link href={`groups/${group.id}/dashboard`} className="flex-1 flex items-center gap-3">
                  {/* Avatar inisial */}                
                  <GroupAvatar 
                    name={group.name} 
                    image={group.avatar_url} // kalau ada, tampil gambar
                    size="md" 
                  />
                  <div className="flex flex-col">
                    {/* group name */}
                    <span className="font-medium">{group.name}</span>
                    <span className="text-xs text-secondary-foreground">
                      {/* group createdat */}
                      Since{" "}
                      {new Date(group.createdat).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                      })}
                      {' • '}
                      {/* group member total */}
                      {group?.group_members?.length}
                      {' '}member{group?.group_members?.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex items-center gap-4">
                      {/* message */}
                      <span className="pt-2 flex items-center gap-2">
                        <MessageCircleWarning className="text-warning w-5 h-5" />
                        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-warning text-gray-500" variant="outline">
                          5+
                        </Badge>
                      </span>
                      {/* info */}
                      <span className="pt-2 flex items-center gap-2">
                        <BellDot className="text-info w-5 h-5" />
                        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums bg-info text-white" variant="outline">
                          5+
                        </Badge>
                      </span>
                    </div>
                  </div>
                </Link>
                <Link 
                  href={`/groups/${group.id}/manage`} 
                  className="text-sm text-muted-foreground hover:text-warning border rounded-lg p-2"
                >
                  <Settings2 />
                </Link>
              </motion.li>
            )) 
            : 
            (<div>
                <p className="text-center text-muted-foreground">You are not a member of any groups yet. Create or join a group to get started!</p>
            </div>)
            }
          </motion.ul>

          {/* Pagination */}
          {totalRow > limit && (
            <Pagination className="mt-5">              
              <PaginationContent>
                {
                  currentPage > 1 && 
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setOffset((currentPage - 2) * limit)} />
                  </PaginationItem>
                }
                {
                  Array.from({length: totalPages}).map((_,i) => (
                  <PaginationItem
                    key={i + 'pagination'}
                  >
                    <PaginationLink onClick={() => setOffset(i * limit)} isActive={currentPage == i + 1}>{i+1}</PaginationLink>
                  </PaginationItem>
                  ))
                }
                {
                  currentPage < totalPages &&
                  <PaginationItem>
                    <PaginationNext onClick={() => setOffset(currentPage * limit)} />
                  </PaginationItem>
                }
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </PageWrapper>
      <AppBottombar />
    </>
  )
}
