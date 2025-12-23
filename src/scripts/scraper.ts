/**
 * Manual scraping script
 * Run: npm run scrape
 */

import connectDB from '../lib/mongodb'
import Robot from '../models/Robot'
import Manufacturer from '../models/Manufacturer'
import { scrapeUrl, scrapeManufacturerSite } from '../lib/scraper'
import type { DataSource } from '../types'

async function main() {
  try {
    console.log('🚀 Starting scraping process...')
    await connectDB()

    // Get all robots with active data sources
    const robots = await Robot.find({
      'dataSources.isActive': true
    }).populate('manufacturer')

    console.log(`📊 Found ${robots.length} robots with active data sources`)

    for (const robot of robots) {
      console.log(`\n🤖 Processing: ${robot.name}`)
      
      const activeSources = robot.dataSources.filter((ds: DataSource) => ds.isActive)
      
      for (const source of activeSources) {
        try {
          console.log(`  📡 Scraping: ${source.url}`)
          
          const manufacturer = typeof robot.manufacturer === 'string' 
            ? { nameEn: '' } 
            : robot.manufacturer
          
          let scrapedData
          
          // Use manufacturer-specific scraping if available
          if (source.type === 'official' && manufacturer.nameEn) {
            scrapedData = await scrapeManufacturerSite(source.url, manufacturer.nameEn)
          } else {
            scrapedData = await scrapeUrl(source.url)
          }
          
          // Update the data source with scraped data
          const sourceIndex = robot.dataSources.findIndex(
            (ds: DataSource) => ds._id?.toString() === source._id?.toString()
          )
          
          if (sourceIndex !== -1) {
            robot.dataSources[sourceIndex].lastScraped = new Date()
            robot.dataSources[sourceIndex].scrapedData = scrapedData
          }
          
          // Optionally update robot fields if data is better
          if (scrapedData.images && scrapedData.images.length > 0 && !robot.thumbnail) {
            robot.thumbnail = scrapedData.images[0]
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
          
          console.log(`  ✅ Successfully scraped and updated`)
          
          // Save after each source
          await robot.save()
          
        } catch (error: any) {
          console.error(`  ❌ Error scraping ${source.url}:`, error.message)
        }
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }

    console.log('\n✨ Scraping completed!')
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Fatal error:', error)
    process.exit(1)
  }
}

main()
