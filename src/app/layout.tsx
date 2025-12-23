import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '机器人竞品对比平台 - Robot Comparison Platform',
  description: '专业的机器人产品对比平台，涵盖四足机器狗、人形机器人等多种机器人品类',
  keywords: '机器人,四足机器人,人形机器人,机器狗,产品对比',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-900 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm">
              © 2025 机器人竞品对比平台. All rights reserved.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              数据来源于官方网站、新闻报道及社交媒体
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
