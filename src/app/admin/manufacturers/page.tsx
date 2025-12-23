'use client'

import { useState, useEffect } from 'react'
import { Manufacturer } from '@/types'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'

export default function ManufacturersPage() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    logo: '',
    website: '',
    country: '',
    description: '',
    socialMedia: {
      twitter: '',
      weixin: '',
      linkedin: '',
      youtube: ''
    }
  })

  useEffect(() => {
    fetchManufacturers()
  }, [])

  const fetchManufacturers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/manufacturers')
      const data = await response.json()
      setManufacturers(data.manufacturers || [])
    } catch (error) {
      console.error('Failed to fetch manufacturers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingId 
        ? `/api/manufacturers/${editingId}`
        : '/api/manufacturers'
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingId ? '更新成功' : '创建成功')
        setShowForm(false)
        setEditingId(null)
        resetForm()
        fetchManufacturers()
      } else {
        const data = await response.json()
        alert(`操作失败: ${data.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('操作失败')
    }
  }

  const handleEdit = (manufacturer: Manufacturer) => {
    setFormData({
      name: manufacturer.name,
      nameEn: manufacturer.nameEn,
      logo: manufacturer.logo || '',
      website: manufacturer.website,
      country: manufacturer.country,
      description: manufacturer.description || '',
      socialMedia: manufacturer.socialMedia || {
        twitter: '',
        weixin: '',
        linkedin: '',
        youtube: ''
      }
    })
    setEditingId(manufacturer._id!)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个厂家吗？')) return

    try {
      const response = await fetch(`/api/manufacturers/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('删除成功')
        fetchManufacturers()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Error deleting manufacturer:', error)
      alert('删除失败')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      logo: '',
      website: '',
      country: '',
      description: '',
      socialMedia: {
        twitter: '',
        weixin: '',
        linkedin: '',
        youtube: ''
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">厂家管理</h1>
            <p className="text-gray-600">共 {manufacturers.length} 个厂家</p>
          </div>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingId(null)
              resetForm()
            }}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>添加厂家</span>
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? '编辑厂家' : '添加厂家'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      中文名称 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      英文名称 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      官网 *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="https://"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      国家 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    简介
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">社交媒体</h3>
                  
                  <input
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, twitter: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Twitter URL"
                  />
                  
                  <input
                    type="text"
                    value={formData.socialMedia.weixin}
                    onChange={(e) => setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, weixin: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="微信公众号"
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                      resetForm()
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Manufacturers Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturers.map((manufacturer) => (
              <div key={manufacturer._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {manufacturer.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{manufacturer.nameEn}</p>
                    <p className="text-sm text-gray-600">🌍 {manufacturer.country}</p>
                  </div>
                </div>

                {manufacturer.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {manufacturer.description}
                  </p>
                )}

                <div className="flex items-center space-x-2 mb-4">
                  <a
                    href={manufacturer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    官网
                  </a>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-4 border-t">
                  <button
                    onClick={() => handleEdit(manufacturer)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(manufacturer._id!)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
