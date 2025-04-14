
import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status?: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) return null;
  
  switch (status) {
    case "offen":
      return <Badge variant="outline" className="ml-2">Offen</Badge>;
    case "matched":
      return <Badge variant="secondary" className="ml-2">Matched</Badge>;
    case "unterwegs":
      return <Badge className="bg-blue-500 text-white ml-2">Unterwegs</Badge>;
    case "abgeschlossen":
      return <Badge className="bg-green-500 text-white ml-2">Abgeschlossen</Badge>;
    default:
      return <Badge variant="outline" className="ml-2">{status}</Badge>;
  }
};

export default StatusBadge;
