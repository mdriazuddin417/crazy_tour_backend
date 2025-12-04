/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export enum PAYMENT_STATUS {
    PAID = "PAID",
    UNPAID = "UNPAID",
    CANCELLED = "CANCELLED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}

export enum PAYMENT_METHOD {
    CASH = "CASH",
    ONLINE = "ONLINE",
    BANK_TRANSFER = "BANK_TRANSFER",
    CHEQUE = "CHEQUE",
    OTHER = "OTHER"
}
export interface IPayment {
    booking: Types.ObjectId;
    transactionId: string;
    amount: number;
    paymentGatewayData?: any
    invoiceUrl?: string
    status: PAYMENT_STATUS
}