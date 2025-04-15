
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { DeliveryConfirmation } from "@/components/delivery/DeliveryConfirmation";
import { toast } from "@/hooks/use-toast";

const DeliveryConfirmationPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [orderId, setOrderId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token) {
        toast({
          title: "Fehler",
          description: "Ungültiger Token für die Lieferbestätigung.",
          variant: "destructive"
        });
        navigate("/");
        return;
      }

      try {
        // Fetch the order associated with this token
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("order_id, sender_id")
          .eq("qr_code_token", token)
          .single();

        if (orderError || !orderData) {
          toast({
            title: "Ungültiger Token",
            description: "Der Bestätigungslink ist ungültig oder abgelaufen.",
            variant: "destructive"
          });
          navigate("/");
          return;
        }

        // Set the order and sender IDs
        setOrderId(orderData.order_id);
        setUserId(orderData.sender_id);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast({
          title: "Fehler",
          description: "Beim Laden der Lieferdetails ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
        navigate("/");
      }
    };

    fetchOrderDetails();
  }, [token, navigate]);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  const handleConfirmed = () => {
    // Redirect to dashboard or order tracking page after confirmation
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DeliveryConfirmation 
      orderId={orderId}
      userId={userId}
      isOpen={isOpen}
      onClose={handleClose}
      onConfirmed={handleConfirmed}
    />
  );
};

export default DeliveryConfirmationPage;
