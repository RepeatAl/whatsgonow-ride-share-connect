
import { ClipboardCheck } from 'lucide-react';
import AdminToolCard from './AdminToolCard';

const KYCValidationTool = () => {
  return (
    <AdminToolCard
      title="KYC-Validierung"
      description="Überprüfung von Nutzeridentitäten und Dokumenten für die Plattform."
      icon={ClipboardCheck}
      status="active"
      href="/admin/validation"
    />
  );
};

export default KYCValidationTool;
