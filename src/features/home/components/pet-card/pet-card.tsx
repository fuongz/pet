'use client'

import { Tilt } from '@/components/motion'
import { formatDate } from 'date-fns'
import { useHotkeys } from '@/hooks'
import { useToPng } from '@hugocxl/react-to-image'
import { Button } from '@/components/ui'
import { Printer } from 'lucide-react'
import { useOs } from '@/hooks/use-os/use-os'
import { useEffect, useState } from 'react'
import { useMounted } from '@/hooks/use-mounted/use-mounted'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  pet: { dateOfIssue: Date; fullName: string; ownerName: string; hometown: string; gender: string; dateOfBirth: Date; breed: string; avatar: File }
}

function PetCard({ pet }: Props) {
  const mounted = useMounted()
  const [randomNumber, setRandomNumber] = useState<string>('0')
  const [petId, setPetId] = useState<string | null>(null)
  const [avatar, setAvatar] = useState<string | null>(null)

  useEffect(() => {
    if (mounted) {
      const random = Math.floor(Math.random() * 100000000000)
        .toString()
        .padStart(10, '0')
      setRandomNumber(random)
    }
  }, [mounted])

  useEffect(() => {
    if (mounted && pet) {
      const id = generatePetId()
      if (pet.avatar && pet.avatar.size > 0) {
        setAvatar(URL.createObjectURL(pet.avatar))
      }
      setPetId(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet, randomNumber])

  const generatePetId = () => {
    const genderCode = pet.gender === 'Male' ? '1' : pet.gender === 'Female' ? '0' : '2'
    const yearBod = pet.dateOfBirth.getFullYear().toString()
    const idMask = `C${yearBod}${genderCode}${randomNumber}`
    return idMask
  }

  const os = useOs()
  const [, convertToSvg, ref] = useToPng<HTMLDivElement>({
    onSuccess: (data) => {
      const link = document.createElement('a')
      link.download = `${petId}.jpeg`
      link.href = data
      link.click()
    },
  })

  useHotkeys([[`mod + i`, () => convertToSvg(), { preventDefault: false, usePhysicalKeys: true }]])

  return (
    <div>
      <Tilt rotationFactor={8} isReverse>
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
              <img src={avatar || `/images/C2023010000000000.png`} alt="May - Cat Citizen" className="w-full w-full object-cover" />
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
                {!petId ? <Skeleton className="h-6 bg-blue-50 w-[250px]" /> : <span className="font-semibold text-gray-900 text-left">{petId}</span>}
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
                  <span className="font-semibold text-gray-900 text-left">{pet.gender || 'Chưa có thông tin'}</span>
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
                <span className="font-semibold text-gray-900 line-clamp-1 text-left">{pet.ownerName || 'Chưa có thông tin'}</span>
              </div>

              <div className="flex gap-4 items-start mt-2">
                <div className="flex flex-col text-left shrink-0">
                  <span className="text-sm text-gray-600 font-medium ">Quê quán</span>
                  <span className="text-xs text-gray-400 italic">Hometown</span>
                </div>
                <span className="font-semibold text-gray-900 text-left line-clamp-2">{pet.hometown || 'Chưa có thông tin'}</span>
              </div>
            </div>
          </div>

          <div className="absolute hidden bottom-6 left-10 z-2">
            <img alt="QR Code" className="w-[56px]" src="/images/qr-code.png" />
          </div>
        </div>
      </Tilt>

      <Button size="xl" className="mt-12 w-full" onClick={convertToSvg}>
        <Printer className="-ms-1 me-2 opacity-80" size={16} strokeWidth={2} aria-hidden="true" />
        In ảnh
        {os !== 'undetermined' && (
          <kbd className="-me-1 ms-3 inline-flex h-6 max-h-full items-center rounded border border-zinc-700 bg-zinc-800 px-1.25 font-[inherit] text-sm font-medium text-white/70">
            {os === 'macos' ? '⌘' : 'Ctrl'}+ I
          </kbd>
        )}
      </Button>
    </div>
  )
}
export { PetCard }
