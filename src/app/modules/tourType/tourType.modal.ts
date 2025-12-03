import { Schema, model } from "mongoose";



export interface ITourType {
  name: string;
  description?: string;
  icon?: string; // optional icon URL
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TourTypeSchema = new Schema<ITourType>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TourType = model<ITourType>("TourType", TourTypeSchema);
