
import React, { ReactNode } from 'react';

interface AdminToolsGridProps {
  children: ReactNode;
}

const AdminToolsGrid = ({ children }: AdminToolsGridProps) => {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Admin-Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};

export default AdminToolsGrid;
