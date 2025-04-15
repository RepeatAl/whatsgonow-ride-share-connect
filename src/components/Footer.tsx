
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-4 md:px-6 bg-background border-t mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/910fd168-e7e1-4688-bd5d-734fb140c7df.png" 
                alt="whatsgonow logo" 
                className="h-8 mr-2" 
              />
              <span className="text-xl font-bold">
                whats<span className="text-brand-orange">go</span>now
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The crowd-logistics platform for spontaneous and planned transports.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-orange-500">For Customers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/find-transport" className="text-muted-foreground hover:text-foreground transition-colors">Find Transport</Link></li>
              <li><Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link to="/faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to="/safety" className="text-muted-foreground hover:text-foreground transition-colors">Safety & Insurance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-orange-500">For Drivers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/offer-transport" className="text-muted-foreground hover:text-foreground transition-colors">Offer Transport</Link></li>
              <li><Link to="/driver-requirements" className="text-muted-foreground hover:text-foreground transition-colors">Requirements</Link></li>
              <li><Link to="/earnings" className="text-muted-foreground hover:text-foreground transition-colors">Earnings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-orange-500">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link to="/imprint" className="text-muted-foreground hover:text-foreground transition-colors">Imprint</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} whatsgonow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
