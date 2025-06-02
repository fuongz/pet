import type { Metadata } from 'next'
import { Geist_Mono, Space_Grotesk } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

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
  return (
    <html lang="en">
      <head>
        <Script defer src="https://cloud.umami.is/script.js" data-website-id="ceec029b-9841-4bca-b370-3e69eb1b39a1" />
      </head>
      <body className={`${sans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  )
}
