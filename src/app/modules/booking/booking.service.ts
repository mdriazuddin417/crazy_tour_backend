
import { QueryBuilder } from '../../utils/QueryBuilder';
import { TourListing } from '../listing/listing.model';
import { IUser, UserRole } from '../testUser/user.modal';
import { Booking, BookingStatus } from './booking.modal';

export const BookingService = {
  createBooking: async (payload: Record<string, string>) => {
    const tour = await TourListing.findById(payload.tourListingId);
    if (!tour) throw new Error('Tour not found');
    const totalPrice = (tour.price || 0) * (Number(payload.groupSize) || 1);
    const booking = await Booking.create({
      touristId: payload.touristId,
      guideId: tour.guideId,
      tourListingId: tour._id,
      requestedDate: new Date(payload.requestedDate),
      groupSize: Number(payload.groupSize) || 1,
      totalPrice,
      notes: payload.notes || '' as string | undefined | null,
      status: BookingStatus.PENDING as BookingStatus
    });
    return booking;
  },

  updateBooking: async (id: string, payload: Record<string, string>, user: IUser) => {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Booking not found');
    if (payload.status === BookingStatus.CONFIRMED) {
      if (!user || (String(user._id) !== String(booking.guideId) && user.role !== UserRole.ADMIN)) {
        throw new Error('Not authorized to confirm');
      }
    }
    const updated = await Booking.findByIdAndUpdate(id, payload, { new: true });
    return updated;
  },

  getBookingById: async (id: string) => {
    return Booking.findById(id).populate('tourListingId').populate('touristId').populate('guideId');
  },

  getBookings: async (query: Record<string, string>, user: IUser) => {

    // 1. --- Construct the Initial Mongoose Filter Object ---
    const filter: Record<string, string> = {};

    // Apply role-based filtering (These MUST be the first filters)
    if (user?.role === UserRole.GUIDE) {
      filter.guideId = String(user._id);
    } else if (user?.role === UserRole.TOURIST) {
      filter.touristId = String(user._id);
    }

    // Apply specific query filters (Status and Tour Listing ID)
    if (query.status) {
      filter.status = query.status as string;
    }
    if (query.tourListingId) {
      filter.tourListingId = query.tourListingId as string;
    }

    // Apply Date Range Filtering
    if (query.fromDate || query.toDate) {
      (filter.requestedDate as unknown as Record<string, Date>) = {};
      if (query.fromDate) {
        (filter.requestedDate as unknown as Record<string, Date>).$gte = new Date(query.fromDate) as unknown as Date;
      }
      if (query.toDate) {
        (filter.requestedDate as unknown as Record<string, Date>).$lte = new Date(query.toDate) as unknown as Date;
      }
    }

    // 2. --- Create Initial Mongoose Query ---
    // Start the Mongoose query with the necessary initial filters and population
    const initialModelQuery = Booking.find(filter).populate('tourListingId');

    // 3. --- Instantiate QueryBuilder ---
    // Pass the pre-filtered Mongoose query and the entire request query object
    const qb = new QueryBuilder(initialModelQuery, query as Record<string, string>);

    // 4. --- Chain Operations ---
    // The QueryBuilder methods will now apply their logic (search, sort, etc.) 
    // on top of the initial filters defined above.
    const docs = await qb
      .search(['notes'])
      .filter() // This applies any remaining general filters from the URL query
      .sort()
      .paginate()
      .fields()
      .build();

    // 5. --- Get Metadata ---
    const meta = await qb.getMeta();

    return { data: docs, meta };
  }
};