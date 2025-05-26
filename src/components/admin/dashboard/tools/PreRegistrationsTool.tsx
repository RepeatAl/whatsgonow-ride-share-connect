
import { FileText } from 'lucide-react';
import AdminToolCard from './AdminToolCard';

const PreRegistrationsTool = () => {
  return (
    <AdminToolCard
      title="Vorregistrierungen"
      description="Zugriff auf Vorregistrierungsdaten und Export der Informationen."
      icon={FileText}
      status="active"
      href="/admin/pre-registrations"
    />
  );
};

export default PreRegistrationsTool;
