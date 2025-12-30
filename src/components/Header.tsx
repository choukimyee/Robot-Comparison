'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Bot, Home, Database, LogIn, LogOut, User } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

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

            {status === 'loading' ? (
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">{session.user?.name}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>登出</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
