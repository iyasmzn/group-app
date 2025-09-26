import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

export default function ClockWidget() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted">
      <Clock className="w-6 h-6 mb-2 text-primary" />
      <span className="text-lg font-semibold">
        {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
      <span className="text-xs text-muted-foreground">
        {now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </span>
    </div>
  )
}