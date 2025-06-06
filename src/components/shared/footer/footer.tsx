import { IconHeartFilled } from '@tabler/icons-react'

function Footer() {
  return (
    <div className="fixed w-full bottom-4 rounded left-0 mx-auto flex px-6 backdrop-blur-sm justify-center items-center">
      <div className="text-balance text-xs text-gray-500 text-sm text-center bg-white/30 rounded-md px-4 py-2 w-full container mx-auto">
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-balance *:[a]:underline *:[a]:underline-offset-4">Dự án chỉ dùng cho mục đích giải trí và học tập.</div>
        <div className="flex-wrap items-center flex mt-1 justify-center gap-1 mb-2">
          Made with <IconHeartFilled className="w-4 text-red-600" /> by{' '}
          <a href="https://phuongphung.com?ref=pet.phake.app" target="_blank" className="font-semibold underline">
            fuongz.
          </a>
          Checkout the source code on{' '}
          <a href="https://github.com/fuongz/pet" className="font-semibold underline" target="_blank" rel="noopener noreferrer">
            Github
          </a>
        </div>
      </div>
    </div>
  )
}

export { Footer }
