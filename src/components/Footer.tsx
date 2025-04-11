
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-blue">
              whatsgo<span className="text-brand-dark">now</span>
            </h3>
            <p className="text-gray-600 text-sm">
              The crowd-logistics platform for spontaneous and planned transports.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-brand-purple transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-purple transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-brand-purple transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Customers</h4>
            <ul className="space-y-2">
              <li><Link to="/find-transport" className="text-gray-600 hover:text-brand-purple text-sm">Find Transport</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-brand-purple text-sm">How It Works</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-brand-purple text-sm">Pricing</Link></li>
              <li><Link to="/safety" className="text-gray-600 hover:text-brand-purple text-sm">Safety & Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Drivers</h4>
            <ul className="space-y-2">
              <li><Link to="/offer-transport" className="text-gray-600 hover:text-brand-purple text-sm">Offer Transport</Link></li>
              <li><Link to="/driver-requirements" className="text-gray-600 hover:text-brand-purple text-sm">Requirements</Link></li>
              <li><Link to="/earnings" className="text-gray-600 hover:text-brand-purple text-sm">Earnings</Link></li>
              <li><Link to="/safety" className="text-gray-600 hover:text-brand-purple text-sm">Safety & Insurance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-brand-purple text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-brand-purple text-sm">Contact</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-brand-purple text-sm">Careers</Link></li>
              <li><Link to="/community-managers" className="text-gray-600 hover:text-brand-purple text-sm">Community Managers</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} whatsgonow. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="/terms" className="text-gray-500 hover:text-brand-purple text-sm">Terms of Service</Link>
              <Link to="/privacy" className="text-gray-500 hover:text-brand-purple text-sm">Privacy Policy</Link>
              <Link to="/cookies" className="text-gray-500 hover:text-brand-purple text-sm">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
