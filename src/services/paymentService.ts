
import { v4 as uuidv4 } from "uuid";
import { PaymentStatus } from "@/types/payment";

// Mock PayPal payment service
export const paymentService = {
  // Simulate reserving a payment
  reservePayment: async (orderId: string, amount: number): Promise<{success: boolean; reference: string; status: PaymentStatus}> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      success: true,
      reference: `PAY-${orderId.substring(0, 4)}-${uuidv4().substring(0, 6).toUpperCase()}`,
      status: "reserved"
    };
  },
  
  // Simulate releasing a reserved payment
  releasePayment: async (reference: string): Promise<{success: boolean; status: PaymentStatus}> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
      success: true,
      status: "paid"
    };
  },
  
  // Simulate cancelling a payment reservation
  cancelPayment: async (reference: string): Promise<{success: boolean; status: PaymentStatus}> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      status: "cancelled"
    };
  },
  
  // Get payment status by reference
  getPaymentStatus: async (reference: string): Promise<PaymentStatus> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For mock, just return reserved
    return "reserved";
  }
};
