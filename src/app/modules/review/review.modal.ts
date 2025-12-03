// src/models/Review.ts
import { Document, Schema, Types, model } from "mongoose";

export interface IReview extends Document {
  bookingId: Types.ObjectId;
  touristId: Types.ObjectId;
  guideId: Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
  touristId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  guideId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String
}, { timestamps: true });

ReviewSchema.index({ guideId: 1 });
export const Review = model<IReview>("Review", ReviewSchema);
