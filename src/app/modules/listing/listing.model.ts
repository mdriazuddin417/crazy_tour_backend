// src/models/TourListing.ts
import { Document, Schema, Types, model } from "mongoose";


export const tourListingSortableFields = ["title", "city", "category", "price", "duration", "maxGroupSize", "totalBookings", "averageRating"];

export enum TourCategory {
  FOOD = "FOOD",
  HISTORY = "HISTORY",
  ART = "ART",
  ADVENTURE = "ADVENTURE",
  NIGHTLIFE = "NIGHTLIFE",
  SHOPPING = "SHOPPING",
  PHOTOGRAPHY = "PHOTOGRAPHY",
  CULTURE = "CULTURE"
}


export interface ITourListing extends Document {
  guideId: Types.ObjectId;
  title: string;
  description: string;
  category: TourCategory;
  city: string;
  country: string;
  price: number;
  duration: number;
  maxGroupSize: number;
  meetingPoint: string;
  itinerary: string[];
  images: string[];
  languages: string[];
  isActive: boolean;
  totalBookings: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const TourListingSchema = new Schema<ITourListing>({
  guideId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: Object.values(TourCategory), required: true, index: true },
  city: { type: String, required: true, index: true },
  country: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  maxGroupSize: { type: Number, default: 1 },
  meetingPoint: { type: String, required: true },
  itinerary: { type: [String], default: [] },
  images: { type: [String], default: [] },
  languages: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  totalBookings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 }
}, { timestamps: true });

TourListingSchema.index({ city: 1, category: 1 });
export const TourListing = model<ITourListing>("TourListing", TourListingSchema);
