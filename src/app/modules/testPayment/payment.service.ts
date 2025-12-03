import axios from 'axios';
import { envVars } from '../../config/env';
import { Booking } from '../booking/booking.modal';
import { IPayment, PAYMENT_STATUS } from '../payment/payment.interface';
import { IUser } from '../testUser/user.modal';
import { Payment } from './payment.model';

import { BookingStatus } from '../booking/booking.modal';

export const PaymentService = {
  createPaymentSession: async (payload: Record<string, string>, user: IUser) => {
    if (!payload.bookingId) throw new Error('bookingId required');
    const booking = await Booking.findById(payload.bookingId);
    if (!booking) throw new Error('Booking not found');

    const sslPayload = {
      store_id: envVars.SSL.STORE_ID,
      store_passwd: envVars.SSL.STORE_PASS,
      total_amount: booking.totalPrice,
      currency: 'BDT',
      tran_id: `tran_${booking._id}_${Date.now()}`,
      success_url: `${envVars.FRONTEND_URL}/payments/success`,
      fail_url: `${envVars.FRONTEND_URL}/payments/fail`,
      cancel_url: `${envVars.FRONTEND_URL}/payments/cancel`,
      ipn_url: `${envVars.FRONTEND_URL}/api/payments/ipn`,
      cus_name: user?.name || 'Guest',
      cus_email: user?.email || 'no-reply@example.com'
    };

    const initUrl = envVars.SSL.SSL_PAYMENT_API;
    const resp = await axios.post(initUrl, sslPayload);
    const data = resp.data;

    const payment = await Payment.create({ bookingId: booking._id, amount: booking.totalPrice, status: PAYMENT_STATUS.UNPAID as PAYMENT_STATUS, paymentMethod: 'SSLCOMMERZ' });
    return { checkoutUrl: data?.GatewayPageURL || null, payment: payment as unknown as IPayment };
  },

  handleIPN: async (ipnPayload: Record<string, string>) => {
    const tran_id = ipnPayload.tran_id || ipnPayload.tran_id;
    const bookingId = (tran_id || '').split('_')[1];
    const booking = await Booking.findById(bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    if (ipnPayload.status === 'VALID' || ipnPayload.status === 'SUCCESS') {
      booking.status = BookingStatus.COMPLETED as BookingStatus;
      booking.paymentId = ipnPayload.val_id || ipnPayload.tran_id as string;
      await booking.save();
      await Payment.findOneAndUpdate({ bookingId: booking._id }, { status: PAYMENT_STATUS.PAID as PAYMENT_STATUS | 'PAID' });
      return { success: true };
    }

    await Payment.findOneAndUpdate({ bookingId: booking._id }, { status: PAYMENT_STATUS.FAILED as PAYMENT_STATUS | 'FAILED' });
    booking.status = BookingStatus.CANCELLED as BookingStatus;
    await booking.save();
    return { success: false };
  },

  payoutToGuide: async (bookingId: string) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');
    if (booking.status !== BookingStatus.COMPLETED) throw new Error('Booking not completed yet');
    const payout = await Payment.create({ bookingId: booking._id, amount: booking.totalPrice, status: PAYMENT_STATUS.PAID as PAYMENT_STATUS | 'PAID', paymentMethod: 'PAYOUT' });
    await booking.save();
    return payout;
  }
};