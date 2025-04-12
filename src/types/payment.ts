
export type PaymentStatus = "pending" | "reserved" | "paid" | "cancelled";

export interface PaymentDetails {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  reservationDate?: Date;
  paymentDate?: Date;
  paymentMethod: "paypal" | "credit_card" | "bank_transfer";
  reference: string;
}
