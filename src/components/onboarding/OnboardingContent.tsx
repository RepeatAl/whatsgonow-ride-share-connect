
import { UserRole } from "@/types/auth";
import { CheckSquare, Car, Package, HelpCircle } from "lucide-react";

interface OnboardingStep {
  title: string;
  description: string;
  icon: JSX.Element;
}

export const getOnboardingSteps = (role?: string): OnboardingStep[] => {
  // Common first step for all users
  const commonSteps: OnboardingStep[] = [
    {
      title: "Willkommen bei Whatsgonow!",
      description: "Wir freuen uns, dass du da bist. Lass uns gemeinsam starten.",
      icon: <HelpCircle className="h-12 w-12 text-brand-purple mb-4" />,
    }
  ];

  // Role-specific steps
  const roleSteps: Record<UserRole, OnboardingStep[]> = {
    sender_private: [
      {
        title: "Sendungen aufgeben",
        description: "Erstelle einen Auftrag und beschreibe was transportiert werden soll.",
        icon: <Package className="h-12 w-12 text-blue-500 mb-4" />,
      },
      {
        title: "Verfolge deine Sendungen",
        description: "Behalte den Überblick über deine laufenden Aufträge und den Status deiner Sendungen.",
        icon: <CheckSquare className="h-12 w-12 text-green-500 mb-4" />,
      }
    ],
    sender_business: [
      {
        title: "Geschäftssendungen verwalten",
        description: "Verwalte deine Geschäftsaufträge und nutze erweiterte Funktionen wie Rechnungsstellung.",
        icon: <Package className="h-12 w-12 text-blue-500 mb-4" />,
      },
      {
        title: "Analysiere deine Aktivitäten",
        description: "Nutze das Business-Dashboard für detaillierte Einblicke in deine Sendungen.",
        icon: <CheckSquare className="h-12 w-12 text-green-500 mb-4" />,
      }
    ],
    driver: [
      {
        title: "Finde passende Aufträge",
        description: "Durchsuche verfügbare Aufträge in deiner Region und biete deine Transportdienste an.",
        icon: <Car className="h-12 w-12 text-blue-500 mb-4" />,
      },
      {
        title: "Verdiene flexibel",
        description: "Akzeptiere Aufträge und verdiene Geld mit deinen Fahrten.",
        icon: <CheckSquare className="h-12 w-12 text-green-500 mb-4" />,
      }
    ],
    cm: [
      {
        title: "Community Management",
        description: "Verwalte und unterstütze die Whatsgonow Community in deiner Region.",
        icon: <CheckSquare className="h-12 w-12 text-green-500 mb-4" />,
      }
    ],
    admin: [
      {
        title: "Administrator Dashboard",
        description: "Verwalte Benutzer und Systemeinstellungen.",
        icon: <CheckSquare className="h-12 w-12 text-blue-500 mb-4" />,
      }
    ],
    admin_limited: [
      {
        title: "Eingeschränkter Administrator",
        description: "Verwalte ausgewählte Systemfunktionen.",
        icon: <CheckSquare className="h-12 w-12 text-blue-500 mb-4" />,
      }
    ]
  };

  return [...commonSteps, ...(role && role in roleSteps ? roleSteps[role as UserRole] : [])];
};
