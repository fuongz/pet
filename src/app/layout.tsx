import type { Metadata } from 'next'
import { Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { AuthStoreProvider } from './auth-provider'

const sans = Space_Grotesk({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Định danh động vật nuôi',
  description: 'Định danh động vật nuôi',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || null
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {umamiWebsiteId && <Script defer src="https://cloud.umami.is/script.js" data-website-id={umamiWebsiteId} />}
      </head>
      <body className={`${sans.variable} ${geistMono.variable} antialiased`}>
        <AuthStoreProvider>{children}</AuthStoreProvider>
      </body>
    </html>
  )
}
