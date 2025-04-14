
/**
 * Utility functions for invoice formatting and calculations
 */

export const generateInvoiceNumber = (orderId: string): string => {
  // Format: RE-YEAR-ORDERID (shortened)
  const year = new Date().getFullYear();
  const shortOrderId = orderId.substring(0, 8);
  return `RE-${year}-${shortOrderId}`;
};

export const calculateDueDate = (invoiceDate: Date, daysUntilDue: number = 14): string => {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + daysUntilDue);
  return dueDate.toISOString().split('T')[0];
};

export const formatCurrency = (amount: number): string => {
  return amount.toFixed(2) + ' €';
};

// Updated to accept either two address strings or an order object
export const getServiceDescription = (originOrOrder: string | any, destination?: string): string => {
  // If first argument is an object (like an order), extract origin and destination from it
  if (typeof originOrOrder === 'object' && originOrOrder !== null) {
    const order = originOrOrder;
    return `Transportdienstleistung von ${order.from_address || 'Startpunkt'} nach ${order.to_address || 'Zielpunkt'}`;
  }
  
  // Original behavior with two string arguments
  return `Transportdienstleistung von ${originOrOrder} nach ${destination || 'Zielpunkt'}`;
};
