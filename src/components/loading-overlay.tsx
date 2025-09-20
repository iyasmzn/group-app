import { Loader2 } from "lucide-react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Loader2 className="h-10 w-10 text-white animate-spin" />
    </div>
  )
}