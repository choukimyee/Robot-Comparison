import mongoose, { Schema, model, models } from 'mongoose'
import type { Manufacturer } from '@/types'

const ManufacturerSchema = new Schema<Manufacturer>(
  {
    name: { type: String, required: true },
    nameEn: { type: String, required: true, unique: true },
    logo: { type: String },
    website: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String },
    socialMedia: {
      twitter: { type: String },
      weixin: { type: String },
      linkedin: { type: String },
      youtube: { type: String },
    },
  },
  { timestamps: true }
)

export default models.Manufacturer || model<Manufacturer>('Manufacturer', ManufacturerSchema)
