'use client'

import Link from 'next/link'
import { Plus, Bot, Building2, Link as LinkIcon, Clock } from 'lucide-react'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">数据管理后台</h1>
          <p className="text-gray-600">管理机器人产品、厂家信息和数据源</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">--</h3>
            <p className="text-sm text-gray-600">产品总数</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">--</h3>
            <p className="text-sm text-gray-600">厂家总数</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <LinkIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">--</h3>
            <p className="text-sm text-gray-600">数据源总数</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">--</h3>
            <p className="text-sm text-gray-600">待处理任务</p>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/robots">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                  <Bot className="w-8 h-8 text-blue-600" />
                </div>
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">机器人管理</h3>
              <p className="text-gray-600 text-sm">添加、编辑和删除机器人产品信息</p>
            </div>
          </Link>

          <Link href="/admin/manufacturers">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                  <Building2 className="w-8 h-8 text-green-600" />
                </div>
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">厂家管理</h3>
              <p className="text-gray-600 text-sm">管理机器人制造商信息和社交媒体</p>
            </div>
          </Link>

          <Link href="/admin/scraping">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow p-8 cursor-pointer group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-4 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                  <LinkIcon className="w-8 h-8 text-purple-600" />
                </div>
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">数据源管理</h3>
              <p className="text-gray-600 text-sm">添加和管理数据抓取源，查看抓取状态</p>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">最近活动</h2>
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>暂无活动记录</p>
          </div>
        </div>
      </div>
    </div>
  )
}
