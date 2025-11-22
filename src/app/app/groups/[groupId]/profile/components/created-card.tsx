import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { longDateTime } from '@/lib/utils/format'
import { GroupData } from '@/types/group.type'

type CreatedCardProps = {
  group?: GroupData
}

export default function CreatedCard({ group }: CreatedCardProps) {
  if (!group || !group.createdat || !group.owner) {
    return (
      <Card className="mb-4">
        <CardHeader>
          <CardDescription>Group Created</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-100"></Skeleton>
          <CardDescription className="pt-2">
            <Skeleton className="h-4 w-50"></Skeleton>
          </CardDescription>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardDescription>Group Created</CardDescription>
      </CardHeader>
      <CardContent>
        {longDateTime(group?.createdat)}
        <CardDescription>by {group?.owner?.full_name}</CardDescription>
      </CardContent>
    </Card>
  )
}
