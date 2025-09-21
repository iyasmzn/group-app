import QRCode from "react-qr-code"
import { Skeleton } from "./ui/skeleton"

type QrCodeProps = {
  text?: string,
  size?: number
}

export function GlobalQRCode({ text, size = 200 }: QrCodeProps) {
  return (
    <div className="p-4 bg-white rounded-xl shadow inline-block">
      {
        text ? <QRCode value={text} size={size} viewBox={`0 0 ${size} ${size}`} /> :
        (
          <Skeleton className={`w-${size} h-${size}`}></Skeleton>
        )
      }
    </div>
  )
}
