import Link from 'next/link'
import { RobotCategory, CATEGORY_LABELS } from '@/types'
import { Bot, Dog, User, Vacuum, Leaf, Droplets } from 'lucide-react'

const categoryIcons = {
  [RobotCategory.QUADRUPED]: Dog,
  [RobotCategory.HUMANOID]: User,
  [RobotCategory.VACUUM]: Vacuum,
  [RobotCategory.LAWN_MOWER]: Leaf,
  [RobotCategory.POOL_CLEANER]: Droplets,
}

const categoryDescriptions = {
  [RobotCategory.QUADRUPED]: '灵活敏捷的四足机器人，适用于巡检、救援等场景',
  [RobotCategory.HUMANOID]: '仿人形态机器人，可执行复杂的人类任务',
  [RobotCategory.VACUUM]: '智能清洁机器人，自动规划路径清洁地面',
  [RobotCategory.LAWN_MOWER]: '自动割草机器人，维护草坪更省心',
  [RobotCategory.POOL_CLEANER]: '泳池清洁机器人，保持泳池水质清洁',
}

const categoryGradients = {
  [RobotCategory.QUADRUPED]: 'from-blue-500 to-cyan-500',
  [RobotCategory.HUMANOID]: 'from-purple-500 to-pink-500',
  [RobotCategory.VACUUM]: 'from-green-500 to-emerald-500',
  [RobotCategory.LAWN_MOWER]: 'from-lime-500 to-green-600',
  [RobotCategory.POOL_CLEANER]: 'from-sky-500 to-blue-600',
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            机器人竞品对比平台
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            全面对比主流机器人产品，了解最新参数、价格和技术特点
          </p>
          <div className="mt-8 flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>每日自动更新</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div>涵盖多个品类</div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div>专业参数对比</div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
            选择机器人品类
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(RobotCategory).map((category) => {
              const Icon = categoryIcons[category]
              const gradient = categoryGradients[category]
              
              return (
                <Link
                  key={category}
                  href={`/robots/${category}`}
                  className="group"
                >
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                    <div className={`bg-gradient-to-br ${gradient} p-8 relative`}>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
                      <Icon className="w-16 h-16 text-white mb-4 relative z-10" />
                      <h3 className="text-2xl font-bold text-white relative z-10">
                        {CATEGORY_LABELS[category]}
                      </h3>
                    </div>
                    
                    <div className="p-6">
                      <p className="text-gray-600 mb-4">
                        {categoryDescriptions[category]}
                      </p>
                      <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                        <span>查看产品</span>
                        <svg 
                          className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Manufacturers */}
      <section className="container mx-auto px-4 py-16 bg-white rounded-3xl shadow-xl my-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">
          重点关注厂家
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            { name: 'Tesla', nameZh: '特斯拉', logo: '🚗' },
            { name: 'Figure AI', nameZh: 'Figure AI', logo: '🤖' },
            { name: 'Unitree', nameZh: '宇树科技', logo: '🐕' },
            { name: 'Sunday Robotics', nameZh: 'Sunday', logo: '☀️' },
          ].map((manufacturer) => (
            <div 
              key={manufacturer.name}
              className="flex flex-col items-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-5xl mb-3">{manufacturer.logo}</div>
              <h3 className="font-semibold text-gray-800">{manufacturer.name}</h3>
              <p className="text-sm text-gray-500">{manufacturer.nameZh}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
