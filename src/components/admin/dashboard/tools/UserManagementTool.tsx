
import { UserCheck } from 'lucide-react';
import AdminToolCard from './AdminToolCard';

const UserManagementTool = () => {
  return (
    <AdminToolCard
      title="Nutzerverwaltung"
      description="Verwaltung von Nutzerkonten, Rollen und Berechtigungen."
      icon={UserCheck}
      disabled={true}
    />
  );
};

export default UserManagementTool;
