import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Manufacturer from '@/models/Manufacturer'
import { mockManufacturers } from '@/lib/mock-data'

// GET /api/manufacturers - List all manufacturers
export async function GET(request: NextRequest) {
  // Demo mode - return mock data
  if (process.env.DEMO_MODE === 'true') {
    return NextResponse.json({
      success: true,
      manufacturers: mockManufacturers,
      count: mockManufacturers.length
    })
  }

  try {
    await connectDB()

    const manufacturers = await Manufacturer.find()
      .sort({ name: 1 })
      .lean()

    return NextResponse.json({
      success: true,
      manufacturers,
      count: manufacturers.length
    })
  } catch (error) {
    console.error('Error fetching manufacturers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manufacturers' },
      { status: 500 }
    )
  }
}

// POST /api/manufacturers - Create a new manufacturer
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    
    if (!body.name || !body.nameEn || !body.website || !body.country) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const manufacturer = await Manufacturer.create(body)

    return NextResponse.json({
      success: true,
      manufacturer
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating manufacturer:', error)
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer already exists' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create manufacturer' },
      { status: 500 }
    )
  }
}
