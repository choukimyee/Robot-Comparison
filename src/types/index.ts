// Robot Categories
export enum RobotCategory {
  QUADRUPED = 'quadruped',
  HUMANOID = 'humanoid',
  VACUUM = 'vacuum',
  LAWN_MOWER = 'lawn_mower',
  POOL_CLEANER = 'pool_cleaner',
}

export const CATEGORY_LABELS: Record<RobotCategory, string> = {
  [RobotCategory.QUADRUPED]: '四足机器狗',
  [RobotCategory.HUMANOID]: '人形机器人',
  [RobotCategory.VACUUM]: '扫地机器人',
  [RobotCategory.LAWN_MOWER]: '割草机器人',
  [RobotCategory.POOL_CLEANER]: '泳池清洁机器人',
}

// Manufacturer
export interface Manufacturer {
  _id?: string
  name: string
  nameEn: string
  logo?: string
  website: string
  country: string
  description?: string
  socialMedia?: {
    twitter?: string
    weixin?: string
    linkedin?: string
    youtube?: string
  }
  createdAt?: Date
  updatedAt?: Date
}

// Robot Specifications
export interface RobotSpecs {
  // Common specs
  weight?: number // kg
  height?: number // cm
  length?: number // cm
  width?: number // cm
  batteryCapacity?: number // Wh
  batteryLife?: number // hours
  chargingTime?: number // hours
  maxSpeed?: number // km/h or m/s
  payload?: number // kg
  
  // Quadruped specific
  hipHeight?: number // cm
  stride?: number // cm
  climbingAngle?: number // degrees
  waterproofRating?: string // IP rating
  
  // Humanoid specific
  dof?: number // Degrees of Freedom
  armReach?: number // cm
  handGrip?: number // N (Newtons)
  
  // Environmental
  operatingTemp?: { min: number; max: number } // Celsius
  
  // Other
  [key: string]: any
}

// Robot Product
export interface Robot {
  _id?: string
  name: string
  nameEn?: string
  manufacturer: string | Manufacturer
  category: RobotCategory
  model: string
  images: string[]
  thumbnail?: string
  description?: string
  keyFeatures: string[]
  specifications: RobotSpecs
  price?: {
    amount: number
    currency: string
    note?: string // e.g., "starting from", "estimated"
  }
  releaseDate?: Date
  status: 'concept' | 'development' | 'released' | 'discontinued'
  officialLink?: string
  videoLinks?: string[]
  dataSources: DataSource[]
  createdAt?: Date
  updatedAt?: Date
}

// Data Source for scraping
export interface DataSource {
  _id?: string
  url: string
  type: 'official' | 'news' | 'social' | 'review' | 'manual'
  platform?: 'twitter' | 'weixin' | 'youtube' | 'website' | 'other'
  lastScraped?: Date
  scrapedData?: any
  isActive: boolean
  scrapingConfig?: {
    selectors?: Record<string, string>
    interval?: number // hours
  }
  createdAt?: Date
}

// Comparison result
export interface ComparisonResult {
  robots: Robot[]
  comparisonFields: ComparisonField[]
}

export interface ComparisonField {
  key: string
  label: string
  values: ComparisonValue[]
  bestIndex?: number // Index of the best value
  type: 'number' | 'string' | 'date' | 'boolean'
}

export interface ComparisonValue {
  robotId: string
  value: any
  displayValue: string
  isBest?: boolean
}

// Scraping job
export interface ScrapingJob {
  _id?: string
  dataSourceId: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  startedAt?: Date
  completedAt?: Date
  error?: string
  extractedData?: any
}
