import { Types } from "mongoose";
import { TourCategory } from "../listing/listing.model";

export enum Role {
    ADMIN = "ADMIN",
    GUIDE = "GUIDE",
    TOURIST = "TOURIST",
}

//auth providers

export interface IAuthProvider {
    provider: "google" | "credentials";  // "Google", "Credential"
    providerId: string;
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id?: Types.ObjectId
    name: string;
    email: string;
    password?: string;
    phone?: string;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    role: Role;
    auths: IAuthProvider[];
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
    createdAt?: Date,
    profilePic?: string;
    bio?: string;
    languagesSpoken: string[];
    expertise?: TourCategory[];
    dailyRate?: number;
    totalToursGiven?: number;
    averageRating?: number;
    verified?: boolean;
    updatedAt: Date;
}