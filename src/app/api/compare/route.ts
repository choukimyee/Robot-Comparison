import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Robot from '@/models/Robot'

// GET /api/compare - Get robots for comparison
export async function GET(request: NextRequest) {
  try {
    await connectDB()

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
