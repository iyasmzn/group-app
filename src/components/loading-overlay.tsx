import { DotsSpinner } from "./animations/dots-spinner";
import { Loader } from "./animations/loader";

export default function LoadingOverlay({isLoading = true, absolute = false}: {isLoading?: boolean, absolute?: boolean}) {
  return (
    isLoading && (
      <div className={(absolute ? 'absolute' : 'fixed') +" inset-0 bg-background/70 flex items-center justify-center z-50"}>
          <Loader type="heartbeat" />
      </div>
    )
  )
}