
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { LucideIcon } from 'lucide-react';

export interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  name?: string;
  tooltip?: string;
  badge?: number;
}

const NavLink: React.FC<NavLinkProps> = ({
  to,
  children,
  className = '',
  activeClassName = 'font-bold text-brand-orange',
  exact = false,
  onClick,
  // Die neuen Props werden hier nicht direkt verwendet,
  // sie sind für die übergeordneten Komponenten verfügbar
  icon: _icon,
  name: _name,
  tooltip: _tooltip,
  badge: _badge,
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
