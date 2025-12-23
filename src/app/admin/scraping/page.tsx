'use client'

import { useState, useEffect } from 'react'
import { Robot, ScrapingJob } from '@/types'
import { Play, RefreshCw, Link as LinkIcon, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function ScrapingPage() {
  const [robots, setRobots] = useState<Robot[]>([])
  const [jobs, setJobs] = useState<ScrapingJob[]>([])
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedRobot, setSelectedRobot] = useState<string>('')
  const [newSource, setNewSource] = useState({
    url: '',
    type: 'official' as const,
    platform: 'website' as const
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [robotsRes, jobsRes] = await Promise.all([
        fetch('/api/robots'),
        fetch('/api/scrape?limit=20')
      ])
      
      const robotsData = await robotsRes.json()
      const jobsData = await jobsRes.json()
      
      setRobots(robotsData.robots || [])
      setJobs(jobsData.jobs || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDataSource = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedRobot || !newSource.url) {
      alert('请填写所有必填字段')
      return
    }

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          robotId: selectedRobot,
          ...newSource
        })
      })

      if (response.ok) {
        alert('数据源添加成功，并已开始抓取')
        setShowAddForm(false)
        setNewSource({ url: '', type: 'official', platform: 'website' })
        setSelectedRobot('')
        fetchData()
      } else {
        const data = await response.json()
        alert(`操作失败: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('操作失败')
    }
  }

  const handleManualScrape = async (url: string, robotId?: string) => {
    if (!confirm(`确定要手动抓取这个数据源吗？\n${url}`)) return

    try {
      setScraping(true)
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, robotId, type: 'manual' })
      })

      if (response.ok) {
        alert('抓取成功')
        fetchData()
      } else {
        const data = await response.json()
        alert(`抓取失败: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('抓取失败')
    } finally {
      setScraping(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-600" />
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700'
      case 'failed':
        return 'bg-red-100 text-red-700'
      case 'running':
        return 'bg-blue-100 text-blue-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">数据源管理</h1>
            <p className="text-gray-600">管理数据抓取源和查看抓取历史</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            <span>添加数据源</span>
          </button>
        </div>

        {/* Add Data Source Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">添加数据源</h2>

              <form onSubmit={handleAddDataSource} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    选择产品 *
                  </label>
                  <select
                    required
                    value={selectedRobot}
                    onChange={(e) => setSelectedRobot(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">请选择产品</option>
                    {robots.map(robot => (
                      <option key={robot._id} value={robot._id}>
                        {robot.name} ({robot.model})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    数据源URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={newSource.url}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    数据源类型
                  </label>
                  <select
                    value={newSource.type}
                    onChange={(e) => setNewSource({ ...newSource, type: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="official">官方网站</option>
                    <option value="news">新闻报道</option>
                    <option value="social">社交媒体</option>
                    <option value="review">评测</option>
                    <option value="manual">手动添加</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    平台
                  </label>
                  <select
                    value={newSource.platform}
                    onChange={(e) => setNewSource({ ...newSource, platform: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="website">网站</option>
                    <option value="twitter">Twitter</option>
                    <option value="weixin">微信</option>
                    <option value="youtube">YouTube</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setNewSource({ url: '', type: 'official', platform: 'website' })
                      setSelectedRobot('')
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
                  >
                    添加并抓取
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Active Data Sources */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">活跃数据源</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {robots.flatMap(robot => 
                  robot.dataSources
                    ?.filter(ds => ds.isActive)
                    .map(ds => ({
                      robot,
                      dataSource: ds
                    }))
                ).map((item, index) => (
                  <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.robot.name}
                        </h3>
                        <a
                          href={item.dataSource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm flex items-center mb-2"
                        >
                          <LinkIcon className="w-4 h-4 mr-1" />
                          {item.dataSource.url}
                        </a>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {item.dataSource.type}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {item.dataSource.platform}
                          </span>
                          {item.dataSource.lastScraped && (
                            <span>
                              最后抓取: {new Date(item.dataSource.lastScraped).toLocaleString('zh-CN')}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleManualScrape(item.dataSource.url, item.robot._id)}
                        disabled={scraping}
                        className="flex items-center space-x-2 px-4 py-2 text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <Play className="w-4 h-4" />
                        <span>立即抓取</span>
                      </button>
                    </div>
                  </div>
                ))}
                
                {robots.every(r => !r.dataSources?.some(ds => ds.isActive)) && (
                  <div className="p-16 text-center text-gray-500">
                    <LinkIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>暂无活跃数据源</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scraping History */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">抓取历史</h2>
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
              </div>
            ) : jobs.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">状态</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">数据源</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">开始时间</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">完成时间</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">错误信息</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(job.status)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">
                        {job.dataSourceId}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.startedAt ? new Date(job.startedAt).toLocaleString('zh-CN') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {job.completedAt ? new Date(job.completedAt).toLocaleString('zh-CN') : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-red-600 max-w-xs truncate">
                        {job.error || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-16 text-center text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>暂无抓取历史</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
