
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="bg-gradient-to-r from-brand-purple to-brand-blue py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Transform How You Send & Deliver?
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-white opacity-90 mx-auto">
            Join thousands of users already revolutionizing logistics with whatsgonow
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link to="/register">
                <Button className="bg-white hover:bg-gray-50 text-brand-purple px-8 py-6 text-lg">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
