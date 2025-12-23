'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Robot, ComparisonField } from '@/types'
import { ArrowLeft, TrendingUp } from 'lucide-react'

export default function ComparePage() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',') || []
  
  const [robots, setRobots] = useState<Robot[]>([])
  const [comparisonFields, setComparisonFields] = useState<ComparisonField[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length > 0) {
      fetchRobotsForComparison()
    }
  }, [ids])

  const fetchRobotsForComparison = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/compare?ids=${ids.join(',')}`)
      const data = await response.json()
      setRobots(data.robots || [])
      generateComparisonFields(data.robots || [])
    } catch (error) {
      console.error('Failed to fetch robots for comparison:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateComparisonFields = (robotList: Robot[]) => {
    if (robotList.length === 0) return

    const fields: ComparisonField[] = []

    // Basic info
    fields.push({
      key: 'manufacturer',
      label: '制造商',
      type: 'string',
      values: robotList.map(r => ({
        robotId: r._id!,
        value: typeof r.manufacturer === 'string' ? r.manufacturer : r.manufacturer.name,
        displayValue: typeof r.manufacturer === 'string' ? r.manufacturer : r.manufacturer.name,
      }))
    })

    fields.push({
      key: 'model',
      label: '型号',
      type: 'string',
      values: robotList.map(r => ({
        robotId: r._id!,
        value: r.model,
        displayValue: r.model,
      }))
    })

    // Price
    const prices = robotList.map(r => r.price?.amount || 0)
    const minPrice = Math.min(...prices.filter(p => p > 0))
    fields.push({
      key: 'price',
      label: '价格',
      type: 'number',
      values: robotList.map((r, i) => ({
        robotId: r._id!,
        value: r.price?.amount || 0,
        displayValue: r.price ? `${r.price.currency === 'CNY' ? '¥' : '$'}${r.price.amount.toLocaleString()}` : 'N/A',
        isBest: r.price && r.price.amount === minPrice,
      })),
      bestIndex: prices.indexOf(minPrice)
    })

    // Release Date
    fields.push({
      key: 'releaseDate',
      label: '发布日期',
      type: 'date',
      values: robotList.map(r => ({
        robotId: r._id!,
        value: r.releaseDate,
        displayValue: r.releaseDate ? new Date(r.releaseDate).toLocaleDateString('zh-CN') : 'N/A',
      }))
    })

    // Specifications
    const specKeys = new Set<string>()
    robotList.forEach(r => {
      if (r.specifications) {
        Object.keys(r.specifications).forEach(key => specKeys.add(key))
      }
    })

    specKeys.forEach(key => {
      const values = robotList.map(r => r.specifications?.[key])
      const numericValues = values.map(v => typeof v === 'number' ? v : 0)
      const hasNumeric = numericValues.some(v => v > 0)
      const maxValue = hasNumeric ? Math.max(...numericValues) : undefined

      fields.push({
        key: `spec_${key}`,
        label: key.replace(/([A-Z])/g, ' $1').trim(),
        type: typeof values[0] === 'number' ? 'number' : 'string',
        values: robotList.map((r, i) => {
          const value = r.specifications?.[key]
          return {
            robotId: r._id!,
            value: value,
            displayValue: value !== null && value !== undefined ? String(value) : 'N/A',
            isBest: hasNumeric && typeof value === 'number' && value === maxValue,
          }
        }),
        bestIndex: maxValue !== undefined ? numericValues.indexOf(maxValue) : undefined
      })
    })

    setComparisonFields(fields)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
      </div>
    )
  }

  if (robots.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">无产品可对比</h1>
        <Link href="/" className="text-primary-600 hover:text-primary-700">
          返回首页
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href={`/robots/${robots[0].category}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回列表
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">产品对比</h1>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="p-6 text-left bg-gray-50 font-semibold text-gray-700 min-w-[200px]">
                    参数
                  </th>
                  {robots.map((robot) => (
                    <th key={robot._id} className="p-6 text-center min-w-[250px]">
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mb-4 rounded-lg overflow-hidden">
                          {robot.thumbnail || robot.images?.[0] ? (
                            <Image
                              src={robot.thumbnail || robot.images[0]}
                              alt={robot.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <span className="text-4xl">🤖</span>
                            </div>
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {robot.name}
                        </h3>
                        <p className="text-sm text-gray-500">{robot.model}</p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFields.map((field, index) => (
                  <tr 
                    key={field.key}
                    className={`border-b border-gray-100 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-6 font-medium text-gray-700 capitalize">
                      {field.label}
                    </td>
                    {field.values.map((value) => (
                      <td 
                        key={value.robotId} 
                        className={`p-6 text-center ${
                          value.isBest 
                            ? 'bg-green-50 font-bold text-green-700' 
                            : 'text-gray-900'
                        }`}
                      >
                        <div className="flex items-center justify-center">
                          {value.isBest && (
                            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                          )}
                          <span>{value.displayValue}</span>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start">
            <TrendingUp className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">提示</h3>
              <p className="text-blue-800 text-sm">
                绿色高亮的参数表示在该项对比中的最优值。价格以最低为优，其他数值参数以最高为优。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
