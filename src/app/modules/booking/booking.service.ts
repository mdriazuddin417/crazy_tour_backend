
import { Types } from 'mongoose';
import AppError from '../../errorHelpers/AppError';
import { QueryBuilder } from '../../utils/QueryBuilder';
import { TourListing } from '../listing/listing.model';
import { PAYMENT_STATUS } from '../payment/payment.interface';

import { getTransactionId } from '../../utils/getTransactionId';
import { Payment } from '../payment/payment.model';
import { ISSLCommerz } from '../sslCommerz/sslCommerz.interface';
import { SSLService } from '../sslCommerz/sslCommerz.service';
import { IUser, Role } from '../user/user.interface';
import { Booking, BookingStatus, IBooking } from './booking.modal';

export const BookingService = {
  createBooking: async (payload: IBooking) => {
    const tour = await TourListing.findById(payload.tourListingId);
    if (!tour) {
      throw new AppError(404, 'Listing not found');
    };
    const transactionId = getTransactionId()
    const totalPrice = (tour.price || 0) * (Number(payload.groupSize) || 1);

    const booking = await Booking.create({
      touristId: new Types.ObjectId(payload.touristId),
      guideId: new Types.ObjectId(tour.guideId),
      tourListingId: new Types.ObjectId(tour._id as string),
      requestedDate: new Date(payload.requestedDate),
      groupSize: Number(payload.groupSize) || 1,
      totalPrice,
      notes: payload.notes || '',
      status: BookingStatus.PENDING as BookingStatus,
      paymentStatus: PAYMENT_STATUS.UNPAID as PAYMENT_STATUS | 'UNPAID',
      paymentId: payload.paymentId ? new Types.ObjectId(payload.paymentId as string) : undefined as Types.ObjectId | undefined
    });
    const payment = await Payment.create([{
      booking: booking._id as Types.ObjectId,
      status: PAYMENT_STATUS.UNPAID,
      transactionId: transactionId,
      amount: totalPrice
    }]);
    const updatedBooking = await Booking
      .findByIdAndUpdate(
        booking._id as Types.ObjectId,
        { payment: payment[0]._id as Types.ObjectId },
        { new: true, runValidators: true, }
      )
      .populate("tourListingId", "title price")
      .populate("touristId", "name email phone address")
      .populate("payment", "status transactionId amount");

    const userAddress = (updatedBooking?.touristId as unknown as IUser).address
    const userEmail = (updatedBooking?.touristId as unknown as IUser).email
    const userPhoneNumber = (updatedBooking?.touristId as unknown as IUser).phone
    const userName = (updatedBooking?.touristId as unknown as IUser).name

    const sslPayload: ISSLCommerz = {
      address: userAddress || '',
      email: userEmail || '',
      phoneNumber: userPhoneNumber || '',
      name: userName || '',
      amount: totalPrice,
      transactionId: transactionId
    }
    const sslPayment = await SSLService.sslPaymentInit(sslPayload)
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking
    }
  },

  updateBooking: async (id: string, payload: Record<string, string>, user: IUser) => {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Booking not found');
    if (payload.status === BookingStatus.CONFIRMED) {
      if (!user || (String(user._id) !== String(booking.guideId) && user.role !== Role.ADMIN)) {
        throw new Error('Not authorized to confirm');
      }
    }
    if (payload.status === BookingStatus.CANCELLED) {
      if (!user || (String(user._id) !== String(booking.touristId) && user.role !== Role.ADMIN)) {
        throw new Error('Not authorized to cancel');
      }
    }
    if (payload.status === BookingStatus.COMPLETED) {
      if (!user || (String(user._id) !== String(booking.guideId) && user.role !== Role.ADMIN)) {
        throw new Error('Not authorized to complete');
      }
    }

    const tour = await TourListing.findById(booking.tourListingId);
    if (!tour) {
      throw new AppError(404, 'Listing not found');
    };
    const totalPrice = (tour.price || 0) * (Number(payload.groupSize) || 1);
    payload.totalPrice = Number(totalPrice) as unknown as string;
    const updatedBooking = await Booking.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedBooking) {
      throw new AppError(404, 'Booking not found');
    }
    return updatedBooking;
  },

  getBookingById: async (id: string) => {
    const booking = await Booking.findById(id)
      .populate('tourListingId')
      .populate({ path: 'guideId', select: '-password' })
      .populate({ path: 'touristId', select: '-password' });

    if (!booking) {
      throw new AppError(404, 'Booking not found');
    }
    return booking;
  },

  getBookings: async (query: Record<string, string>, user: IUser) => {

    const filter: Record<string, string> = {};
    if (user?.role === Role.GUIDE) {
      filter.guideId = String(user._id);
    } else if (user?.role === Role.TOURIST) {
      filter.touristId = String(user._id);
    }
    if (query.status) {
      filter.status = query.status as string;
    }
    if (query.tourListingId) {
      filter.tourListingId = query.tourListingId as string;
    }

    if (query.fromDate || query.toDate) {
      (filter.requestedDate as unknown as Record<string, Date>) = {};
      if (query.fromDate) {
        (filter.requestedDate as unknown as Record<string, Date>).$gte = new Date(query.fromDate) as unknown as Date;
      }
      if (query.toDate) {
        (filter.requestedDate as unknown as Record<string, Date>).$lte = new Date(query.toDate) as unknown as Date;
      }
    }
    const initialModelQuery = Booking.find(filter).populate('tourListingId');
    const qb = new QueryBuilder(initialModelQuery, query as Record<string, string>);

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
  },

  cancelBooking: async (id: string, user: IUser) => {
    const booking = await Booking.findById(id);
    if (!booking) throw new Error('Booking not found');
    if (!user || (String(user._id) !== String(booking.touristId) && user.role !== Role.ADMIN)) {
      throw new Error('Not authorized to cancel');
    }
  }

};