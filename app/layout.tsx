import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { StoreProvider } from '@/lib/store'
import { Toaster } from 'sonner'
import { AutoQuotePopup } from '@/components/auto-quote-popup'
import './globals.css'

const inter = Inter({
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'AUTO STAR - Showroom Xe Hơi Chính Hãng',
  description: 'Showroom xe hơi chính hãng với các dòng xe Toyota, Honda, Mazda, Hyundai, Kia, Ford, VinFast. Giá tốt nhất, nhiều khuyến mãi hấp dẫn, hỗ trợ trả góp.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    apple: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased`}>
        <StoreProvider>
          {children}
          <AutoQuotePopup />
        </StoreProvider>
        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
