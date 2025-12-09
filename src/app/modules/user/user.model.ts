import { model, Schema } from "mongoose";
import { TourCategory } from "../listing/listing.model";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interface";


const authProviderSchema = new Schema<IAuthProvider>({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
})

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.TOURIST
    },
    phone: { type: String },
    profilePic: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE,
    },
    auths: [authProviderSchema],
    bio: String,
    languagesSpoken: { type: [String], default: [] },
    expertise: { type: [String], enum: Object.values(TourCategory), default: [] },
    dailyRate: Number,
    totalToursGiven: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    verified: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
})

export const User = model<IUser>("User", userSchema)