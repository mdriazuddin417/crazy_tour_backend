// src/models/User.ts
import { Document, Schema, model } from "mongoose";
import { TourCategory } from "../listing/listing.model";


export enum UserRole {
  TOURIST = "TOURIST",
  GUIDE = "GUIDE",
  ADMIN = "ADMIN"
}

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  profilePic?: string;
  bio?: string;
  role: UserRole;
  languagesSpoken: string[];
  expertise?: TourCategory[];
  dailyRate?: number;
  totalToursGiven?: number;
  averageRating?: number;
  verified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  profilePic: String,
  bio: String,
  role: { type: String, enum: Object.values(UserRole), default: UserRole.TOURIST },
  languagesSpoken: { type: [String], default: [] },
  expertise: { type: [String], enum: Object.values(TourCategory), default: [] },
  dailyRate: Number,
  totalToursGiven: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

export const User = model<IUser>("User", UserSchema);
