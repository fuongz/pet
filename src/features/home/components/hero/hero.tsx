import { Tilt } from '@/components/motion'
import { Badge, Button } from '@/components/ui'
import { IconBrandGithub } from '@tabler/icons-react'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Hero = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] font-sans w-full flex items-center justify-center overflow-hidden border-b border-accent">
      <div className="max-w-screen-xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-14 gap-x-10 px-6 py-12 lg:py-0">
        <div className="max-w-xl">
          <Badge variant="secondary" className="rounded-full py-1 border-none">
            Phiên bản v0.0.1
          </Badge>
          <h1 className="mt-6 max-w-[20ch] text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-bold !leading-[1.2] tracking-tight">Định danh động vật nuôi</h1>
          <p className="mt-6 max-w-[60ch] text-zinc-500 xs:text-lg">
            Khám phá những thông tin chi tiết về định danh động vật nuôi, từ phương pháp xác định đến lợi ích và ứng dụng. Cập nhật kiến thức về cách chăm sóc và quản lý thú cưng của bạn hiệu quả hơn.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
            <Button size="lg" className="rounded-full" asChild>
              <Link href="/demo">
                Trải nghiệm bản dùng thử <ArrowUpRight className="!h-5 !w-5" />
              </Link>
            </Button>

            <Button variant={'outline'} size="lg" className="rounded-full" asChild>
              <Link href="https://github.com/fuongz/pets">
                <IconBrandGithub className="!h-5 !w-5" /> Source code
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative lg:max-w-lg xl:max-w-xl w-full">
          <Tilt rotationFactor={8}>
            <Image width={600} height={380} src="/images/card-sample.jpeg" alt="" className="object-cover rounded-xl" />
          </Tilt>
        </div>
      </div>
    </div>
  )
}

export { Hero }
