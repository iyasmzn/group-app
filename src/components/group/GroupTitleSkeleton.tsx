"use client"

export function GroupTitleSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-700" />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-700" />
        <div className="h-3 w-16 rounded bg-gray-200 dark:bg-gray-600" />
      </div>
    </div>
  )
}