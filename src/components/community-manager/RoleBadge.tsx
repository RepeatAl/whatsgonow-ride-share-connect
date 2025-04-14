
import { Badge } from "@/components/ui/badge";

interface RoleBadgeProps {
  role: string;
}

const RoleBadge = ({ role }: RoleBadgeProps) => {
  switch (role) {
    case "driver":
      return <Badge variant="secondary">Fahrer</Badge>;
    case "sender":
      return <Badge>Auftraggeber</Badge>;
    case "cm":
      return <Badge variant="outline">Community Manager</Badge>;
    case "admin":
      return <Badge className="bg-blue-500">Admin</Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

export default RoleBadge;
