'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Home, Database } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-800">
              机器人竞品对比平台
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/"
              className={`flex items-center space-x-1 hover:text-primary-600 transition-colors ${
                pathname === '/' ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>首页</span>
            </Link>
            
            <Link 
              href="/admin"
              className={`flex items-center space-x-1 hover:text-primary-600 transition-colors ${
                pathname.startsWith('/admin') ? 'text-primary-600' : 'text-gray-600'
              }`}
            >
              <Database className="w-5 h-5" />
              <span>数据管理</span>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}
