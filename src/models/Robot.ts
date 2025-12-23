import mongoose, { Schema, model, models } from 'mongoose'
import type { Robot } from '@/types'
import { RobotCategory } from '@/types'

const DataSourceSchema = new Schema({
  url: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['official', 'news', 'social', 'review', 'manual'],
    required: true 
  },
  platform: { 
    type: String, 
    enum: ['twitter', 'weixin', 'youtube', 'website', 'other'] 
  },
  lastScraped: { type: Date },
  scrapedData: { type: Schema.Types.Mixed },
  isActive: { type: Boolean, default: true },
  scrapingConfig: {
    selectors: { type: Map, of: String },
    interval: { type: Number, default: 24 },
  },
  createdAt: { type: Date, default: Date.now },
})

const RobotSchema = new Schema<Robot>(
  {
    name: { type: String, required: true },
    nameEn: { type: String },
    manufacturer: { 
      type: Schema.Types.ObjectId, 
      ref: 'Manufacturer',
      required: true 
    },
    category: { 
      type: String, 
      enum: Object.values(RobotCategory),
      required: true,
      index: true
    },
    model: { type: String, required: true },
    images: [{ type: String }],
    thumbnail: { type: String },
    description: { type: String },
    keyFeatures: [{ type: String }],
    specifications: { type: Schema.Types.Mixed, default: {} },
    price: {
      amount: { type: Number },
      currency: { type: String, default: 'USD' },
      note: { type: String },
    },
    releaseDate: { type: Date },
    status: {
      type: String,
      enum: ['concept', 'development', 'released', 'discontinued'],
      default: 'development'
    },
    officialLink: { type: String },
    videoLinks: [{ type: String }],
    dataSources: [DataSourceSchema],
  },
  { timestamps: true }
)

// Indexes for better query performance
RobotSchema.index({ category: 1, status: 1 })
RobotSchema.index({ manufacturer: 1 })
RobotSchema.index({ name: 'text', description: 'text' })

export default models.Robot || model<Robot>('Robot', RobotSchema)
