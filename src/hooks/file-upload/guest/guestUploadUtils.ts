
import { v4 as uuidv4 } from "uuid";

export const generateGuestFileName = (originalName: string): string => {
  return `${uuidv4()}-${originalName}`;
};

export const generateGuestFilePath = (sessionId: string, fileName: string): string => {
  return `${sessionId}/${fileName}`;
};

export const generateMobileUploadUrl = (sessionId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/mobile-upload?session=${sessionId}`;
};

export const cleanupGuestSession = (): void => {
  localStorage.removeItem('whatsgonow-guest-session');
};

export const isSessionExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) <= new Date();
};

export const getTimeUntilExpiry = (expiresAt: string): number => {
  return Math.max(0, new Date(expiresAt).getTime() - new Date().getTime());
};

export const formatSessionExpiry = (expiresAt: string): string => {
  const hoursLeft = Math.floor(getTimeUntilExpiry(expiresAt) / (1000 * 60 * 60));
  
  if (hoursLeft < 1) return 'Läuft bald ab';
  if (hoursLeft < 24) return `${hoursLeft}h verbleibend`;
  
  const daysLeft = Math.floor(hoursLeft / 24);
  return `${daysLeft} Tage verbleibend`;
};
