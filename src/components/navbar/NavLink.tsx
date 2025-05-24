
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
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
  const { getLocalizedUrl, currentLanguage } = useLanguageMCP();

  // Get the localized URL with language prefix
  const localizedTo = getLocalizedUrl(to);
  
  // Check if this link is active
  // We need to compare against the localized URL and also against the non-localized URL
  // This ensures active state works correctly regardless of language prefix
  const localizedPath = location.pathname;
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const plainPath = pathSegments.length > 1 ? '/' + pathSegments.slice(1).join('/') : '/';
  
  const isActive = exact
    ? (localizedPath === localizedTo || plainPath === to)
    : (localizedPath.startsWith(localizedTo) || (to !== '/' && plainPath.startsWith(to)));
  
  // Combine classes
  const linkClassName = `${className} ${isActive ? activeClassName : ''}`;

  // Handle click including any passed onClick
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link to={localizedTo} className={linkClassName} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default NavLink;
