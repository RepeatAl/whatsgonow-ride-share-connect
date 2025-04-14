
import { ReactNode } from "react";

interface StatsGridProps {
  children: ReactNode;
}

export const StatsGrid = ({ children }: StatsGridProps) => {
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" 
      aria-label="Dashboard statistics"
    >
      {children}
    </div>
  );
};
