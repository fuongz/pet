'use client'

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Calendar,
  Separator,
} from '@/components/ui'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { cn } from '@/lib'
import { format } from 'date-fns'
import { useCatBreed, useMounted } from '@/hooks'
import { TZDate } from '@date-fns/tz'
import { IconAlertCircleFilled, IconBrandGoogleFilled, IconHeartFilled } from '@tabler/icons-react'
import { AlertMotion, PetCard } from '@/features/home/components'
import { signInWithGoogleAction } from './(auth)/actions'
import { TextShimmer } from '@/components/motion'
import { useAuthStore } from './auth-provider'
import { createClient } from '@/lib/supabase/client'
import { GENDER_ENUM } from '@/constants/gender'

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
const supabase = createClient()

const formSchema = z.object({
  dateOfIssue: z.date({
    required_error: 'Vui lòng nhập ngày cấp.',
  }),
  fullName: z.string({
    required_error: 'Vui lòng nhập tên thú cưng.',
  }),
  ownerName: z.string({
    required_error: 'Vui lòng nhập tên chủ sở hữu.',
  }),
  hometown: z
    .string({
      required_error: 'Vui lòng nhập quê quán.',
    })
    .max(60, {
      message: 'Quê quán không được quá 60 ký tự.',
    }),
  gender: z.string({
    required_error: 'Vui lòng chọn giới tính.',
  }),
  dateOfBirth: z.date({
    required_error: 'Vui lòng nhập ngày tháng năm sinh.',
  }),
  breed: z.string({
    required_error: 'Vui lòng chọn giống thú cưng.',
  }),
  avatar: z
    .instanceof(File)
    .refine((file) => file.size < 1 * 1024 * 1024, {
      message: 'Your resume must be less than 1MB.',
    })
    .refine((file) => ACCEPTED_FILE_TYPES.includes(file.type), {
      message: 'Chỉ chấp nhận file ảnh định dạng JPEG, PNG, WEBP hoặc JPG.',
    }),
})

export default function Home() {
  const { breeds } = useCatBreed()
  const { auth, isAuthenticated } = useAuthStore((store) => store)
  const [petId, setPetId] = useState<string | null>(null)
  const mounted = useMounted()
  const [randomNumber, setRandomNumber] = useState<string>('0')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: 'Mây',
      ownerName: 'Phùng Thế Phương',
      gender: '0',
      hometown: 'Thủ Đức, Hồ Chí Minh',
      dateOfBirth: new TZDate(2023, 6, 9, 'Asia/Ho_Chi_Minh'),
      breed: 'British Shorthair',
      dateOfIssue: new TZDate(new Date(), 'Asia/Ho_Chi_Minh'),
      avatar: new File([], ''),
    },
  })

  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>(form.getValues())

  useEffect(() => {
    if (mounted) {
      const random = Math.floor(Math.random() * 100000000000)
        .toString()
        .padStart(10, '0')
      setRandomNumber(random)
    }
  }, [mounted])

  const generatePetId = () => {
    const idType = isAuthenticated ? 'C' : ''
    const genderInt = parseInt(formValues.gender, 10)
    const genderCode = GENDER_ENUM[genderInt] === 'Male' ? '1' : GENDER_ENUM[genderInt] === 'Female' ? '0' : '2'
    const yearBod = formValues.dateOfBirth.getFullYear().toString()
    const idMask = `${idType}${yearBod}${genderCode}${randomNumber}`
    return idMask
  }

  useEffect(() => {
    if (mounted && formValues) {
      const id = generatePetId()
      setPetId(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, randomNumber])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = form.watch((values: any) => {
      setFormValues(values)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { avatar, ...rest } = data
    if (avatar && avatar.size > 0) {
      const fileType = avatar.type.split('/')[1]
      const fileName = `${petId}.${fileType}`
      const { data: uploadedData, error } = await supabase.storage.from('pet-avatars').upload(`${auth?.id}/${Date.now()}-${fileName}`, data.avatar, {
        cacheControl: '3600',
        upsert: false,
      })
      if (uploadedData || !error) {
        const newData = {
          ...rest,
        }
        await supabase.from('pets').insert({
          ...newData,
          code: petId,
          authId: auth?.id,
          avatar: uploadedData.path,
        })
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setPetId(null)
      setFormValues(form.getValues())
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <TextShimmer>Đang khởi tạo dữ liệu...</TextShimmer>
      </div>
    )
  }

  return (
    <div className="flex flex-col font-sans bg-violet-50 justify-center items-center lg:h-dvh lg:w-dvw">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="order-last lg:order-first">
          <PetCard petId={petId} pet={formValues} />
        </div>
        <div>
          {!isAuthenticated ? (
            <form className="mb-4">
              <AlertMotion variant="success">
                <div>Đăng nhập để định danh thú cưng của bạn và nhận mã định danh duy nhất.</div>
                <Button variant="outline" className="mt-2 text-zinc-600" formAction={signInWithGoogleAction}>
                  <IconBrandGoogleFilled className="me-3 text-[#DB4437] dark:text-white/60" size={16} aria-hidden="true" />
                  Đăng nhập với Google
                </Button>
              </AlertMotion>
            </form>
          ) : (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Đang đăng nhập với tài khoản:</p>
              <div className="flex items-center gap-2 rounded-md p-2 bg-white shadow-sm">
                <img src={auth?.user_metadata?.avatar_url || '/default-avatar.png'} alt="Avatar" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold">{auth?.user_metadata?.full_name || 'No name'}</span>
                <span className="text-xs text-gray-500">({auth?.email})</span>
                <form className="ml-auto">
                  <button onClick={() => signOut()} className="text-sm font-medium hover:underline cursor-pointer text-rose-600">
                    Đăng xuất
                  </button>
                </form>
              </div>
            </div>
          )}
          <Card className="hidden lg:block">
            <CardHeader>
              <CardTitle className="relative">Nhập thông tin động vật nuôi</CardTitle>
              <CardDescription>Vui lòng nhập thông tin động vật nuôi theo biểu mẫu dưới đây để định danh động vật nuôi.</CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="avatar"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel>Hình đại diện</FormLabel>
                        <FormControl>
                          <Input {...fieldProps} type="file" accept="image/*, application/pdf" onChange={(event) => onChange(event.target.files && event.target.files[0])} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên thú cưng</FormLabel>
                        <FormControl>
                          <Input placeholder="Tên thú cưng" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giới tính</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0">Female</SelectItem>
                              <SelectItem value="1">Male</SelectItem>
                              <SelectItem value="2">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="breed"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chọn giống</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn giống" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {breeds.map((breed) => (
                                <SelectItem key={breed.key} value={breed.value}>
                                  {breed.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày, tháng, năm sinh</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                                {field.value ? format(field.value, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date('1900-01-01')} initialFocus />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên chủ sở hữu</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hometown"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quê quán</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập quê quán" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isAuthenticated && (
                    <Button type="submit" className="w-full">
                      Đăng ký định danh
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 text-gray-500 text-sm text-center">
        <div className="flex flex-wrap items-center justify-center gap-1 mb-2">
          Made with <IconHeartFilled className="w-4 text-red-600" /> by{' '}
          <a href="https://phuongphung.com?ref=pet.phake.app" target="_blank" className="font-semibold underline">
            fuongz.
          </a>
          Checkout the source code on{' '}
          <a href="https://github.com/phake-studio/pet" className="font-semibold underline" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </div>
      </div>
    </div>
  )
}
