
import React from 'react';

interface StatsGridProps {
  children: React.ReactNode;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
};

export default StatsGrid;
