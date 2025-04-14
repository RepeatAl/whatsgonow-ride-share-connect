
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaymentStatus } from "@/types/payment";
import { TransportRequest, mockRequests } from "@/data/mockData";
import { supabase } from "@/integrations/supabase/client";

export const usePaymentStatus = (orderId: string | undefined) => {
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("pending");
  const [order, setOrder] = useState<TransportRequest | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [showDeliveryConfirmation, setShowDeliveryConfirmation] = useState(false);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setCurrentUser({ id: data.session.user.id });
      }
    };

    checkAuth();
  }, []);

  const { data: orderData, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const order = mockRequests.find(req => req.id === orderId);
      if (!order) {
        throw new Error("Order not found");
      }
      
      setOrder(order);
      if (order.paymentStatus) {
        setPaymentStatus(order.paymentStatus as PaymentStatus);
      }
      
      return order;
    }
  });

  const handleConfirmDelivery = () => {
    setShowDeliveryConfirmation(true);
  };

  return {
    paymentStatus,
    setPaymentStatus,
    order,
    setOrder,
    currentUser,
    isLoading,
    showDeliveryConfirmation,
    setShowDeliveryConfirmation,
    handleConfirmDelivery
  };
};
