'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/app/auth-provider'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface Props {
  pets: Array<{ code: string; dateOfIssue: Date; fullName: string; ownerName: string; hometown: string; gender: string; dateOfBirth: Date; breed: string; avatar: File }>
}

function PetSelector({ pets, className, ...props }: Props & React.ComponentProps<'div'>) {
  const { auth } = useAuthStore((store) => store)
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">👋 Xin chào {auth?.user_metadata.full_name}!</CardTitle>
          <CardDescription>Chọn một vật nuôi của bạn để cập nhật thông tin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                {pets &&
                  pets.length > 0 &&
                  pets.map((pet) => (
                    <Link href={`/pets/${pet.code}/update`} key={pet.code} className="flex items-start shadow-sm gap-2 rounded-md p-2 hover:bg-zinc-100 transition hover:transition bg-white border">
                      <Image width={48} height={48} src={`${process.env.NEXT_PUBLIC_CDN_URL}/pet-avatars/${pet.avatar}` || '/default-avatar.png'} alt="Avatar" className="rounded-full" />
                      <div className="flex flex-col gap-1 grow-1">
                        <span className="text-sm font-semibold truncate w-[200px]">{pet.fullName || 'No name'}</span>
                        <span className="text-xs text-zinc-500">{pet.code}</span>
                        <span className="text-xs text-zinc-500">{pet.breed}</span>
                      </div>
                    </Link>
                  ))}
              </div>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">Hoặc tạo mới</span>
              </div>

              <Button asChild>
                <Link href="/pets/create">
                  <Plus className="opacity-60 sm:-ms-1 sm:me-2" size={16} strokeWidth={2} aria-hidden="true" />
                  <span>Tạo mới định danh</span>
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export { PetSelector }
