
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return <div className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-blue/10 z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Teile deine Fahrt, <span className="text-brand-orange">verbinde</span> Menschen
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-lg">
              Whatsgonow ist die Plattform, die spontane und planbare Transporte zwischen Auftraggebern und mobilen Fahrern vermittelt.
            </p>

            <div className="flex flex-col items-center gap-4 pt-4">
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <Button asChild size="lg" variant="brand">
                  <Link to="/login">Anmelden</Link>
                </Button>
                
                <Button asChild size="lg" variant="outline">
                  <Link to="/faq">Mehr erfahren</Link>
                </Button>
              </div>
              
              <Button asChild size="lg" variant="brand" className="w-full max-w-md mt-2 bg-brand-orange hover:bg-brand-orange/90">
                <Link to="/pre-register" className="px-0">Dabeisein wenn Whatsgonow startet</Link>
              </Button>
            </div>
          </div>

          <div className="flex justify-center">
            <img src="/lovable-uploads/910fd168-e7e1-4688-bd5d-734fb140c7df.png" alt="Whatsgonow Platform" className="w-full max-w-md rounded-lg shadow-lg" />
          </div>
        </div>
      </div>
    </div>;
};
export default Hero;
