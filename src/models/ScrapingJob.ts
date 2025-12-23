import mongoose, { Schema, model, models } from 'mongoose'
import type { ScrapingJob } from '@/types'

const ScrapingJobSchema = new Schema<ScrapingJob>(
  {
    dataSourceId: { 
      type: String,
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
      index: true
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
    error: { type: String },
    extractedData: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
)

// Auto-delete jobs older than 30 days
ScrapingJobSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 })

export default models.ScrapingJob || model<ScrapingJob>('ScrapingJob', ScrapingJobSchema)
