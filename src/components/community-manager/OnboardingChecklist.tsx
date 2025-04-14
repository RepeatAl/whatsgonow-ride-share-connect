
import { User } from "@supabase/supabase-js";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, HelpCircle, AlertCircle } from "lucide-react";

interface OnboardingChecklistProps {
  manager: any;
  user: User | null;
}

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "not-started" | "attention";
  route?: string;
}

const OnboardingChecklist = ({ manager, user }: OnboardingChecklistProps) => {
  // Generate checklist items based on manager data
  const getChecklist = (): ChecklistItem[] => {
    const items: ChecklistItem[] = [
      {
        id: "profile",
        title: "Profil vervollständigen",
        description: "Profilbild und Kontaktdaten hinzufügen",
        status: user?.user_metadata?.name ? "completed" : "not-started",
        route: "/profile"
      },
      {
        id: "region",
        title: "Region zugewiesen",
        description: "Dir wurde eine Region zugewiesen",
        status: manager?.region ? "completed" : "attention",
        route: "/profile"
      },
      {
        id: "commission",
        title: "Provisionsrate festgelegt",
        description: "Deine Provision für vermittelte Transporte",
        status: manager?.commission_rate !== undefined ? "completed" : "not-started"
      },
      {
        id: "first_moderation",
        title: "Erste Moderation",
        description: "Bearbeite deinen ersten Supportfall",
        status: "not-started",
        route: "/support"
      },
      {
        id: "verification",
        title: "KYC-Verifikation abgeschlossen",
        description: "Identitätsprüfung für Community Manager",
        status: "in-progress"
      }
    ];
    
    return items;
  };
  
  const checklist = getChecklist();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Circle className="h-5 w-5 text-blue-500" />;
      case "attention":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      default:
        return <HelpCircle className="h-5 w-5 text-gray-300" />;
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Erledigt</Badge>;
      case "in-progress":
        return <Badge variant="secondary">In Arbeit</Badge>;
      case "attention":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Achtung</Badge>;
      default:
        return <Badge variant="outline">Ausstehend</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {checklist.map((item) => (
        <div key={item.id} className="flex items-start gap-3 py-2">
          <div className="mt-0.5">
            {getStatusIcon(item.status)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{item.title}</h3>
              {getStatusBadge(item.status)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnboardingChecklist;
