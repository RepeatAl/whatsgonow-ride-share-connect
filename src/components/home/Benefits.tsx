
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Leaf, 
  DollarSign, 
  Users
} from "lucide-react";

const Benefits = () => {
  return (
    <section className="py-16 container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold">Vorteile von Whatsgonow</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
          Whatsgonow bringt viele Vorteile für Auftraggeber und Fahrer
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <BenefitCard 
          icon={<Clock className="h-6 w-6 text-brand-orange" />}
          title="Zeitersparnis" 
          description="Spare Zeit durch effiziente Zustellung und einfache Vermittlung"
        />
        
        <BenefitCard 
          icon={<DollarSign className="h-6 w-6 text-brand-orange" />}
          title="Kosteneinsparung" 
          description="Reduziere Transportkosten und schaffe zusätzliche Einnahmequellen"
        />
        
        <BenefitCard 
          icon={<Leaf className="h-6 w-6 text-brand-orange" />}
          title="Umweltfreundlich" 
          description="Weniger Leerfahrten bedeuten weniger CO₂-Emissionen"
        />
        
        <BenefitCard 
          icon={<ShieldCheck className="h-6 w-6 text-brand-orange" />}
          title="Sicherheit" 
          description="Verifizierte Profile und Bewertungssystem für mehr Sicherheit"
        />
        
        <BenefitCard 
          icon={<TrendingUp className="h-6 w-6 text-brand-orange" />}
          title="Flexibilität" 
          description="Plane Transporte spontan oder im Voraus nach deinen Bedürfnissen"
        />
        
        <BenefitCard 
          icon={<Users className="h-6 w-6 text-brand-orange" />}
          title="Community" 
          description="Werde Teil einer wachsenden Community von Fahrern und Auftraggebern"
        />
      </div>
    </section>
  );
};

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <Card className="border-none shadow hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-2">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Benefits;
