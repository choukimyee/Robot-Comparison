import axios from 'axios'
import * as cheerio from 'cheerio'
import puppeteer from 'puppeteer'

export interface ScrapedData {
  title?: string
  description?: string
  images?: string[]
  price?: {
    amount: number
    currency: string
  }
  specifications?: Record<string, any>
  content?: string
  metadata?: Record<string, any>
}

/**
 * Scrape a URL and extract robot-related information
 */
export async function scrapeUrl(url: string): Promise<ScrapedData> {
  try {
    // Determine scraping method based on URL
    if (url.includes('twitter.com') || url.includes('x.com')) {
      return await scrapeSocialMedia(url, 'twitter')
    } else if (url.includes('youtube.com')) {
      return await scrapeYouTube(url)
    } else {
      return await scrapeWebsite(url)
    }
  } catch (error) {
    console.error('Error scraping URL:', url, error)
    throw error
  }
}

/**
 * Scrape a regular website using Cheerio (fast, static content)
 */
async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    })

    const $ = cheerio.load(response.data)
    const data: ScrapedData = {}

    // Extract title
    data.title = $('h1').first().text().trim() || 
                 $('title').text().trim() ||
                 $('meta[property="og:title"]').attr('content')

    // Extract description
    data.description = $('meta[name="description"]').attr('content') ||
                      $('meta[property="og:description"]').attr('content') ||
                      $('p').first().text().trim()

    // Extract images
    const images: string[] = []
    $('img').each((i, elem) => {
      const src = $(elem).attr('src')
      if (src && !src.includes('logo') && !src.includes('icon')) {
        const absoluteUrl = new URL(src, url).href
        images.push(absoluteUrl)
      }
    })
    
    // Also check for Open Graph images
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) {
      images.unshift(new URL(ogImage, url).href)
    }
    
    data.images = [...new Set(images)].slice(0, 10)

    // Extract price information
    const priceText = $('[class*="price"], [id*="price"]').first().text()
    const priceMatch = priceText.match(/[\$¥€£]\s*([\d,]+(?:\.\d{2})?)/)
    if (priceMatch) {
      data.price = {
        amount: parseFloat(priceMatch[1].replace(/,/g, '')),
        currency: priceText.includes('¥') ? 'CNY' : 'USD'
      }
    }

    // Extract specifications (look for common patterns)
    const specs: Record<string, any> = {}
    $('table tr, .spec-item, [class*="specification"]').each((i, elem) => {
      const $elem = $(elem)
      const key = $elem.find('th, .spec-label, .label').first().text().trim()
      const value = $elem.find('td, .spec-value, .value').first().text().trim()
      
      if (key && value) {
        specs[key.toLowerCase().replace(/\s+/g, '_')] = value
      }
    })
    
    if (Object.keys(specs).length > 0) {
      data.specifications = specs
    }

    // Extract main content
    const contentElements = $('article, .content, main, .description').first()
    data.content = contentElements.text().trim().substring(0, 1000)

    // Metadata
    data.metadata = {
      url,
      scrapedAt: new Date().toISOString(),
      charset: response.headers['content-type']
    }

    return data
  } catch (error) {
    console.error('Error in scrapeWebsite:', error)
    throw new Error(`Failed to scrape website: ${url}`)
  }
}

/**
 * Scrape dynamic websites using Puppeteer (slower, for JavaScript-heavy sites)
 */
export async function scrapeWithPuppeteer(url: string): Promise<ScrapedData> {
  let browser
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    // Wait for content to load
    await new Promise(resolve => setTimeout(resolve, 2000))

    const data = await page.evaluate(() => {
      const result: ScrapedData = {}

      // Extract title
      const h1 = document.querySelector('h1')
      result.title = h1?.textContent?.trim() || document.title

      // Extract images
      const images: string[] = []
      document.querySelectorAll('img').forEach((img) => {
        const src = img.src
        if (src && !src.includes('logo') && !src.includes('icon')) {
          images.push(src)
        }
      })
      result.images = [...new Set(images)].slice(0, 10)

      // Extract description
      const metaDesc = document.querySelector('meta[name="description"]')
      result.description = metaDesc?.getAttribute('content') || ''

      return result
    })

    data.metadata = {
      url,
      scrapedAt: new Date().toISOString(),
      method: 'puppeteer'
    }

    return data
  } catch (error) {
    console.error('Error in scrapeWithPuppeteer:', error)
    throw new Error(`Failed to scrape with Puppeteer: ${url}`)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Scrape social media (Twitter, etc.)
 */
async function scrapeSocialMedia(url: string, platform: 'twitter'): Promise<ScrapedData> {
  // For production, you would use Twitter API or specialized scraping tools
  // This is a simplified version
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    
    return {
      title: $('meta[property="og:title"]').attr('content'),
      description: $('meta[property="og:description"]').attr('content'),
      images: [$('meta[property="og:image"]').attr('content')].filter(Boolean) as string[],
      metadata: {
        url,
        platform,
        scrapedAt: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error scraping social media:', error)
    return {
      metadata: {
        url,
        platform,
        scrapedAt: new Date().toISOString(),
        error: 'Failed to scrape'
      }
    }
  }
}

/**
 * Scrape YouTube videos
 */
async function scrapeYouTube(url: string): Promise<ScrapedData> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    
    return {
      title: $('meta[name="title"]').attr('content'),
      description: $('meta[name="description"]').attr('content'),
      images: [$('meta[property="og:image"]').attr('content')].filter(Boolean) as string[],
      metadata: {
        url,
        platform: 'youtube',
        scrapedAt: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error scraping YouTube:', error)
    throw new Error(`Failed to scrape YouTube: ${url}`)
  }
}

/**
 * Scrape specific manufacturer websites with custom selectors
 */
export async function scrapeManufacturerSite(
  url: string, 
  manufacturer: string
): Promise<ScrapedData> {
  // Custom scraping logic for known manufacturers
  const customSelectors: Record<string, any> = {
    'unitree': {
      title: '.product-title, h1.name',
      price: '.price-value',
      specs: '.specifications table',
      images: '.product-gallery img'
    },
    'tesla': {
      title: 'h1',
      description: '.description',
      images: '.gallery img'
    }
    // Add more manufacturers as needed
  }

  const selectors = customSelectors[manufacturer.toLowerCase()]
  
  if (selectors) {
    // Use custom selectors
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })

    const $ = cheerio.load(response.data)
    const data: ScrapedData = {}

    if (selectors.title) {
      data.title = $(selectors.title).first().text().trim()
    }

    if (selectors.images) {
      const images: string[] = []
      $(selectors.images).each((i, elem) => {
        const src = $(elem).attr('src')
        if (src) {
          images.push(new URL(src, url).href)
        }
      })
      data.images = images
    }

    return data
  }

  // Fallback to generic scraping
  return scrapeWebsite(url)
}
