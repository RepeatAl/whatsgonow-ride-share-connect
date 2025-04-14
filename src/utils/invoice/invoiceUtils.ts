
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

export const getServiceDescription = (origin: string, destination: string): string => {
  return `Transportdienstleistung von ${origin} nach ${destination}`;
};
