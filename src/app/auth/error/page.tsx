'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: '服务器配置错误',
    AccessDenied: '访问被拒绝',
    Verification: '验证失败',
    Default: '发生未知错误',
    SessionRequired: '需要登录才能访问此页面',
  }

  const errorMessage = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">认证错误</h1>
          <p className="text-gray-600 mb-6">{errorMessage}</p>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              重新登录
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
