import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Robot from '@/models/Robot'
import { mockRobots } from '@/lib/mock-data'

// GET /api/compare - Get robots for comparison
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const idsParam = searchParams.get('ids')
  
  if (!idsParam) {
    return NextResponse.json(
      { success: false, error: 'Missing ids parameter' },
      { status: 400 }
    )
  }

  const ids = idsParam.split(',').filter(id => id.trim())
  
  if (ids.length === 0) {
    return NextResponse.json(
      { success: false, error: 'No valid ids provided' },
      { status: 400 }
    )
  }

  // Demo mode - return mock data
  if (process.env.DEMO_MODE === 'true') {
    const robots = mockRobots.filter(r => ids.includes(r._id!))

    return NextResponse.json({
      success: true,
      robots,
      count: robots.length
    })
  }

  try {
    await connectDB()

    const robots = await Robot.find({ _id: { $in: ids } })
      .populate('manufacturer')
      .lean()

    return NextResponse.json({
      success: true,
      robots,
      count: robots.length
    })
  } catch (error) {
    console.error('Error fetching robots for comparison:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch robots' },
      { status: 500 }
    )
  }
}
