import { Schema, model } from 'mongoose';

const PaymentSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING','COMPLETED','FAILED'], default: 'PENDING' },
  paymentMethod: { type: String, required: true },
  transactionId: String,
  sslTransactionId: String
}, { timestamps: true });

export const Payment = model('Payment', PaymentSchema);