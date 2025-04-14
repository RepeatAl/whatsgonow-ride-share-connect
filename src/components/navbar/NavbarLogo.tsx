
import { Link } from "react-router-dom";

const NavbarLogo = () => {
  return (
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
  );
};

export default NavbarLogo;
