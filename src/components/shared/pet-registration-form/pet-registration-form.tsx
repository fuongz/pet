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
} from '@/components/ui'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { cn } from '@/lib'
import { format, formatDate } from 'date-fns'
import { useCatBreed } from '@/hooks'
import { TZDate } from '@date-fns/tz'
import { IconArrowLeft, IconBrandGoogleFilled, IconEditCircle, IconLoader2, IconUserScan } from '@tabler/icons-react'
import { PetCard } from '@/components/shared'
import { signInWithGoogleAction } from '@/app/(auth)/actions'
import { TextShimmer, AlertMotion } from '@/components/motion'
import { useAuthStore } from '@/app/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { GENDER_ENUM } from '@/constants/gender'
import { toast } from 'sonner'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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
    .any()
    .optional()
    .refine((file) => typeof file === 'undefined' || typeof file === 'string' || (file && file.size < 1 * 1024 * 1024), {
      message: 'Your resume must be less than 1MB.',
    })
    .refine((file) => typeof file === 'undefined' || typeof file === 'string' || (file && ACCEPTED_FILE_TYPES.includes(file.type)), {
      message: 'Chỉ chấp nhận file ảnh định dạng JPEG, PNG, WEBP hoặc JPG.',
    }),
})

const DEFAULT_VALUES = {
  guest: {
    fullName: 'Mây',
    ownerName: 'Phùng Thế Phương',
    gender: '0',
    hometown: 'Thủ Đức, Hồ Chí Minh',
    dateOfBirth: new TZDate(2023, 6, 9, 'Asia/Ho_Chi_Minh'),
    breed: 'british-shorthair',
    dateOfIssue: new TZDate(new Date(), 'Asia/Ho_Chi_Minh'),
    avatar: new File([], ''),
  },
  create: {
    fullName: '',
    ownerName: '',
    gender: '2',
    hometown: '',
    dateOfBirth: new TZDate(new Date(), 'Asia/Ho_Chi_Minh'),
    breed: '',
    dateOfIssue: new TZDate(new Date(), 'Asia/Ho_Chi_Minh'),
    avatar: new File([], ''),
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PetRegistrationForm({ viewAs = 'guest', action = 'create', pet = null }: { viewAs?: 'guest' | 'authenticated'; action?: 'create' | 'update'; pet?: any }) {
  const { breeds } = useCatBreed()
  const { auth, isAuthenticated } = useAuthStore((store) => store)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: viewAs === 'guest' ? DEFAULT_VALUES.guest : action === 'create' ? DEFAULT_VALUES.create : pet,
  })

  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>(form.getValues())

  const generateId = () => {
    const rs = Math.floor(Math.random() * 100000000000)
      .toString()
      .padStart(10, '0')
    const idType = isAuthenticated ? 'C' : ''
    const genderInt = parseInt(formValues.gender, 10)
    const genderCode = GENDER_ENUM[genderInt] === 'Male' ? '1' : GENDER_ENUM[genderInt] === 'Female' ? '0' : '2'
    const yearBod = formValues.dateOfBirth.getFullYear().toString()
    const idMask = `${idType}${yearBod}${genderCode}${rs}`
    return idMask
  }

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = form.watch((values: any) => {
      setFormValues(values)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    let petId = null

    if (action === 'create') {
      petId = generateId()
    } else {
      petId = pet.code
    }

    if (viewAs === 'guest' || !petId || !auth) {
      toast.error('Vui lọc nhập thống tin cơ bản')
      return
    }
    const { avatar, ...rest } = data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newData: any = {
      ...rest,
      gender: parseInt(data.gender, 10),
      dateOfBirth: formatDate(data.dateOfBirth, 'dd/MM/yyyy'),
    }
    if (avatar && avatar.size > 0) {
      const fileType = avatar.type.split('/')[1]
      const fileName = `${petId}.${fileType}`
      const { data: uploadedData, error } = await supabase.storage.from('pet-avatars').upload(`${auth?.id}/${Date.now()}-${fileName}`, avatar, {
        cacheControl: '3600',
        upsert: false,
      })

      if (uploadedData || !error) {
        newData = {
          ...rest,
          avatar: uploadedData.path,
        }
      }
    }

    if (action === 'create') {
      newData = {
        ...newData,
        dateOfIssue: formatDate(new Date(), 'dd/MM/yyyy'),
        code: petId,
        authId: auth?.id,
      }
      const { error, data: newPet } = await supabase.from('pets').insert(newData).select('*')
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Khởi tạo thành công')
        redirect(`/pets/${newPet[0].code}/update`)
      }
    } else if (action === 'update') {
      delete newData.dateOfIssue
      const { error } = await supabase.from('pets').update(newData).eq('id', pet.id)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Cập nhật thành công')
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setFormValues(form.getValues())
      toast.success('Đã đăng xuất!')
      redirect('/')
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
    <div className="flex flex-col font-sans py-6 bg-violet-50 justify-center items-center min-h-svh min-w-svw">
      <div className="lg:container relative mx-auto px-4 flex flex-wrap gap-6 w-full justify-center items-center">
        <div className="col-span-2 md:col-span-1">
          {!isAuthenticated ? (
            <form className="mb-4">
              <AlertMotion variant="success">
                <div>Đăng nhập để định danh thú cưng của bạn và nhận mã định danh duy nhất.</div>
                <Button variant="outline" className="mt-4 md:mt-2 text-zinc-600 w-full md:w-auto" formAction={signInWithGoogleAction}>
                  <IconBrandGoogleFilled className="me-3 text-[#DB4437] dark:text-white/60" size={16} aria-hidden="true" />
                  <span>Đăng nhập với Google</span>
                </Button>
              </AlertMotion>
            </form>
          ) : (
            <div className="mb-4 mt-4">
              {['update', 'create'].includes(action) && (
                <Button asChild variant="link" className="mb-6">
                  <Link href={`/pets`}>
                    <IconArrowLeft className="me-3" size={16} aria-hidden="true" />
                    <span>Trở lại danh sách</span>
                  </Link>
                </Button>
              )}
              <p className="text-sm text-gray-500 mb-2">Đang đăng nhập với tài khoản:</p>
              <div className="flex w-full flex-col md:flex-row md:items-center gap-2 rounded-md p-2 bg-white shadow-sm">
                <div className="flex items-center gap-2">
                  <Image width={32} height={32} src={auth?.user_metadata?.picture || '/sample.png'} alt="Avatar" className="w-8 h-8 rounded-full" />
                  <span className="text-sm font-semibold">{auth?.user_metadata?.full_name || 'No name'}</span>
                </div>
                <span className="text-xs text-gray-500">({auth?.email})</span>
                <form className="md:ml-auto">
                  <button onClick={() => signOut()} className="text-sm font-medium hover:underline cursor-pointer text-rose-600">
                    Đăng xuất
                  </button>
                </form>
              </div>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="relative">Nhập thông tin thú cưng</CardTitle>
              <CardDescription>Vui lòng nhập thông tin thú cưng theo biểu mẫu dưới đây để định danh thú cưng</CardDescription>
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
                  {action !== 'update' && (
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
                                <SelectItem value="0">Cái</SelectItem>
                                <SelectItem value="1">Đực</SelectItem>
                                <SelectItem value="2">Khác</SelectItem>
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
                            <FormLabel>Chủng giống</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn giống" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {breeds.map((breed) => (
                                  <SelectItem key={breed.key} value={breed.key}>
                                    {breed.vietnamese}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {action !== 'update' && (
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
                              <Calendar
                                numberOfMonths={2}
                                defaultMonth={field.value ?? new Date()}
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="ownerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên chủ sở hữu</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên chủ sở hữu" {...field} />
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

                  {viewAs === 'authenticated' && action === 'create' && (
                    <Button size="lg" type="submit" disabled={form.formState.isSubmitting} className="w-full mt-4">
                      {form.formState.isSubmitting ? <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> : <IconUserScan className="mr-2 h-4 w-4" />}
                      Định danh
                    </Button>
                  )}

                  {viewAs === 'authenticated' && action === 'update' && (
                    <Button size="lg" type="submit" disabled={form.formState.isSubmitting} className="w-full mt-4">
                      {form.formState.isSubmitting ? <IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> : <IconEditCircle className="mr-2 h-4 w-4" />}
                      Câp nhật
                    </Button>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="overflow-hidden md:overflow-visible">
          <PetCard petId={pet?.code || null} pet={formValues} />
        </div>
      </div>
    </div>
  )
}

// Exporters
export { PetRegistrationForm }
