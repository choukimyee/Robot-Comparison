import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Robot from '@/models/Robot'
import Manufacturer from '@/models/Manufacturer'
import { mockRobots } from '@/lib/mock-data'

// GET /api/robots - List robots with filters
export async function GET(request: NextRequest) {
  // Demo mode - return mock data
  if (process.env.DEMO_MODE === 'true') {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    
    let filtered = mockRobots
    if (category) {
      filtered = mockRobots.filter(r => r.category === category)
    }
    
    return NextResponse.json({
      success: true,
      robots: filtered,
      count: filtered.length
    })
  }

  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const manufacturerId = searchParams.get('manufacturer')
    const search = searchParams.get('search')
    
    let query: any = {}
    
    if (category) {
      query.category = category
    }
    
    if (status) {
      query.status = status
    }
    
    if (manufacturerId) {
      query.manufacturer = manufacturerId
    }
    
    if (search) {
      query.$text = { $search: search }
    }

    const robots = await Robot.find(query)
      .populate('manufacturer')
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({
      success: true,
      robots,
      count: robots.length
    })
  } catch (error) {
    console.error('Error fetching robots:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch robots' },
      { status: 500 }
    )
  }
}

// POST /api/robots - Create a new robot
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.manufacturer || !body.category || !body.model) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const robot = await Robot.create(body)
    const populatedRobot = await Robot.findById(robot._id).populate('manufacturer')

    return NextResponse.json({
      success: true,
      robot: populatedRobot
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating robot:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create robot' },
      { status: 500 }
    )
  }
}
