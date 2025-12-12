# Services Architecture Refactoring - Complete

## What Was Changed

### Before (Old Structure)
\`\`\`
app/
└── api/
    ├── services/ (old - directly with route handlers)
    └── [routes with embedded logic]
\`\`\`

### After (New Structure)
\`\`\`
services/                    ← NEW: Centralized services folder
├── auth/
├── user/
├── listing/
├── booking/
├── payment/
├── review/
└── admin/

types/zod/                   ← NEW: Zod validation schemas
├── auth.validation.ts
├── user.validation.ts
├── listing.validation.ts
├── booking.validation.ts
├── payment.validation.ts
└── review.validation.ts

lib/
└── server-fetch.ts          ← NEW: Centralized fetch utility
\`\`\`

## Key Improvements

### 1. Centralized Validation with Zod
- All input validation is now explicit using Zod schemas
- Schemas are reused in both API routes and services
- Type-safe inference from schemas

**Example:**
\`\`\`typescript
// Define once
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(["TOURIST", "GUIDE"]),
})

// Use in API route and service
const validated = registerSchema.parse(body)
\`\`\`

### 2. Professional Service Layer
Each service exports multiple related functions:

\`\`\`typescript
// services/listing/listing.service.ts
export async function createListingService(data: CreateListingInput)
export async function getListingsService(queryString?: string)
export async function getListingByIdService(listingId: string)
export async function updateListingService(listingId: string, data: UpdateListingInput)
export async function deleteListingService(listingId: string)
\`\`\`

### 3. Consistent ServerFetch Utility
\`\`\`typescript
// lib/server-fetch.ts - Single source of truth for API calls
export const serverFetch = {
  get: async (endpoint, options) => fetch(...)
  post: async (endpoint, options) => fetch(...)
  // ... etc
}

// Used in services
const response = await serverFetch.post("/listings", {
  body: JSON.stringify(data),
  headers: { "Content-Type": "application/json" }
})
\`\`\`

### 4. Clean API Routes
Routes now focus on HTTP concerns:
- Request parsing
- Input validation with Zod
- Service invocation
- Response formatting
- Error handling with proper status codes

\`\`\`typescript
// app/api/listings/route.ts - Clean and focused
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate
    const validated = createListingSchema.parse(body)
    
    // Call service
    const result = await createListingService(validated)
    
    // Respond
    return NextResponse.json(result, { 
      status: result.success ? 201 : 400 
    })
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    )
  }
}
\`\`\`

### 5. Error Handling
Standardized error handling across all services:

\`\`\`typescript
// All services follow this pattern
export async function exampleService(data: InputType) {
  try {
    // Validate
    const validated = exampleSchema.parse(data)
    
    // Process
    const response = await serverFetch.post("/endpoint", {...})
    
    // Return
    return await response.json()
  } catch (error: any) {
    console.error("Error:", error)
    return {
      success: false,
      message: process.env.NODE_ENV === "development" 
        ? error.message 
        : "Operation failed"
    }
  }
}
\`\`\`

## API Endpoints Structure

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/[id]` - Get user profile
- `PATCH /api/users/[id]` - Update user profile

### Listings (Tours)
- `GET /api/listings` - Search/filter tours
- `POST /api/listings` - Create tour
- `GET /api/listings/[id]` - Get tour details
- `PATCH /api/listings/[id]` - Update tour
- `DELETE /api/listings/[id]` - Delete tour

### Bookings
- `GET /api/bookings` - Get bookings (with filters)
- `POST /api/bookings` - Create booking request
- `GET /api/bookings/[id]` - Get booking details
- `PATCH /api/bookings/[id]` - Update booking status

### Payments
- `GET /api/payments` - Get payments
- `POST /api/payments` - Create/process payment

### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Submit review

## Service Files Organization

\`\`\`
services/
├── auth/
│   ├── auth.service.ts          (register, login)
│   └── token-handlers.ts        (token utilities)
├── user/
│   └── user.service.ts          (user CRUD)
├── listing/
│   └── listing.service.ts       (tour CRUD, search)
├── booking/
│   └── booking.service.ts       (booking workflow)
├── payment/
│   └── payment.service.ts       (payment handling)
├── review/
│   └── review.service.ts        (review system)
└── admin/
    └── admin.service.ts         (admin operations)
\`\`\`

## Validation Schemas Organization

\`\`\`
types/zod/
├── auth.validation.ts           (register, login schemas)
├── user.validation.ts           (profile update schema)
├── listing.validation.ts        (create, update schemas)
├── booking.validation.ts        (create, update schemas)
├── payment.validation.ts        (payment schema)
└── review.validation.ts         (review schema)
\`\`\`

## Usage Examples

### Creating a Booking (Full Flow)

**1. Client Component**
\`\`\`typescript
const response = await fetch("/api/bookings", {
  method: "POST",
  body: JSON.stringify({
    tourListingId: "tour-123",
    requestedDate: "2025-01-20T10:00:00Z",
    groupSize: 4,
    notes: "Looking forward to this!"
  })
})
const result = await response.json()
\`\`\`

**2. API Route** (`app/api/bookings/route.ts`)
\`\`\`typescript
const validated = createBookingSchema.parse(body)
const result = await createBookingService(validated)
return NextResponse.json(result)
\`\`\`

**3. Service** (`services/booking/booking.service.ts`)
\`\`\`typescript
const response = await serverFetch.post("/bookings", {
  body: JSON.stringify(validated),
  headers: { "Content-Type": "application/json" }
})
return await response.json()
\`\`\`

**4. Response**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "booking-456",
    "status": "PENDING",
    "touristId": "user-123",
    "guideId": "user-456",
    "totalPrice": 200
  }
}
\`\`\`

## Migration Guide (If Needed)

If you have existing code that needs updating:

1. **Update imports in API routes**
   \`\`\`typescript
   // Old
   import { createListingService } from "@/app/api/services/listing.api.service"
   
   // New
   import { createListingService } from "@/services/listing/listing.service"
   \`\`\`

2. **Add validation schemas**
   \`\`\`typescript
   // In route handlers
   const validated = createListingSchema.parse(body)
   \`\`\`

3. **Use new serverFetch utility**
   \`\`\`typescript
   // In services - already configured for auth headers
   const response = await serverFetch.post("/endpoint", { body })
   \`\`\`

## Next Steps

1. Connect to real database (Supabase/Neon)
2. Replace mock DB with actual queries
3. Add authentication middleware
4. Implement rate limiting
5. Add request logging
6. Set up monitoring and error tracking
7. Deploy to production

## Testing the System

Each service is independently testable:

\`\`\`typescript
// Example test for listing service
import { createListingService } from "@/services/listing/listing.service"

const result = await createListingService({
  title: "Hidden Jazz Bars",
  description: "Explore...",
  // ... other required fields
})

console.assert(result.success === true, "Listing creation failed")
