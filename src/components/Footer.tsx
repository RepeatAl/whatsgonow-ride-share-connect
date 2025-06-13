
// 🚨 LOCKED FILE – Do not edit without explicit CTO approval! (Stand: 13.06.2025)
// Änderungen an Footer, Legal, Privacy oder Map-Consent NUR nach schriftlicher Freigabe durch Christiane!

import React from "react";
import { Link } from "react-router-dom";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { getLocalizedUrl } = useLanguageMCP();

  return (
    <footer className="w-full py-6 px-4 md:px-6 bg-background border-t mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to={getLocalizedUrl("/")} className="flex items-center">
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
              <li><Link to={getLocalizedUrl("/find-transport")} className="text-muted-foreground hover:text-foreground transition-colors">Find Transport</Link></li>
              <li><Link to={getLocalizedUrl("/how-it-works")} className="text-muted-foreground hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link to={getLocalizedUrl("/faq")} className="text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
              <li><Link to={getLocalizedUrl("/safety")} className="text-muted-foreground hover:text-foreground transition-colors">Safety & Insurance</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-orange-500">For Drivers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={getLocalizedUrl("/offer-transport")} className="text-muted-foreground hover:text-foreground transition-colors">Offer Transport</Link></li>
              <li><Link to={getLocalizedUrl("/driver-requirements")} className="text-muted-foreground hover:text-foreground transition-colors">Requirements</Link></li>
              <li><Link to={getLocalizedUrl("/earnings")} className="text-muted-foreground hover:text-foreground transition-colors">Earnings</Link></li>
              <li><Link to={getLocalizedUrl("/pre-register")} className="text-muted-foreground hover:text-foreground transition-colors">Pre-Registration</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-orange-500">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to={getLocalizedUrl("/esg-dashboard")} className="text-muted-foreground hover:text-foreground transition-colors">ESG Dashboard</Link></li>
              <li><Link to={getLocalizedUrl("/about")} className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to={getLocalizedUrl("/privacy-policy")} className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to={getLocalizedUrl("/legal")} className="text-muted-foreground hover:text-foreground transition-colors">Legal & Terms</Link></li>
              <li><Link to={getLocalizedUrl("/legal#impressum")} className="text-muted-foreground hover:text-foreground transition-colors">Imprint</Link></li>
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
