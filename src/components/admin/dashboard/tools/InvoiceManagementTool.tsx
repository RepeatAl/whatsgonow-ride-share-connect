
import { FileSpreadsheet } from 'lucide-react';
import AdminToolCard from './AdminToolCard';

const InvoiceManagementTool = () => {
  return (
    <AdminToolCard
      title="Rechnungsverwaltung"
      description="Prüfung und Validierung von Rechnungen, XRechnungs-Export."
      icon={FileSpreadsheet}
      disabled={true}
    />
  );
};

export default InvoiceManagementTool;
