import './globals.css'
import { Geist, Geist_Mono, Outfit } from 'next/font/google'
import type { Metadata } from 'next'

const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' })
const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: '{{name}} – An App made with Nolly\'s Template',
  description: 'A Next.js + TypeScript + Tailwind CSS boilerplate template for your next web app, made with love by Nolly',
  icons: { icon: '/favicon.svg', apple: '/favicon.svg' },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={'en'} suppressHydrationWarning>
      <body className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}