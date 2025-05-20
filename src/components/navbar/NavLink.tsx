
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = 'font-bold text-brand-orange',
  exact = false,
  onClick,
}) => {
  const location = useLocation();
  const { getLocalizedUrl } = useLanguage();

  // Get the localized URL with language prefix
  const localizedTo = getLocalizedUrl(to);
  
  // Check if this link is active
  const isActive = exact
    ? location.pathname === localizedTo
    : location.pathname.startsWith(localizedTo);
  
  // Combine classes
  const linkClassName = `${className} ${isActive ? activeClassName : ''}`;

  return (
    <Link to={localizedTo} className={linkClassName} onClick={onClick}>
      {children}
    </Link>
  );
};

export default NavLink;
