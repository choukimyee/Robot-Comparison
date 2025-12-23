'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Robot, RobotCategory, CATEGORY_LABELS } from '@/types'
import { Plus, Edit, Trash2, Search } from 'lucide-react'

export default function AdminRobotsPage() {
  const [robots, setRobots] = useState<Robot[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  useEffect(() => {
    fetchRobots()
  }, [categoryFilter])

  const fetchRobots = async () => {
    try {
      setLoading(true)
      const url = categoryFilter === 'all' 
        ? '/api/robots' 
        : `/api/robots?category=${categoryFilter}`
      const response = await fetch(url)
      const data = await response.json()
      setRobots(data.robots || [])
    } catch (error) {
      console.error('Failed to fetch robots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个产品吗？')) return

    try {
      const response = await fetch(`/api/robots/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setRobots(robots.filter(r => r._id !== id))
        alert('删除成功')
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Error deleting robot:', error)
      alert('删除失败')
    }
  }

  const filteredRobots = robots.filter(robot => 
    robot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    robot.model.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">机器人管理</h1>
            <p className="text-gray-600">共 {filteredRobots.length} 个产品</p>
          </div>
          <Link
            href="/admin/robots/new"
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>添加产品</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索产品名称或型号..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">全部品类</option>
              {Object.values(RobotCategory).map(category => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Robots Table */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
          </div>
        ) : filteredRobots.length > 0 ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">产品名称</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">厂家</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">品类</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">型号</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">价格</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRobots.map((robot) => {
                  const manufacturer = typeof robot.manufacturer === 'string' 
                    ? { name: robot.manufacturer } 
                    : robot.manufacturer

                  return (
                    <tr key={robot._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{robot.name}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{manufacturer.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                          {CATEGORY_LABELS[robot.category]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{robot.model}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          robot.status === 'released' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {robot.status === 'released' ? '已发布' : '开发中'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {robot.price 
                          ? `${robot.price.currency === 'CNY' ? '¥' : '$'}${robot.price.amount.toLocaleString()}`
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/robots/edit/${robot._id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(robot._id!)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-16 text-center">
            <p className="text-xl text-gray-600 mb-4">暂无产品数据</p>
            <Link
              href="/admin/robots/new"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>添加第一个产品</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
