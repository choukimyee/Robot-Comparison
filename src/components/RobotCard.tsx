'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Robot } from '@/types'
import { Calendar, DollarSign, Zap } from 'lucide-react'

interface RobotCardProps {
  robot: Robot
  isSelected?: boolean
  onSelect?: (robot: Robot) => void
}

export default function RobotCard({ robot, isSelected, onSelect }: RobotCardProps) {
  const manufacturer = typeof robot.manufacturer === 'string' 
    ? { name: robot.manufacturer } 
    : robot.manufacturer

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      {onSelect && (
        <div className="absolute top-4 right-4 z-10">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(robot)}
            className="w-5 h-5 cursor-pointer accent-primary-600"
          />
        </div>
      )}
      
      <Link href={`/robots/detail/${robot._id}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {robot.thumbnail || robot.images?.[0] ? (
            <Image
              src={robot.thumbnail || robot.images[0]}
              alt={robot.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-6xl">🤖</span>
            </div>
          )}
          
          {robot.status && (
            <div className="absolute top-4 left-4">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                robot.status === 'released' 
                  ? 'bg-green-500 text-white' 
                  : robot.status === 'development'
                  ? 'bg-blue-500 text-white'
                  : robot.status === 'concept'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {robot.status === 'released' ? '已发布' :
                 robot.status === 'development' ? '开发中' :
                 robot.status === 'concept' ? '概念' : '已停产'}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/robots/detail/${robot._id}`}>
          <h3 className="text-xl font-bold text-gray-800 mb-1 hover:text-primary-600 transition-colors line-clamp-1">
            {robot.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-500 mb-3">
          {manufacturer.name} · {robot.model}
        </p>

        {robot.keyFeatures && robot.keyFeatures.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {robot.keyFeatures.slice(0, 2).map((feature, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-primary-50 text-primary-700 rounded-md text-xs"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm">
          {robot.price && (
            <div className="flex items-center text-gray-700">
              <DollarSign className="w-4 h-4 mr-2 text-green-600" />
              <span className="font-semibold">
                {robot.price.currency === 'CNY' ? '¥' : '$'}
                {robot.price.amount.toLocaleString()}
              </span>
              {robot.price.note && (
                <span className="text-xs text-gray-500 ml-2">
                  {robot.price.note}
                </span>
              )}
            </div>
          )}
          
          {robot.releaseDate && (
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                {new Date(robot.releaseDate).toLocaleDateString('zh-CN')}
              </span>
            </div>
          )}
        </div>

        {onSelect && (
          <button
            onClick={() => onSelect(robot)}
            className={`mt-4 w-full py-2 rounded-lg font-medium transition-colors ${
              isSelected
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isSelected ? '已选择' : '选择对比'}
          </button>
        )}
      </div>
    </div>
  )
}
