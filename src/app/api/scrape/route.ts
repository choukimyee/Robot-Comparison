import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Robot from '@/models/Robot'
import ScrapingJob from '@/models/ScrapingJob'
import { scrapeUrl } from '@/lib/scraper'

// POST /api/scrape - Manually trigger scraping for a data source
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()
    const { url, robotId, type = 'manual' } = body

    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL is required' },
        { status: 400 }
      )
    }

    // Create scraping job
    const job = await ScrapingJob.create({
      dataSourceId: url,
      status: 'running',
      startedAt: new Date()
    })

    try {
      // Perform scraping
      const scrapedData = await scrapeUrl(url)

      // Update job status
      await ScrapingJob.findByIdAndUpdate(job._id, {
        status: 'completed',
        completedAt: new Date(),
        extractedData: scrapedData
      })

      // If robotId provided, update the robot's data source
      if (robotId) {
        await Robot.findByIdAndUpdate(robotId, {
          $push: {
            dataSources: {
              url,
              type,
              platform: 'website',
              lastScraped: new Date(),
              scrapedData,
              isActive: true
            }
          }
        })
      }

      return NextResponse.json({
        success: true,
        job: job._id,
        data: scrapedData
      })
    } catch (scrapeError: any) {
      // Update job with error
      await ScrapingJob.findByIdAndUpdate(job._id, {
        status: 'failed',
        completedAt: new Date(),
        error: scrapeError.message
      })

      throw scrapeError
    }
  } catch (error: any) {
    console.error('Error in scraping:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to scrape URL' },
      { status: 500 }
    )
  }
}

// GET /api/scrape - Get scraping jobs
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query: any = {}
    if (status) {
      query.status = status
    }

    const jobs = await ScrapingJob.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()

    return NextResponse.json({
      success: true,
      jobs,
      count: jobs.length
    })
  } catch (error) {
    console.error('Error fetching scraping jobs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}
