# Local Guide Platform - Services Architecture

## Project Structure Overview

\`\`\`
src/
├── app/
│   ├── api/                    # API Route Handlers
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── users/[id]/route.ts
│   │   ├── listings/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── bookings/
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   ├── payments/route.ts
│   │   └── reviews/route.ts
│   ├── (auth)/                 # Authentication Pages
│   ├── (public)/               # Public Pages
│   ├── (dashboard)/            # Protected Dashboard Pages
│   └── admin/                  # Admin Pages
├── services/                   # Business Logic Services
│   ├── auth/
│   │   ├── auth.service.ts     # Server Actions for authentication
│   │   └── token-handlers.ts   # Token management utilities
│   ├── user/
│   │   └── user.service.ts     # User management services
│   ├── listing/
│   │   └── listing.service.ts  # Tour listing services
│   ├── booking/
│   │   └── booking.service.ts  # Booking workflow services
│   ├── payment/
│   │   └── payment.service.ts  # Payment processing services
│   ├── review/
│   │   └── review.service.ts   # Review system services
│   └── admin/
│       └── admin.service.ts    # Admin dashboard services
├── types/
│   └── zod/                    # Validation Schemas
│       ├── auth.validation.ts
│       ├── user.validation.ts
│       ├── listing.validation.ts
│       ├── booking.validation.ts
│       ├── payment.validation.ts
│       └── review.validation.ts
├── lib/
│   ├── server-fetch.ts         # Server-side fetch utility with auth
│   ├── types.ts                # TypeScript interfaces
│   ├── constants.ts            # App constants
│   ├── auth.ts                 # JWT token generation
│   ├── store.ts                # Client-side storage helpers
│   └── db-mock.ts              # Mock database
├── hooks/
│   └── use-auth.ts             # Authentication hook
└── components/
    ├── navbar.tsx
    ├── ui/                     # shadcn/ui components
    └── ...                     # Other components
\`\`\`

## How It Works

### 1. Client Layer (Pages & Components)
- Client components call API routes using `fetch()`
- Data is fetched and state is managed with `useState` and custom hooks like `useAuth()`
- No direct service imports in client code

### 2. API Routes (Next.js Route Handlers)
- Located in `app/api/**/route.ts`
- Validate incoming requests using Zod schemas
- Call server-side services with validated data
- Return JSON responses
- Handle all error scenarios with proper HTTP status codes

**Example Flow:**
\`\`\`
POST /api/listings
  ↓
Validate with createListingSchema (Zod)
  ↓
Call listing.service.ts via serverFetch
  ↓
Return JSON response
\`\`\`

### 3. Services Layer (Business Logic)
- Located in `services/**/*.service.ts`
- Marked with `"use server"` directive
- Perform business logic and data manipulation
- Use `serverFetch` utility for internal API calls (if needed)
- Catch and handle errors gracefully
- Return consistent API response format

**Service Responsibilities:**
- Data validation (Zod schemas)
- Business logic processing
- Error handling
- Logging

### 4. Server Fetch Utility
Located in `lib/server-fetch.ts`:
\`\`\`typescript
export const serverFetch = {
  get: async (endpoint: string, options?: RequestInit) => Response,
  post: async (endpoint: string, options?: RequestInit) => Response,
  put: async (endpoint: string, options?: RequestInit) => Response,
  patch: async (endpoint: string, options?: RequestInit) => Response,
  delete: async (endpoint: string, options?: RequestInit) => Response,
}
\`\`\`

### 5. Zod Validation Schemas
Located in `types/zod/**`:
- Define validation rules for all inputs
- Infer TypeScript types from schemas
- Used in both API routes and services
- Provide clear error messages

**Example:**
\`\`\`typescript
const createListingSchema = z.object({
  title: z.string().min(5),
  price: z.number().positive(),
  // ...
})

type CreateListingInput = z.infer<typeof createListingSchema>
\`\`\`

## API Request Flow

### Example: Creating a Booking

1. **Client Component** (`app/(public)/tours/[id]/page.tsx`)
\`\`\`typescript
const response = await fetch("/api/bookings", {
  method: "POST",
  body: JSON.stringify({
    tourListingId: "tour-123",
    requestedDate: "2025-01-15T10:00:00Z",
    groupSize: 4,
  }),
})
\`\`\`

2. **API Route** (`app/api/bookings/route.ts`)
\`\`\`typescript
export async function POST(request: NextRequest) {
  const body = await request.json()
  const validated = createBookingSchema.parse(body) // Validate
  const result = await createBookingService(validated) // Call service
  return NextResponse.json(result)
}
\`\`\`

3. **Service** (`services/booking/booking.service.ts`)
\`\`\`typescript
export async function createBookingService(data: CreateBookingInput) {
  const validated = createBookingSchema.parse(data)
  const response = await serverFetch.post("/bookings", {
    body: JSON.stringify(validated),
  })
  return await response.json()
}
\`\`\`

4. **Response** (sent back to client)
\`\`\`typescript
{
  success: true,
  data: {
    id: "booking-456",
    status: "PENDING",
    // ...
  }
}
\`\`\`

## Service Files Overview

### `services/auth/auth.service.ts`
- `registerService(data)` - Register new user
- `loginService(data)` - Authenticate user

### `services/user/user.service.ts`
- `getUserInfo(userId)` - Fetch user profile
- `updateUserService(userId, data)` - Update profile

### `services/listing/listing.service.ts`
- `createListingService(data)` - Create tour listing
- `getListingsService(queryString)` - Fetch listings with filters
- `getListingByIdService(id)` - Get single listing
- `updateListingService(id, data)` - Update listing
- `deleteListingService(id)` - Delete listing

### `services/booking/booking.service.ts`
- `createBookingService(data)` - Create booking request
- `getBookingsService(queryString)` - Fetch bookings
- `getBookingByIdService(id)` - Get booking details
- `updateBookingService(id, data)` - Update booking status

### `services/payment/payment.service.ts`
- `createPaymentService(data)` - Create payment
- `getPaymentsService(queryString)` - Fetch payments

### `services/review/review.service.ts`
- `createReviewService(data)` - Submit review
- `getReviewsService(queryString)` - Fetch reviews

### `services/admin/admin.service.ts`
- `getAdminStatsService()` - Platform statistics
- `getAllUsersService(queryString)` - Manage users
- `getAllListingsService(queryString)` - Manage listings
- `getAllBookingsService(queryString)` - Manage bookings

## Validation Schemas

All schemas are located in `types/zod/`:

- **auth.validation.ts** - Register/Login validation
- **user.validation.ts** - User profile updates
- **listing.validation.ts** - Tour listing CRUD
- **booking.validation.ts** - Booking requests/updates
- **payment.validation.ts** - Payment processing
- **review.validation.ts** - Review submissions

## Best Practices

1. **Always validate in both API routes and services**
   - Use Zod schemas for consistency
   - Clear, user-friendly error messages

2. **Use serverFetch for internal API calls**
   - Handles authentication headers
   - Centralized request logic

3. **Consistent error handling**
   - Try-catch blocks in services
   - Proper HTTP status codes in routes
   - Development vs production error messages

4. **Type safety**
   - Infer types from Zod schemas
   - No `any` types unless absolutely necessary

5. **Server Actions pattern**
   - All services use `"use server"` directive
   - Can be called from client components
   - No need for separate API calls from services

## Environment Variables

None required for this demo version. When integrating with real services:
- `NEXT_PUBLIC_BASE_API_URL` - API endpoint (defaults to localhost:3000/api)
- `DATABASE_URL` - Database connection string (when using real DB)
- `JWT_SECRET` - JWT token signing key
