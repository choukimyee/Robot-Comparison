/**
 * Scheduled scraping script
 * Runs daily to automatically scrape and update robot data
 * Run: npm run scrape:scheduled
 */

import cron from 'node-cron'
import connectDB from '../lib/mongodb'
import Robot from '../models/Robot'
import ScrapingJob from '../models/ScrapingJob'
import { scrapeUrl, scrapeManufacturerSite } from '../lib/scraper'

const SCRAPE_INTERVAL = process.env.SCRAPE_INTERVAL_HOURS || '24'

async function runScrapingJob() {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`🕐 Scheduled scraping job started at ${new Date().toISOString()}`)
  console.log('='.repeat(60))
  
  try {
    await connectDB()

    // Get all robots with active data sources
    const robots = await Robot.find({
      'dataSources.isActive': true
    }).populate('manufacturer')

    console.log(`📊 Found ${robots.length} robots with active data sources\n`)

    let successCount = 0
    let errorCount = 0

    for (const robot of robots) {
      console.log(`🤖 Processing: ${robot.name}`)
      
      const activeSources = robot.dataSources.filter(ds => {
        // Only scrape if:
        // 1. Source is active
        // 2. Last scraped more than configured hours ago OR never scraped
        const intervalHours = ds.scrapingConfig?.interval || parseInt(SCRAPE_INTERVAL)
        const shouldScrape = !ds.lastScraped || 
          (Date.now() - new Date(ds.lastScraped).getTime()) > intervalHours * 60 * 60 * 1000
        
        return ds.isActive && shouldScrape
      })
      
      if (activeSources.length === 0) {
        console.log(`  ⏭️  No sources need updating\n`)
        continue
      }

      console.log(`  📡 Processing ${activeSources.length} sources`)
      
      for (const source of activeSources) {
        // Create scraping job record
        const job = await ScrapingJob.create({
          dataSourceId: source._id?.toString() || source.url,
          status: 'running',
          startedAt: new Date()
        })

        try {
          console.log(`    🔗 ${source.url}`)
          
          const manufacturer = typeof robot.manufacturer === 'string' 
            ? { nameEn: '' } 
            : robot.manufacturer
          
          let scrapedData
          
          if (source.type === 'official' && manufacturer.nameEn) {
            scrapedData = await scrapeManufacturerSite(source.url, manufacturer.nameEn)
          } else {
            scrapedData = await scrapeUrl(source.url)
          }
          
          // Update job status
          await ScrapingJob.findByIdAndUpdate(job._id, {
            status: 'completed',
            completedAt: new Date(),
            extractedData: scrapedData
          })
          
          // Update robot's data source
          const sourceIndex = robot.dataSources.findIndex(
            ds => ds._id?.toString() === source._id?.toString()
          )
          
          if (sourceIndex !== -1) {
            robot.dataSources[sourceIndex].lastScraped = new Date()
            robot.dataSources[sourceIndex].scrapedData = scrapedData
            
            // Smart update: only update if new data is better
            if (scrapedData.images?.length && (!robot.images.length || !robot.thumbnail)) {
              robot.thumbnail = robot.thumbnail || scrapedData.images[0]
              robot.images = [...new Set([...robot.images, ...scrapedData.images])]
            }
            
            if (scrapedData.description && !robot.description) {
              robot.description = scrapedData.description
            }
            
            if (scrapedData.price && !robot.price) {
              robot.price = scrapedData.price
            }
            
            if (scrapedData.specifications) {
              robot.specifications = {
                ...robot.specifications,
                ...scrapedData.specifications
              }
            }
          }
          
          await robot.save()
          
          console.log(`    ✅ Success`)
          successCount++
          
        } catch (error: any) {
          console.error(`    ❌ Error: ${error.message}`)
          errorCount++
          
          // Update job with error
          await ScrapingJob.findByIdAndUpdate(job._id, {
            status: 'failed',
            completedAt: new Date(),
            error: error.message
          })
        }
        
        // Delay between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 3000))
      }
      
      console.log() // Empty line for readability
    }

    console.log('='.repeat(60))
    console.log(`✨ Scraping job completed`)
    console.log(`  ✅ Successful: ${successCount}`)
    console.log(`  ❌ Failed: ${errorCount}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Fatal error in scraping job:', error)
  }
}

// Schedule the job
// Default: Run daily at 2 AM
const cronSchedule = process.env.CRON_SCHEDULE || '0 2 * * *'

console.log('🤖 Robot Comparison Platform - Scheduled Scraper')
console.log(`📅 Schedule: ${cronSchedule}`)
console.log(`⏰ Scraping interval: ${SCRAPE_INTERVAL} hours`)
console.log('🚀 Waiting for scheduled time...\n')

// Run immediately on start (optional)
if (process.env.RUN_ON_START === 'true') {
  console.log('▶️  Running initial scraping job...\n')
  runScrapingJob()
}

// Schedule regular runs
cron.schedule(cronSchedule, () => {
  runScrapingJob()
})

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down scheduled scraper...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down scheduled scraper...')
  process.exit(0)
})
