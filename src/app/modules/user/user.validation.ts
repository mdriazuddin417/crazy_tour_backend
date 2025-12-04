import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: z
        .string({ invalid_type_error: "Email must be string" })
        .email({ message: "Invalid email address format." })
        .min(5, { message: "Email must be at least 5 characters long." })
        .max(100, { message: "Email cannot exceed 100 characters." }),
    password: z
        .string({ invalid_type_error: "Password must be string" })
        .min(8, { message: "Password must be at least 8 characters long." })
        .regex(/^(?=.*[A-Z])/, {
            message: "Password must contain at least 1 uppercase letter.",
        })
        .regex(/^(?=.*[!@#$%^&*])/, {
            message: "Password must contain at least 1 special character.",
        })
        .regex(/^(?=.*\d)/, {
            message: "Password must contain at least 1 number.",
        }),
    phone: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    profilePic: z
        .string({ invalid_type_error: "Profile Picture must be string" })
        .url({ message: "Invalid profile picture URL." })
        .optional(),
    bio: z
        .string({ invalid_type_error: "Bio must be string" })
        .max(200, { message: "Bio cannot exceed 200 characters." })
        .optional(),
    languagesSpoken: z
        .array(z.string({ invalid_type_error: "Languages Spoken must be string" }))
        .min(1, { message: "Languages Spoken must be at least 1 language." })
        .max(10, { message: "Languages Spoken cannot exceed 10 languages." })
        .optional(),
    expertise: z
        .array(z.string({ invalid_type_error: "Expertise must be string" }))
        .min(1, { message: "Expertise must be at least 1 expertise." })
        .max(10, { message: "Expertise cannot exceed 10 expertise." })
        .optional(),
    dailyRate: z
        .number({ invalid_type_error: "Daily Rate must be number" })
        .min(0, { message: "Daily Rate must be at least 0." })
        .max(1000000, { message: "Daily Rate cannot exceed 1000000." })
        .optional(),
    totalToursGiven: z
        .number({ invalid_type_error: "Total Tours Given must be number" })
        .min(0, { message: "Total Tours Given must be at least 0." })
        .max(1000, { message: "Total Tours Given cannot exceed 1000." })
        .optional(),
    averageRating: z
        .number({ invalid_type_error: "Average Rating must be number" })
        .min(0, { message: "Average Rating must be at least 0." })
        .max(5, { message: "Average Rating cannot exceed 5." })
        .optional(),
    verified: z
        .boolean({ invalid_type_error: "Verified must be true or false" })
        .optional()
})
export const updateUserZodSchema = z.object({
    name: z
        .string({ invalid_type_error: "Name must be string" })
        .min(2, { message: "Name must be at least 2 characters long." })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional(),
    phone: z
        .string({ invalid_type_error: "Phone Number must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801XXXXXXXXX or 01XXXXXXXXX",
        })
        .optional(),
    role: z
        .enum(Object.values(Role) as [string])
        .optional(),
    isActive: z
        .enum(Object.values(IsActive) as [string])
        .optional(),
    isDeleted: z
        .boolean({ invalid_type_error: "isDeleted must be true or false" })
        .optional(),
    profilePic: z
        .string({ invalid_type_error: "Profile Picture must be string" })
        .url({ message: "Invalid profile picture URL." })
        .optional(),
    bio: z
        .string({ invalid_type_error: "Bio must be string" })
        .max(200, { message: "Bio cannot exceed 200 characters." })
        .optional(),
    languagesSpoken: z
        .array(z.string({ invalid_type_error: "Languages Spoken must be string" }))
        .min(1, { message: "Languages Spoken must be at least 1 language." })
        .max(10, { message: "Languages Spoken cannot exceed 10 languages." })
        .optional(),
    expertise: z
        .array(z.string({ invalid_type_error: "Expertise must be string" }))
        .min(1, { message: "Expertise must be at least 1 expertise." })
        .max(10, { message: "Expertise cannot exceed 10 expertise." })
        .optional(),
    dailyRate: z
        .number({ invalid_type_error: "Daily Rate must be number" })
        .min(0, { message: "Daily Rate must be at least 0." })
        .max(1000000, { message: "Daily Rate cannot exceed 1000000." })
        .optional(),
    totalToursGiven: z
        .number({ invalid_type_error: "Total Tours Given must be number" })
        .min(0, { message: "Total Tours Given must be at least 0." })
        .max(1000, { message: "Total Tours Given cannot exceed 1000." })
        .optional(),
    averageRating: z
        .number({ invalid_type_error: "Average Rating must be number" })
        .min(0, { message: "Average Rating must be at least 0." })
        .max(5, { message: "Average Rating cannot exceed 5." })
        .optional(),
    verified: z
        .boolean({ invalid_type_error: "Verified must be true or false" })
        .optional()
})