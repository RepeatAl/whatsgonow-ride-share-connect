
import { useNavigate } from "react-router-dom";
import { useDealConfirmation } from "@/hooks/use-deal-confirmation";
import { useDealData } from "@/hooks/use-deal-data";
import { useDealRating } from "@/hooks/use-deal-rating";
import { DealHeader } from "@/components/deal/DealHeader";
import { QRCodeSection } from "@/components/deal/QRCodeSection";
import { DealInfoGrid } from "@/components/deal/DealInfoGrid";
import { StatusSection } from "@/components/deal/StatusSection";
import { RatingSection } from "@/components/deal/RatingSection";
import { DeliveryConfirmation } from "@/components/delivery/DeliveryConfirmation";
import { DealLoading } from "@/components/deal/DealLoading";
import { DealNotFound } from "@/components/deal/DealNotFound";
import { ChatBox } from "@/features/chat/components/ChatBox";
import RatingModal from "@/components/rating/RatingModal";

interface ChatInterfaceProps {
  orderId: string;
  order: any;
  currentStatus: string;
}

const ChatInterface = ({ orderId, order, currentStatus }: ChatInterfaceProps) => {
  const recipientId = order?.contractor_id || order?.driver_id;
  const isEnabled = currentStatus !== "cancelled" && currentStatus !== "delivered";

  if (!recipientId) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-4">Chat mit {order?.contractor_name || order?.driver_name}</h3>
      <div className="bg-background rounded-lg h-96">
        <ChatBox
          orderId={orderId}
          recipientId={recipientId}
          userName={order?.contractor_name || order?.driver_name}
          orderDescription={order?.description}
        />
      </div>
    </div>
  );
};

interface DealContentProps {
  orderId: string;
  navigateToOfferTransport: () => void;
}

export const DealContent = ({ orderId, navigateToOfferTransport }: DealContentProps) => {
  const navigate = useNavigate();
  
  // Use our custom hooks
  const {
    order,
    isLoading,
    status,
    statusUpdateTime,
    currentUser,
    handleStatusUpdate
  } = useDealData(orderId, navigateToOfferTransport);

  const {
    showRatingModal,
    setShowRatingModal,
    hasRated
  } = useDealRating(orderId, status, order?.paymentStatus);

  const {
    isProcessingPayment,
    showQRCode,
    setShowQRCode,
    showDeliveryConfirmation,
    setShowDeliveryConfirmation,
    qrCodeValue,
    setQrCodeValue,
    handleReservePayment,
    handleQRScan,
    handleDeliveryConfirmed
  } = useDealConfirmation(orderId, order, currentUser);

  const handleStartTracking = () => {
    navigate(`/tracking/${orderId}`);
  };

  const handleViewPaymentStatus = () => {
    navigate(`/payment-status/${orderId}`);
  };

  if (isLoading) {
    return <DealLoading />;
  }

  if (!order) {
    return <DealNotFound />;
  }

  return (
    <div className="flex flex-col h-full">
      <DealHeader 
        order={order}
        isProcessingPayment={isProcessingPayment}
        handleReservePayment={handleReservePayment}
        handleViewPaymentStatus={handleViewPaymentStatus}
        handleStartTracking={handleStartTracking}
      />
      
      {showQRCode && (
        <QRCodeSection
          qrCodeValue={qrCodeValue}
          isProcessingPayment={isProcessingPayment}
          setShowQRCode={setShowQRCode}
          handleQRScan={handleQRScan}
        />
      )}
      
      <DealInfoGrid 
        order={order}
        handleStartTracking={handleStartTracking}
        setShowQRCode={setShowQRCode}
      />

      <StatusSection 
        status={status}
        statusUpdateTime={statusUpdateTime}
        onStatusUpdate={handleStatusUpdate}
      />

      {order.paymentStatus === "paid" && status === "delivered" && (
        <RatingSection 
          orderId={orderId}
          userId="driver-123"
          currentUserId="current-user"
          hasRated={hasRated}
          role="driver"
        />
      )}

      <ChatInterface orderId={orderId} order={order} currentStatus={status} />
      
      <RatingModal 
        isOpen={showRatingModal} 
        onClose={() => setShowRatingModal(false)} 
        userId="driver-123"
        orderId={orderId}
        userName="Max Mustermann"
      />

      {currentUser && (
        <DeliveryConfirmation
          orderId={orderId}
          userId={currentUser.id}
          isOpen={showDeliveryConfirmation}
          onClose={() => setShowDeliveryConfirmation(false)}
          onConfirmed={handleDeliveryConfirmed}
        />
      )}
    </div>
  );
};
