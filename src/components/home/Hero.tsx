
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const Hero = () => {
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
              <Button asChild size="lg" variant="brand" className="w-full max-w-md">
                <Link to="/pre-register" className="px-0">Dabeisein wenn Whatsgonow startet</Link>
              </Button>
              
              <Button asChild size="lg" variant="outline" className="w-full max-w-md">
                <Link to="/faq">Mehr erfahren</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-center relative">
          {!videoError ? (
            <div className="relative">
              <button
                onClick={toggleMute}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                aria-label={isMuted ? "Ton einschalten" : "Ton ausschalten"}
              >
                {isMuted ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <video 
                className="w-full max-w-md rounded-lg shadow-lg"
                autoPlay
                muted={isMuted}
                loop
                playsInline
                onError={() => setVideoError(true)}
              >
                <source 
                  src="https://orgcruwmxqiwnjnkxpjb.supabase.co/storage/v1/object/public/explainvideo1/Whatsgonow-Whatsabout-Klein.mp4" 
                  type="video/mp4" 
                />
              </video>
            </div>
          ) : (
            <img 
              src="/lovable-uploads/910fd168-e7e1-4688-bd5d-734fb140c7df.png" 
              alt="Whatsgonow Platform" 
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          )}
        </div>
      </div>
    </div>
  </div>;
};

export default Hero;
