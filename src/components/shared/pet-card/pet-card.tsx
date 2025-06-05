'use client'

import { Tilt } from '@/components/motion'
import { formatDate } from 'date-fns'
import { useHotkeys } from '@/hooks'
import { useToPng } from '@hugocxl/react-to-image'
import { Printer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMounted, useOs } from '@/hooks'
import { Button } from '@/components/ui'
import { GENDER_ENUM } from '@/constants/gender'
import { useAuthStore } from '@/app/auth-provider'
import Image from 'next/image'

interface Props {
  petId: string | null
  pet: { dateOfIssue: Date; fullName: string; ownerName: string; hometown: string; gender: string; dateOfBirth: Date; breed: string; avatar?: File | undefined }
}

function PetCard({ pet, petId }: Props) {
  const { isAuthenticated } = useAuthStore((store) => store)
  const mounted = useMounted()
  const [avatar, setAvatar] = useState<string | null>(null)

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
  useHotkeys([[`mod + i`, () => convertToSvg(), { preventDefault: false, usePhysicalKeys: true }]])
  return (
    <div>
      <div className="mt-4 relative w-full xl:mt-0">
        <Tilt rotationFactor={8} className="flex w-max justify-center w-full">
          <div
            ref={ref}
            style={{
              borderRadius: '12px',
            }}
            className="flex shadow-xl gap-6 relative w-[580px] h-[380px] p-6 pl-10 overflow-hidden bg-white"
          >
            <div className="absolute bg-gradient-to-b from-violet-200 to-pink-200 h-full w-4 left-0 top-0 z-2"></div>
            <div className="absolute opacity-50 bottom-0 left-0 w-full h-full z-1">
              <img alt="Pet - Background Card" src="/images/card-bg-01.jpg" className="object-cover h-full w-full" />
            </div>
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
                    <span className="font-semibold text-gray-900 text-left">{pet.breed}</span>
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

            <div className="absolute hidden bottom-6 left-10 z-2">
              <img alt="QR Code" className="w-[56px]" src="/images/qr-code.png" />
            </div>
          </div>
        </Tilt>
      </div>

      <div className="flex justify-center mt-12">
        <Button variant="outline" size="lg" onClick={convertToSvg}>
          <Printer className="-ms-1 me-2 opacity-80" size={16} strokeWidth={2} aria-hidden="true" />
          In ảnh
          {os !== 'undetermined' && (
            <kbd className="-me-1 ms-3 inline-flex h-6 max-h-full items-center rounded bg-zinc-100 px-1.25 font-[inherit] text-sm font-medium text-zinc-700/70">{os === 'macos' ? '⌘' : 'Ctrl'}+ I</kbd>
          )}
        </Button>
      </div>
    </div>
  )
}
export { PetCard }
