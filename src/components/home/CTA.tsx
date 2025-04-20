
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-16 bg-brand-orange text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Bereit für effizientere Transporte?
        </h2>
        
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Registriere dich jetzt bei whatsgonow und entdecke, wie einfach du Transporte organisieren oder als Fahrer Geld verdienen kannst.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="default" className="bg-white text-brand-orange hover:bg-gray-100">
            <Link to="/register">Jetzt kostenlos registrieren</Link>
          </Button>
          
          <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
            <Link to="/faq">Mehr erfahren</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
