'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Robot, CATEGORY_LABELS } from '@/types'
import { Calendar, DollarSign, ExternalLink, Video, ArrowLeft } from 'lucide-react'

export default function RobotDetailPage() {
  const params = useParams()
  const [robot, setRobot] = useState<Robot | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    fetchRobotDetail()
  }, [params.id])

  const fetchRobotDetail = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/robots/${params.id}`)
      const data = await response.json()
      setRobot(data.robot)
    } catch (error) {
      console.error('Failed to fetch robot detail:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
      </div>
    )
  }

  if (!robot) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800">产品未找到</h1>
      </div>
    )
  }

  const manufacturer = typeof robot.manufacturer === 'string' 
    ? { name: robot.manufacturer, website: '' } 
    : robot.manufacturer

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href={`/robots/${robot.category}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
              <div className="relative aspect-[4/3]">
                {robot.images && robot.images.length > 0 ? (
                  <Image
                    src={robot.images[selectedImage]}
                    alt={robot.name}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-8xl">🤖</span>
                  </div>
                )}
              </div>
            </div>
            
            {robot.images && robot.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {robot.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-4 ring-primary-600' : ''
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${robot.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">
                  {CATEGORY_LABELS[robot.category]}
                </span>
                
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {robot.name}
                </h1>
                
                <p className="text-xl text-gray-600 mb-4">
                  {manufacturer.name} · {robot.model}
                </p>

                {robot.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {robot.description}
                  </p>
                )}
              </div>

              {/* Key Info */}
              <div className="space-y-4 mb-6">
                {robot.price && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-5 h-5 mr-2" />
                      <span>价格</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-900">
                        {robot.price.currency === 'CNY' ? '¥' : '$'}
                        {robot.price.amount.toLocaleString()}
                      </span>
                      {robot.price.note && (
                        <p className="text-sm text-gray-500">{robot.price.note}</p>
                      )}
                    </div>
                  </div>
                )}

                {robot.releaseDate && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>发布日期</span>
                    </div>
                    <span className="text-gray-900 font-medium">
                      {new Date(robot.releaseDate).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">状态</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    robot.status === 'released' 
                      ? 'bg-green-100 text-green-700' 
                      : robot.status === 'development'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {robot.status === 'released' ? '已发布' :
                     robot.status === 'development' ? '开发中' : '概念'}
                  </span>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-3">
                {robot.officialLink && (
                  <a
                    href={robot.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    官方网站
                  </a>
                )}
                
                {robot.videoLinks && robot.videoLinks.length > 0 && (
                  <a
                    href={robot.videoLinks[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    观看视频
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        {robot.keyFeatures && robot.keyFeatures.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">核心特点</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {robot.keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Specifications */}
        {robot.specifications && Object.keys(robot.specifications).length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">技术规格</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {Object.entries(robot.specifications).map(([key, value]) => (
                value !== null && value !== undefined && (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
