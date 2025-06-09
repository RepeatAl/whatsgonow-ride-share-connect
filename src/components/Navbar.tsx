
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { GlobalLanguageSwitcher } from '@/components/language/GlobalLanguageSwitcher';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getNavLinks = () => {
    if (!user || !profile) {
      return [
        { href: getLocalizedUrl('/'), label: 'Startseite', icon: Home },
        { href: getLocalizedUrl('/about'), label: 'Über uns' },
        { href: getLocalizedUrl('/faq'), label: 'FAQ' },
      ];
    }

    // HARMONISIERT: Deutsche Bezeichnungen für alle Navigation-Links
    const baseLinks = [
      { href: getLocalizedUrl('/'), label: 'Startseite', icon: Home },
      { href: getLocalizedUrl('/dashboard'), label: 'Dashboard' },
      { href: getLocalizedUrl('/inbox'), label: 'Nachrichten' },
    ];

    // Role-specific links
    if (profile.role === 'driver') {
      baseLinks.push({ href: getLocalizedUrl('/rides'), label: 'Meine Fahrten' });
    }

    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={getLocalizedUrl('/')} className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-orange-600">
              Whatsgonow
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors ${
                  location.pathname === link.href ? 'text-orange-600 font-medium' : ''
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <GlobalLanguageSwitcher variant="outline" showLabel={false} />

            {user && profile ? (
              /* Authenticated User Menu */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">
                      {profile.first_name || 'Profil'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {profile.first_name && profile.last_name 
                      ? `${profile.first_name} ${profile.last_name}`
                      : user.email
                    }
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to={getLocalizedUrl('/profile')} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={getLocalizedUrl('/dashboard')} className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="flex items-center text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Abmelden
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Guest User Actions */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to={getLocalizedUrl('/login')}>Anmelden</Link>
                </Button>
                <Button asChild>
                  <Link to={getLocalizedUrl('/register')}>Registrieren</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <GlobalLanguageSwitcher variant="compact" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menü"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded ${
                    location.pathname === link.href ? 'text-orange-600 bg-orange-50' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              
              {user && profile ? (
                <>
                  <hr className="my-2" />
                  <Link
                    to={getLocalizedUrl('/profile')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profil
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <LogOut className="h-4 w-4" />
                    Abmelden
                  </button>
                </>
              ) : (
                <>
                  <hr className="my-2" />
                  <Link
                    to={getLocalizedUrl('/login')}
                    className="block px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded"
                    onClick={() => setIsOpen(false)}
                  >
                    Anmelden
                  </Link>
                  <Link
                    to={getLocalizedUrl('/register')}
                    className="block px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Registrieren
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
