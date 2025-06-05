import { Button } from '@/components/ui'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="relative text-center z-[1] pt-52 pb-16">
      <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-primary sm:text-7xl">Page not found</h1>
      <p className="mt-6 text-pretty text-lg font-medium text-muted-foreground sm:text-xl/8">Lost, this page is. In another system, it may be.</p>
      <div className="mt-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-y-3 gap-x-6">
        <Button asChild variant="secondary" className="group">
          <Link href="/">
            <ArrowLeft className="me-2 ms-0 opacity-60 transition-transform group-hover:-translate-x-0.5" size={16} strokeWidth={2} aria-hidden="true" />
            Go home
          </Link>
        </Button>
      </div>
    </div>
  )
}
