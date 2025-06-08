
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";

export function RoleTabContent() {
  const { profile } = useOptimizedAuth();
  
  const getRoleTitle = (role: string | undefined) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return 'Administrator';
      case 'cm':
        return 'Community Manager';
      case 'driver':
        return 'Fahrer';
      case 'sender_private':
        return 'Privater Sender';
      case 'sender_business':
        return 'Business Sender';
      default:
        return 'Benutzer';
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{getRoleTitle(profile?.role)}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Hier kannst du deine rollenspezifischen Einstellungen verwalten.</p>
        {profile?.role && (
          <div className="mt-4 space-y-2">
            <p><strong>Aktuelle Rolle:</strong> {getRoleTitle(profile.role)}</p>
            <p><strong>Verifiziert:</strong> {profile.verified ? 'Ja' : 'Nein'}</p>
            {profile.can_become_driver && !profile.role.includes('driver') && (
              <p><strong>Kann Fahrer werden:</strong> Ja</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
