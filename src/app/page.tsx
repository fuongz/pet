'use client'

import { Button } from '@/components/ui'
import { CalendarIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { useCatBreed } from '@/hooks/use-cat-breed/use-cat-breed'
import { PetCard } from '@/features/home/components/pet-card/pet-card'
import { TZDate } from '@date-fns/tz'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { IconHeartFilled } from '@tabler/icons-react'

const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      fullName: 'Mây',
      ownerName: 'Phùng Thế Phương',
      gender: 'Female',
      hometown: 'Thủ Đức, Hồ Chí Minh',
      dateOfBirth: new TZDate(2023, 6, 9, 'Asia/Ho_Chi_Minh'),
      breed: 'British Shorthair',
      dateOfIssue: new TZDate(new Date(), 'Asia/Ho_Chi_Minh'),
      avatar: new File([], ''),
    },
  })

  const [formValues, setFormValues] = useState<z.infer<typeof formSchema>>(form.getValues())

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscription = form.watch((values: any) => {
      setFormValues(values)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  return (
    <div className="flex flex-col font-sans bg-violet-50 justify-center items-center h-dvh w-dvw">
      <div className="grid grid-cols-2 gap-6">
        <PetCard pet={formValues} />
        <div>
          <Alert className="mb-4" variant="destructive">
            <AlertTitle>
              <div className="flex gap-2 items-center">
                <span>🚧</span> <span>THÔNG BÁO</span>
              </div>
            </AlertTitle>
            <AlertDescription>Website đang trong quá trình phát triển, vui lòng nhập thông tin động vật nuôi để định danh.</AlertDescription>
          </Alert>
          <Card>
            <CardHeader>
              <CardTitle className="relative">Nhập thông tin động vật nuôi</CardTitle>
              <CardDescription>Vui lòng nhập thông tin động vật nuôi theo biểu mẫu dưới đây để định danh động vật nuôi.</CardDescription>
            </CardHeader>
            <CardContent>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
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
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 text-gray-500 text-sm text-center">
        <div className="flex items-center justify-center gap-1 mb-2">
          Made with <IconHeartFilled className="w-4 text-red-600" /> by{' '}
          <a href="https://phuongphung.com?ref=pet.phake.app" target="_blank" className="font-semibold underline">
            fuongz
          </a>
          . Checkout the source code on{' '}
          <a href="https://github.com/phake-studio/pet" className="font-semibold underline" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </div>
      </div>
    </div>
  )
}
