import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Manufacturer from '@/models/Manufacturer'

// GET /api/manufacturers/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const manufacturer = await Manufacturer.findById(params.id).lean()

    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      manufacturer
    })
  } catch (error) {
    console.error('Error fetching manufacturer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manufacturer' },
      { status: 500 }
    )
  }
}

// PUT /api/manufacturers/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const body = await request.json()
    
    const manufacturer = await Manufacturer.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    )

    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      manufacturer
    })
  } catch (error) {
    console.error('Error updating manufacturer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update manufacturer' },
      { status: 500 }
    )
  }
}

// DELETE /api/manufacturers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const manufacturer = await Manufacturer.findByIdAndDelete(params.id)

    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Manufacturer deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting manufacturer:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete manufacturer' },
      { status: 500 }
    )
  }
}
