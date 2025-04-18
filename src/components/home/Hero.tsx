import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, Car } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Hero = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg
            className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
            fill="currentColor"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <main className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block xl:inline bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-blue">
                  Instantly Connect
                </span>{" "}
                <span className="block xl:inline">for Smart Deliveries</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Whatsgonow transforms everyday mobility into a decentralized, flexible logistics network. Send and receive packages through people who are already traveling your route.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                {user ? (
                  <>
                    <div className="rounded-md shadow">
                      <Link to="/find-transport">
                        <Button className="w-full flex items-center justify-center px-8 py-3 text-base font-medium">
                          <Package className="mr-2 h-5 w-5" />
                          Send Something
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 sm:ml-3">
                      <Link to="/offer-transport">
                        <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 text-base font-medium">
                          <Car className="mr-2 h-5 w-5" />
                          Become a Driver
                        </Button>
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md shadow">
                    <Link to="/pre-register">
                      <Button 
                        variant="brand" 
                        className="w-full flex items-center justify-center px-8 py-3 text-base font-medium"
                      >
                        Join Waiting List
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
          alt="Person delivering a package"
        />
      </div>
    </div>
  );
};

export default Hero;
