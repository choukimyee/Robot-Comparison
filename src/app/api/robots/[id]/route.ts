import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Robot from '@/models/Robot'
import { mockRobots } from '@/lib/mock-data'

// GET /api/robots/[id] - Get single robot
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Demo mode - return mock data
  if (process.env.DEMO_MODE === 'true') {
    const robot = mockRobots.find(r => r._id === params.id)
    
    if (!robot) {
      return NextResponse.json(
        { success: false, error: 'Robot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      robot
    })
  }

  try {
    await connectDB()

    const robot = await Robot.findById(params.id).populate('manufacturer').lean()

    if (!robot) {
      return NextResponse.json(
        { success: false, error: 'Robot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      robot
    })
  } catch (error) {
    console.error('Error fetching robot:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch robot' },
      { status: 500 }
    )
  }
}

// PUT /api/robots/[id] - Update robot
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await request.json()
    
    const robot = await Robot.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).populate('manufacturer')

    if (!robot) {
      return NextResponse.json(
        { success: false, error: 'Robot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      robot
    })
  } catch (error) {
    console.error('Error updating robot:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update robot' },
      { status: 500 }
    )
  }
}

// DELETE /api/robots/[id] - Delete robot
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const robot = await Robot.findByIdAndDelete(params.id)

    if (!robot) {
      return NextResponse.json(
        { success: false, error: 'Robot not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Robot deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting robot:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete robot' },
      { status: 500 }
    )
  }
}
