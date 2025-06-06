'use client'

import { Tilt } from '@/components/motion'
import { formatDate } from 'date-fns'
import { useCardTheme, useCatBreed, useHotkeys } from '@/hooks'
import { useToPng } from '@hugocxl/react-to-image'
import { Printer } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useMounted, useOs } from '@/hooks'
import { Button, Card, CardContent, Input } from '@/components/ui'
import { GENDER_ENUM } from '@/constants/gender'
import { useAuthStore } from '@/app/auth-provider'
import Image from 'next/image'
import { cn } from '@/lib'
import { IconClipboard } from '@tabler/icons-react'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard/use-copy-to-clipboard'
import { toast } from 'sonner'

interface Props {
  petId: string | null
  viewAs?: 'guest' | 'share' | 'authenticated'
  action?: 'create' | 'update' | 'view'
  pet: { dateOfIssue: Date; fullName: string; ownerName: string; hometown: string; gender: string; dateOfBirth: Date; breed: string; avatar?: File | undefined; publish: number | boolean }
}

function PetCard({ pet, petId, viewAs, action }: Props) {
  const { breeds } = useCatBreed()
  const { themes } = useCardTheme()

  const [, copy] = useCopyToClipboard()

  const mounted = useMounted()
  const { isAuthenticated } = useAuthStore((store) => store)
  const [avatar, setAvatar] = useState<string | null>(null)
  const [cardTheme, setCardTheme] = useState(themes[0])
  const petBreed = useMemo(() => {
    return breeds.find((b) => b.key === pet.breed)?.vietnamese || pet.breed
  }, [pet.breed, breeds])

  useEffect(() => {
    if (mounted && pet) {
      if (typeof pet.avatar === 'string') setAvatar(`${process.env.NEXT_PUBLIC_CDN_URL}/pet-avatars/${pet.avatar}`)
      else if (pet.avatar && pet.avatar.size > 0) {
        setAvatar(URL.createObjectURL(pet.avatar))
      }
    }
    return () => {
      if (avatar) URL.revokeObjectURL(avatar)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet, mounted])

  const os = useOs()
  const [, convertToSvg, ref] = useToPng<HTMLDivElement>({
    onSuccess: (data) => {
      const link = document.createElement('a')
      link.download = `friend-${new Date().getTime()}.jpeg`
      link.href = data
      link.click()
    },
  })

  const handleCopyLink = () => {
    copy(`${window.location.origin}/share/${petId}`).then(() =>
      toast.success(`Đã sao chép liên kết. Bấm tổ hợp phím ${os === 'macos' ? '⌘' : 'Ctrl'}+ V để dán liên kết.`, {
        position: 'top-center',
      })
    )
  }

  useHotkeys([[`mod + i`, () => viewAs !== 'share' && convertToSvg(), { preventDefault: false, usePhysicalKeys: true }]])
  useHotkeys([[`mod + alt + k`, () => viewAs !== 'share' && handleCopyLink(), { preventDefault: false, usePhysicalKeys: true }]])
  return (
    <div className="py-12">
      {viewAs !== 'share' && (
        <div className="gap-4 mb-6">
          <h3 className="text-md font-semibold">Chọn nền</h3>
          <div className="flex items-center gap-2 mt-2">
            {themes.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setCardTheme(theme)}
                className={cn(
                  'w-6 h-6 rounded overflow-hidden border-2 border-zinc-200 cursor-pointer hover:ring-2 ring-zinc-400 transition hover:transition',
                  theme.id === cardTheme.id ? 'ring-2 ring-primary/50' : ''
                )}
              >
                {theme.backgroundUrl ? (
                  <Image width={24} height={24} alt="Pet - Background Card" src={theme.backgroundUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className={cn('w-full h-full', theme.backgroundColor)}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 relative w-full xl:mt-0">
        <Tilt rotationFactor={8} className="flex w-max justify-center w-full">
          <div
            ref={ref}
            style={{
              borderRadius: '12px',
            }}
            className="flex shadow-xl gap-6 relative w-[600px] h-[380px] p-6 pl-10 overflow-hidden bg-white"
          >
            {cardTheme.childComponents}
            {cardTheme.backgroundUrl && (
              <div className="absolute opacity-50 bottom-0 left-0 w-full h-full z-1">
                <Image width={600} height={380} alt="Pet - Background Card" src={cardTheme.backgroundUrl} className={cn('h-full w-full', cardTheme.className)} />
              </div>
            )}
            {cardTheme.backgroundColor && <div className={cn('absolute opacity-50 bottom-0 left-0 w-full h-full z-1', cardTheme.backgroundColor)}></div>}
            <div className="mt-16 z-2">
              <div className="w-[96px] h-[96px] shadow-xl rounded overflow-hidden">
                <Image width={96} height={96} src={avatar || `/images/sample.png`} alt="May - Cat Citizen" className="w-full w-full object-cover" />
              </div>

              <div>
                <div className="flex flex-col text-left mt-6">
                  <span className="text-sm text-gray-600 font-medium">Ngày cấp</span>
                  <span className="text-xs text-gray-400 italic">Date of issue</span>
                </div>
                <span className="font-semibold text-sm text-gray-900">{formatDate(pet.dateOfIssue, 'dd/MM/yyyy')}</span>
              </div>
            </div>

            <div className="w-full z-2 flex flex-col h-full justify-between">
              <div className="text-center">
                <div>
                  <p className="uppercase text-blue-900 text-xl font-bold">Định danh động vật nuôi</p>
                  <p className="text-xs text-gray-400 italic">Pet Identification</p>
                </div>
                <div className="flex gap-4 items-start mt-4">
                  <div className="flex flex-col text-left shrink-0">
                    <span className="text-sm text-gray-600 font-medium">Số định danh</span>
                    <span className="text-xs text-gray-400 italic">Identification No.</span>
                  </div>
                  {!isAuthenticated || !petId ? (
                    <span className="font-semibold text-rose-300 text-left uppercase">Chưa được định danh</span>
                  ) : (
                    <span className="font-semibold text-gray-900 text-left line-clamp-1">{petId}</span>
                  )}
                </div>

                <div className="flex gap-4 items-start mt-2">
                  <div className="flex flex-col text-left shrink-0">
                    <span className="text-sm text-gray-600 font-medium">Họ và Tên</span>
                    <span className="text-xs text-gray-400 italic">Full name</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-left line-clamp-1">{pet.fullName}</span>
                </div>

                <div className="grid grid-cols-5 gap-4 justify-between">
                  <div className="flex col-span-2 gap-4 items-start mt-2">
                    <div className="flex flex-col text-left shrink-0">
                      <span className="text-sm text-gray-600 font-medium">Giới tính</span>
                      <span className="text-xs text-gray-400 italic">Gender</span>
                    </div>
                    <span className={`text-gray-900 text-left ${!pet.gender ? 'italic text-zinc-400' : 'font-semibold'}`}>{pet.gender ? GENDER_ENUM[parseInt(pet.gender, 10)] : 'Khác'}</span>
                  </div>

                  <div className="flex col-span-3 gap-4 items-start mt-2">
                    <div className="flex flex-col text-left shrink-0">
                      <span className="text-sm text-gray-600 font-medium">Giống</span>
                      <span className="text-xs text-gray-400 italic">Breed</span>
                    </div>
                    <span className="font-semibold text-gray-900 text-left">{petBreed}</span>
                  </div>
                </div>

                <div className="flex gap-4 items-start mt-2">
                  <div className="flex flex-col text-left shrink-0">
                    <span className="text-sm text-gray-600 font-medium">Ngày, tháng, năm sinh</span>
                    <span className="text-xs text-gray-400 italic">Day of birth</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-left">{formatDate(pet.dateOfBirth, 'dd/MM/yyyy')}</span>
                </div>

                <div className="flex gap-4 items-start mt-2">
                  <div className="flex flex-col text-left shrink-0">
                    <span className="text-sm text-gray-600 font-medium">Tên chủ sở hữu</span>
                    <span className="text-xs text-gray-400 italic">Owner&apos;s name</span>
                  </div>
                  <span className="font-semibold text-gray-900 line-clamp-1 text-left">{pet.ownerName}</span>
                </div>

                <div className="flex gap-4 items-start mt-2">
                  <div className="flex flex-col text-left shrink-0">
                    <span className="text-sm text-gray-600 font-medium ">Quê quán</span>
                    <span className="text-xs text-gray-400 italic">Hometown</span>
                  </div>
                  <span className="font-semibold text-gray-900 text-left line-clamp-2">{pet.hometown}</span>
                </div>
              </div>
            </div>

            <div className="absolute bottom-6 hidden left-10 z-2">
              <Image width={56} height={56} alt="QR Code" src="/images/qr-code.png" />
            </div>
          </div>
        </Tilt>
      </div>

      {viewAs !== 'share' && (
        <>
          <div className="flex justify-center mt-12 gap-4">
            <Button variant="outline" size="lg" onClick={convertToSvg}>
              <Printer className="-ms-1 me-2 opacity-80" size={16} strokeWidth={2} aria-hidden="true" />
              In ảnh
              {os !== 'undetermined' && (
                <kbd className="-me-1 ms-3 inline-flex h-6 max-h-full items-center rounded bg-zinc-100 px-1.25 font-[inherit] text-sm font-medium text-zinc-700/70">
                  {os === 'macos' ? '⌘' : 'Ctrl'}+ I
                </kbd>
              )}
            </Button>

            {isAuthenticated && action === 'update' && (pet.publish === 1 || pet.publish === true) && (
              <div className="flex w-full max-w-[400px] -space-x-px">
                <Input type="text" id="name" value={`${window.location.origin}/share/${petId}`} disabled aria-readonly className="rounded-r-none bg-white" />
                <Button onClick={() => handleCopyLink()} variant="outline" className="rounded-l-none">
                  <IconClipboard className="-ms-1 me-1 opacity-80" size={16} strokeWidth={2} aria-hidden="true" />
                  Sao chép
                  {os !== 'undetermined' && (
                    <kbd className="-me-1 ms-1 inline-flex h-6 max-h-full items-center rounded bg-zinc-100 px-1.25 font-[inherit] text-sm font-medium text-zinc-700/70">
                      {os === 'macos' ? '⌘' : 'Ctrl'}+{os === 'macos' ? '⌥' : 'Alt'}+ K
                    </kbd>
                  )}
                </Button>
              </div>
              // </Button>
            )}
          </div>
        </>
      )}

      {viewAs !== 'share' && (
        <Card className="shadow-sm mt-6 border-0 bg-white/70 backdrop-blur-sm">
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-3">Lưu ý quan trọng</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                Mã định danh chỉ được cấp sau khi đăng ký thông tin thú cưng.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                Vui lòng cung cấp thông tin chính xác và đầy đủ
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                Hình ảnh thú cưng cần rõ nét và chất lượng cao
              </li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
export { PetCard }
