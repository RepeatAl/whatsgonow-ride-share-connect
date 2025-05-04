
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useChatContextState() {
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const location = useLocation();

  // Check if we're in a chat or inbox route
  const isInChatRoute = location.pathname.includes("/inbox");
  const currentOrderIdFromPath = isInChatRoute 
    ? location.pathname.split("/").filter(Boolean)[1] 
    : null;

  // Update active order ID when route changes
  useEffect(() => {
    if (currentOrderIdFromPath) {
      setActiveOrderId(currentOrderIdFromPath);
    } else if (isInChatRoute) {
      // Just in /inbox without specific order
      setActiveOrderId(null);
    }
  }, [location.pathname, currentOrderIdFromPath, isInChatRoute]);

  return {
    activeOrderId,
    setActiveOrderId
  };
}
