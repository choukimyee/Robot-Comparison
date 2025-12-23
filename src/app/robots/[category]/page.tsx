'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RobotCategory, CATEGORY_LABELS, Robot } from '@/types'
import RobotCard from '@/components/RobotCard'
import MasonryGrid from '@/components/MasonryGrid'
import { Filter, ArrowUpDown } from 'lucide-react'

export default function RobotListPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as RobotCategory
  
  const [robots, setRobots] = useState<Robot[]>([])
  const [filteredRobots, setFilteredRobots] = useState<Robot[]>([])
  const [selectedRobots, setSelectedRobots] = useState<Robot[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('name')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchRobots()
  }, [category])

  useEffect(() => {
    filterAndSortRobots()
  }, [robots, sortBy, statusFilter])

  const fetchRobots = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/robots?category=${category}`)
      const data = await response.json()
      setRobots(data.robots || [])
    } catch (error) {
      console.error('Failed to fetch robots:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortRobots = () => {
    let filtered = [...robots]
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter)
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'zh-CN')
      } else if (sortBy === 'price') {
        const priceA = a.price?.amount || 0
        const priceB = b.price?.amount || 0
        return priceB - priceA
      } else if (sortBy === 'date') {
        const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0
        const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0
        return dateB - dateA
      }
      return 0
    })
    
    setFilteredRobots(filtered)
  }

  const handleSelectRobot = (robot: Robot) => {
    const isSelected = selectedRobots.some(r => r._id === robot._id)
    if (isSelected) {
      setSelectedRobots(selectedRobots.filter(r => r._id !== robot._id))
    } else {
      if (selectedRobots.length < 4) {
        setSelectedRobots([...selectedRobots, robot])
      } else {
        alert('最多只能选择4个产品进行对比')
      }
    }
  }

  const handleCompare = () => {
    if (selectedRobots.length < 2) {
      alert('请至少选择2个产品进行对比')
      return
    }
    const ids = selectedRobots.map(r => r._id).join(',')
    router.push(`/compare?ids=${ids}`)
  }

  if (!Object.values(RobotCategory).includes(category)) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800">无效的品类</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {CATEGORY_LABELS[category]}
          </h1>
          <p className="text-gray-600">
            共 {filteredRobots.length} 个产品
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">状态：</span>
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">全部</option>
                <option value="released">已发布</option>
                <option value="development">开发中</option>
                <option value="concept">概念</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">排序：</span>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="name">名称</option>
                <option value="price">价格</option>
                <option value="date">发布日期</option>
              </select>
            </div>
          </div>
        </div>

        {/* Compare Button (Fixed) */}
        {selectedRobots.length > 0 && (
          <div className="fixed bottom-8 right-8 z-50">
            <button
              onClick={handleCompare}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full shadow-2xl font-semibold flex items-center space-x-2 transition-all transform hover:scale-105"
            >
              <span>对比选中产品 ({selectedRobots.length})</span>
            </button>
          </div>
        )}

        {/* Robot Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : filteredRobots.length > 0 ? (
          <MasonryGrid>
            {filteredRobots.map((robot) => (
              <div key={robot._id} className="mb-6">
                <RobotCard
                  robot={robot}
                  isSelected={selectedRobots.some(r => r._id === robot._id)}
                  onSelect={handleSelectRobot}
                />
              </div>
            ))}
          </MasonryGrid>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-xl text-gray-600">暂无产品数据</p>
            <p className="text-sm text-gray-500 mt-2">请联系管理员添加产品信息</p>
          </div>
        )}
      </div>
    </div>
  )
}
