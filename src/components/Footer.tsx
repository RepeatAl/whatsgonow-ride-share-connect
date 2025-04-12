
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/910fd168-e7e1-4688-bd5d-734fb140c7df.png" 
                alt="whatsgonow logo" 
                className="h-10 mr-2" 
              />
              <span className="text-2xl font-bold">
                whats<span className="text-brand-orange">go</span>now
              </span>
            </Link>
            <p className="text-gray-600 text-sm">
              The crowd-logistics platform for spontaneous and planned transports.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-500 hover:text-brand-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-brand-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-brand-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li><Link to="/find-transport" className="text-gray-600 hover:text-brand-primary text-sm">Find Transport</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-brand-primary text-sm">How It Works</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-brand-primary text-sm">Pricing</Link></li>
              <li><Link to="/safety" className="text-gray-600 hover:text-brand-primary text-sm">Safety & Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Drivers</h4>
            <ul className="space-y-2">
              <li><Link to="/offer-transport" className="text-gray-600 hover:text-brand-primary text-sm">Offer Transport</Link></li>
              <li><Link to="/driver-requirements" className="text-gray-600 hover:text-brand-primary text-sm">Requirements</Link></li>
              <li><Link to="/earnings" className="text-gray-600 hover:text-brand-primary text-sm">Earnings</Link></li>
              <li><Link to="/safety" className="text-gray-600 hover:text-brand-primary text-sm">Safety & Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-brand-primary text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-primary text-sm">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-primary text-sm">Careers</Link></li>
              <li><Link to="/community-managers" className="text-gray-600 hover:text-brand-primary text-sm">Community Managers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} whatsgonow. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0 justify-center">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-brand-primary text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-brand-primary text-sm">Terms of Service</Link>
              <Link to="/cookies" className="text-gray-500 hover:text-brand-primary text-sm">Cookie Policy</Link>
              <Link to="/data-deletion" className="text-gray-500 hover:text-brand-primary text-sm">Data Deletion</Link>
              <Link to="/imprint" className="text-gray-500 hover:text-brand-primary text-sm">Imprint</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
