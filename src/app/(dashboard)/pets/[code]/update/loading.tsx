import { TextShimmer } from '@/components/motion'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <TextShimmer>Đang khởi tạo dữ liệu...</TextShimmer>
    </div>
  )
}
