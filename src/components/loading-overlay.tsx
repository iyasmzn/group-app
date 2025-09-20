import { DotsSpinner } from "./animations/dots-spinner";
import { Loader } from "./animations/loader";

export default function LoadingOverlay({isLoading = true}: {isLoading?: boolean}) {
  return (
    isLoading && (
      <div className="fixed inset-0 bg-background/70 flex items-center justify-center z-50">
          <Loader type="heartbeat" />
      </div>
    )
  )
}