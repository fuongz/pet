import { IconHeartFilled } from '@tabler/icons-react'

function Footer() {
  return (
    <div className="border-t text-balance text-xs border-zinc-200 text-gray-500 text-sm text-center container mx-auto p-4">
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-balance *:[a]:underline *:[a]:underline-offset-4">Dự án chỉ dùng cho mục đích giải trí và học tập.</div>
      <div className="flex-wrap items-center flex mt-1 justify-center gap-1 mb-2">
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
  )
}

export { Footer }
