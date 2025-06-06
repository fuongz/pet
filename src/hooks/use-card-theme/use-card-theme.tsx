function useCardTheme() {
  const CARD_THEMES: Array<{
    id: number
    backgroundUrl: string | null
    backgroundColor: string | null
    childComponents: React.ReactNode
    className: string
  }> = [
    {
      id: 1,
      backgroundUrl: '/images/card-bg-01.jpg',
      backgroundColor: null,
      childComponents: (
        <>
          <div className="absolute z-2 top-0 right-0 w-32 h-32 bg-rose-300/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute z-2 bottom-0 left-0 w-24 h-24 bg-emerald-400/10 rounded-full translate-y-12 -translate-x-12"></div>
        </>
      ),
      className: 'object-cover',
    },
    {
      id: 2,
      backgroundUrl: '/images/card-bg.jpg',
      backgroundColor: null,
      childComponents: <></>,
      className: 'object-fill',
    },
    {
      id: 3,
      backgroundUrl: null,
      backgroundColor: 'bg-gradient-to-br from-zinc-100 to-blue-100',
      childComponents: <></>,
      className: 'object-cover',
    },
    {
      id: 4,
      backgroundUrl: null,
      backgroundColor: 'bg-gradient-to-br from-white to-zinc-100',
      childComponents: <></>,
      className: 'object-cover',
    },
  ]

  return {
    themes: CARD_THEMES,
  }
}

export { useCardTheme }
