
import { TransportRequest } from "@/data/mockData";

// Function to format date as DD.MM.YYYY
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

// This will gather all the data needed for the receipt
export const prepareReceiptData = async (orderId: string) => {
  try {
    // In a real app, we would fetch from Supabase
    // For now, we'll mock the data based on our mockData structure
    const { mockRequests } = await import('@/data/mockData');
    const order = mockRequests.find(req => req.id === orderId);
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    return {
      orderId: order.id,
      date: new Date().toISOString(),
      sender: {
        name: "Max Mustermann", // In real app: fetch from users table
        address: order.origin
      },
      driver: {
        name: "Delivery Driver", // In real app: fetch from users table
        id: "driver-123"
      },
      price: order.price,
      route: {
        origin: order.origin,
        destination: order.destination,
        distance: `${Math.round(Math.random() * 20 + 5)} km` // Mock distance
      },
      weight: `${order.weight} kg`,
      rating: order.rating || "Keine Bewertung",
      status: "abgeschlossen"
    };
  } catch (error) {
    console.error("Error preparing receipt data:", error);
    throw error;
  }
};
