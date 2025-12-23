/**
 * Seed database with sample data
 * Run: npx tsx src/scripts/seed-data.ts
 */

import connectDB from '../lib/mongodb'
import Manufacturer from '../models/Manufacturer'
import Robot from '../models/Robot'
import { RobotCategory } from '../types'

async function seedData() {
  try {
    console.log('🌱 Starting database seeding...')
    await connectDB()

    // Clear existing data
    await Manufacturer.deleteMany({})
    await Robot.deleteMany({})
    console.log('🗑️  Cleared existing data')

    // Create Manufacturers
    const manufacturers = await Manufacturer.insertMany([
      {
        name: '特斯拉',
        nameEn: 'Tesla',
        website: 'https://www.tesla.com',
        country: 'USA',
        description: '电动汽车和清洁能源公司，正在开发 Optimus 人形机器人',
        socialMedia: {
          twitter: 'https://twitter.com/tesla',
          youtube: 'https://www.youtube.com/@tesla'
        }
      },
      {
        name: 'Figure AI',
        nameEn: 'Figure',
        website: 'https://www.figure.ai',
        country: 'USA',
        description: '专注于通用人形机器人的人工智能机器人公司',
        socialMedia: {
          twitter: 'https://twitter.com/figure_ai'
        }
      },
      {
        name: '宇树科技',
        nameEn: 'Unitree',
        website: 'https://www.unitree.com',
        country: 'China',
        description: '全球领先的四足机器人和人形机器人制造商',
        socialMedia: {
          twitter: 'https://twitter.com/UnitreeRobotics',
          youtube: 'https://www.youtube.com/@UnitreeRobotics'
        }
      },
      {
        name: 'Sunday Robotics',
        nameEn: 'Sunday',
        website: 'https://sundayrobotics.com',
        country: 'USA',
        description: '新兴机器人公司',
      },
      {
        name: '波士顿动力',
        nameEn: 'Boston Dynamics',
        website: 'https://www.bostondynamics.com',
        country: 'USA',
        description: '全球最著名的机器人公司之一，开发 Spot 和 Atlas',
        socialMedia: {
          twitter: 'https://twitter.com/BostonDynamics',
          youtube: 'https://www.youtube.com/@BostonDynamics'
        }
      }
    ])

    console.log(`✅ Created ${manufacturers.length} manufacturers`)

    // Create Robots
    const robots = await Robot.insertMany([
      // Tesla Optimus
      {
        name: 'Tesla Optimus Gen 2',
        nameEn: 'Optimus Gen 2',
        manufacturer: manufacturers.find(m => m.nameEn === 'Tesla')!._id,
        category: RobotCategory.HUMANOID,
        model: 'Gen 2',
        description: '特斯拉第二代人形机器人，具备更灵活的手指操作和改进的步态',
        keyFeatures: [
          '全身30个自由度',
          '改进的手部灵巧性',
          '基于视觉的导航',
          '特斯拉AI技术'
        ],
        specifications: {
          height: 173,
          weight: 73,
          dof: 30,
          maxSpeed: 5,
        },
        status: 'development',
        releaseDate: new Date('2024-01-01'),
        officialLink: 'https://www.tesla.com/optimus',
        videoLinks: ['https://www.youtube.com/watch?v=cpraXaw7dyc'],
        images: [
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        ],
        dataSources: [
          {
            url: 'https://www.tesla.com/optimus',
            type: 'official',
            platform: 'website',
            isActive: true
          }
        ]
      },
      // Figure 01
      {
        name: 'Figure 01',
        nameEn: 'Figure 01',
        manufacturer: manufacturers.find(m => m.nameEn === 'Figure')!._id,
        category: RobotCategory.HUMANOID,
        model: 'Figure 01',
        description: 'Figure AI 首款通用人形机器人，专注于商业应用',
        keyFeatures: [
          '全电动设计',
          '自主导航',
          '物体操作能力',
          '人机协作'
        ],
        specifications: {
          height: 168,
          weight: 60,
          dof: 28,
          payload: 20,
        },
        status: 'development',
        releaseDate: new Date('2023-06-01'),
        officialLink: 'https://www.figure.ai',
        images: [
          'https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800',
        ],
        dataSources: [
          {
            url: 'https://www.figure.ai',
            type: 'official',
            platform: 'website',
            isActive: true
          }
        ]
      },
      // Unitree H1
      {
        name: 'Unitree H1',
        nameEn: 'H1',
        manufacturer: manufacturers.find(m => m.nameEn === 'Unitree')!._id,
        category: RobotCategory.HUMANOID,
        model: 'H1',
        description: '宇树科技首款全尺寸通用人形机器人',
        keyFeatures: [
          '高速运动能力',
          '3D LiDAR + 深度相机',
          '灵活关节设计',
          '开源开发平台'
        ],
        specifications: {
          height: 180,
          weight: 47,
          dof: 25,
          maxSpeed: 3.3,
        },
        price: {
          amount: 90000,
          currency: 'USD',
          note: '起售价'
        },
        status: 'released',
        releaseDate: new Date('2023-08-01'),
        officialLink: 'https://www.unitree.com/h1',
        images: [
          'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
        ],
        dataSources: [
          {
            url: 'https://www.unitree.com/h1',
            type: 'official',
            platform: 'website',
            isActive: true
          }
        ]
      },
      // Unitree Go2
      {
        name: 'Unitree Go2',
        nameEn: 'Go2',
        manufacturer: manufacturers.find(m => m.nameEn === 'Unitree')!._id,
        category: RobotCategory.QUADRUPED,
        model: 'Go2',
        description: '宇树第二代四足机器人，性能全面提升',
        keyFeatures: [
          '4D LiDAR 超广角感知',
          'AI智能避障',
          '无线充电',
          '超长续航'
        ],
        specifications: {
          weight: 15,
          hipHeight: 40,
          maxSpeed: 5,
          batteryLife: 2,
          payload: 5,
          waterproofRating: 'IP54'
        },
        price: {
          amount: 1600,
          currency: 'USD',
          note: '基础版'
        },
        status: 'released',
        releaseDate: new Date('2023-05-01'),
        officialLink: 'https://www.unitree.com/go2',
        images: [
          'https://images.unsplash.com/photo-1535850452391-e4118dc79fe3?w=800',
        ],
        dataSources: [
          {
            url: 'https://www.unitree.com/go2',
            type: 'official',
            platform: 'website',
            isActive: true
          }
        ]
      },
      // Boston Dynamics Spot
      {
        name: 'Boston Dynamics Spot',
        nameEn: 'Spot',
        manufacturer: manufacturers.find(m => m.nameEn === 'Boston Dynamics')!._id,
        category: RobotCategory.QUADRUPED,
        model: 'Spot',
        description: '波士顿动力商用四足机器人，广泛应用于工业巡检',
        keyFeatures: [
          '360度避障',
          '模块化负载接口',
          '远程操作',
          '自主导航'
        ],
        specifications: {
          weight: 32.7,
          hipHeight: 84,
          maxSpeed: 1.6,
          batteryLife: 1.5,
          payload: 14,
          waterproofRating: 'IP54'
        },
        price: {
          amount: 75000,
          currency: 'USD',
          note: '基础套餐'
        },
        status: 'released',
        releaseDate: new Date('2020-06-01'),
        officialLink: 'https://www.bostondynamics.com/spot',
        images: [
          'https://images.unsplash.com/photo-1563207153-f403bf289096?w=800',
        ],
        dataSources: [
          {
            url: 'https://www.bostondynamics.com/spot',
            type: 'official',
            platform: 'website',
            isActive: true
          }
        ]
      }
    ])

    console.log(`✅ Created ${robots.length} robots`)
    console.log('\n🎉 Database seeding completed successfully!')
    
    // Display summary
    console.log('\n📊 Summary:')
    console.log(`   Manufacturers: ${manufacturers.length}`)
    console.log(`   Robots: ${robots.length}`)
    console.log(`     - Humanoid: ${robots.filter(r => r.category === RobotCategory.HUMANOID).length}`)
    console.log(`     - Quadruped: ${robots.filter(r => r.category === RobotCategory.QUADRUPED).length}`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedData()
