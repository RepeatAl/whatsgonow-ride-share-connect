
import React from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Truck, 
  Package, 
  Shield, 
  Crown,
  ArrowRight,
  MapPin,
  MessageCircle,
  Euro,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardWelcome = () => {
  const { profile } = useOptimizedAuth();
  const { getLocalizedUrl } = useLanguageMCP();

  const getRoleInfo = () => {
    switch (profile?.role) {
      case 'sender_private':
        return {
          icon: <Package className="h-8 w-8 text-blue-500" />,
          title: 'Privater Versender',
          description: 'Erstelle Aufträge und finde zuverlässige Fahrer für deine Transporte.',
          stats: [
            { label: 'Aktive Aufträge', value: '3', icon: <Package className="h-4 w-4" />, color: 'text-blue-600' },
            { label: 'Abgeschlossene Transporte', value: '12', icon: <TrendingUp className="h-4 w-4" />, color: 'text-green-600' },
            { label: 'Gesparte Kosten', value: '€245', icon: <Euro className="h-4 w-4" />, color: 'text-emerald-600' }
          ],
          primaryAction: { 
            label: 'Neuen Auftrag erstellen', 
            href: getLocalizedUrl('/orders/create'),
            icon: <Package className="h-4 w-4" />
          },
          secondaryActions: [
            { label: 'Meine Aufträge', href: getLocalizedUrl('/dashboard/sender') },
            { label: 'Adressbuch', href: getLocalizedUrl('/addresses') }
          ]
        };
      
      case 'sender_business':
        return {
          icon: <Package className="h-8 w-8 text-green-500" />,
          title: 'Business Versender',
          description: 'Verwalte Unternehmenstransporte mit erweiterten Tools und Analytics.',
          stats: [
            { label: 'Aktive Aufträge', value: '18', icon: <Package className="h-4 w-4" />, color: 'text-blue-600' },
            { label: 'Team-Mitglieder', value: '5', icon: <User className="h-4 w-4" />, color: 'text-purple-600' },
            { label: 'Monatliche Ersparnis', value: '€1,240', icon: <Euro className="h-4 w-4" />, color: 'text-emerald-600' }
          ],
          primaryAction: { 
            label: 'Business Dashboard', 
            href: getLocalizedUrl('/dashboard/sender'),
            icon: <ArrowRight className="h-4 w-4" />
          },
          secondaryActions: [
            { label: 'Team verwalten', href: getLocalizedUrl('/team') },
            { label: 'Analytics', href: getLocalizedUrl('/analytics') }
          ]
        };
      
      case 'driver':
        return {
          icon: <Truck className="h-8 w-8 text-orange-500" />,
          title: 'Fahrer',
          description: 'Finde Aufträge in deiner Region und verdiene mit flexiblen Fahrdiensten.',
          stats: [
            { label: 'Verfügbare Aufträge', value: '12', icon: <Package className="h-4 w-4" />, color: 'text-blue-600' },
            { label: 'Aktive Fahrten', value: '3', icon: <Truck className="h-4 w-4" />, color: 'text-orange-600' },
            { label: 'Verdienst heute', value: '€127,50', icon: <Euro className="h-4 w-4" />, color: 'text-emerald-600' }
          ],
          primaryAction: { 
            label: 'Verfügbare Aufträge', 
            href: getLocalizedUrl('/dashboard'),
            icon: <MapPin className="h-4 w-4" />
          },
          secondaryActions: [
            { label: 'Meine Fahrten', href: getLocalizedUrl('/rides') },
            { label: 'Fahrzeug verwalten', href: getLocalizedUrl('/vehicle') }
          ]
        };
      
      case 'cm':
        return {
          icon: <Shield className="h-8 w-8 text-purple-500" />,
          title: 'Community Manager',
          description: 'Betreue Nutzer in deiner Region und sorge für Qualität in der Community.',
          stats: [
            { label: 'Betreute Nutzer', value: '157', icon: <User className="h-4 w-4" />, color: 'text-purple-600' },
            { label: 'Offene Tickets', value: '4', icon: <MessageCircle className="h-4 w-4" />, color: 'text-orange-600' },
            { label: 'Qualitätsscore', value: '94%', icon: <TrendingUp className="h-4 w-4" />, color: 'text-emerald-600' }
          ],
          primaryAction: { 
            label: 'CM Dashboard', 
            href: getLocalizedUrl('/dashboard/cm'),
            icon: <Shield className="h-4 w-4" />
          },
          secondaryActions: [
            { label: 'Nutzer verwalten', href: getLocalizedUrl('/users') },
            { label: 'Support-Tickets', href: getLocalizedUrl('/support') }
          ]
        };
      
      case 'admin':
      case 'super_admin':
        return {
          icon: <Crown className="h-8 w-8 text-red-500" />,
          title: profile.role === 'super_admin' ? 'Super Administrator' : 'Administrator',
          description: 'Vollzugriff auf System-Management, Nutzer-Administration und Analytics.',
          stats: [
            { label: 'Registrierte Nutzer', value: '2,340', icon: <User className="h-4 w-4" />, color: 'text-blue-600' },
            { label: 'Aktive Aufträge', value: '89', icon: <Package className="h-4 w-4" />, color: 'text-orange-600' },
            { label: 'System Health', value: '99.8%', icon: <TrendingUp className="h-4 w-4" />, color: 'text-emerald-600' }
          ],
          primaryAction: { 
            label: 'Admin Dashboard', 
            href: getLocalizedUrl('/dashboard/admin'),
            icon: <Crown className="h-4 w-4" />
          },
          secondaryActions: [
            { label: 'Erweiterte Tools', href: getLocalizedUrl('/admin-enhanced') },
            { label: 'System-Tests', href: getLocalizedUrl('/system-tests') }
          ]
        };
      
      default:
        return {
          icon: <User className="h-8 w-8 text-gray-500" />,
          title: 'Willkommen',
          description: 'Vervollständige dein Profil, um alle Funktionen nutzen zu können.',
          stats: [
            { label: 'Profil-Status', value: '60%', icon: <User className="h-4 w-4" />, color: 'text-orange-600' },
            { label: 'Nächste Schritte', value: '3', icon: <Clock className="h-4 w-4" />, color: 'text-blue-600' },
            { label: 'Verfügbare Features', value: '8', icon: <Package className="h-4 w-4" />, color: 'text-purple-600' }
          ],
          primaryAction: { 
            label: 'Profil vervollständigen', 
            href: getLocalizedUrl('/profile'),
            icon: <User className="h-4 w-4" />
          },
          secondaryActions: [
            { label: 'Hilfe & FAQ', href: getLocalizedUrl('/faq') }
          ]
        };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">
            Willkommen zurück{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hier findest du eine Übersicht über deine Möglichkeiten auf der Whatsgonow-Plattform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roleInfo.stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <div className={`${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Information Card */}
        <Card className="border-2">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-3 mb-2">
              {roleInfo.icon}
              <div>
                <CardTitle className="text-xl">{roleInfo.title}</CardTitle>
                <Badge variant="outline" className="mt-1">
                  {profile?.role || 'Unbekannt'}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground">{roleInfo.description}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Actions */}
            <div className="space-y-4">
              {/* Primary Action */}
              <Link to={roleInfo.primaryAction.href}>
                <Button size="lg" className="w-full">
                  {roleInfo.primaryAction.icon}
                  <span className="ml-2">{roleInfo.primaryAction.label}</span>
                </Button>
              </Link>

              {/* Secondary Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {roleInfo.secondaryActions.map((action, index) => (
                  <Link key={index} to={action.href}>
                    <Button variant="outline" className="w-full">
                      {action.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-1">Nachrichten</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Kommuniziere mit anderen Nutzern
              </p>
              <Link to={getLocalizedUrl('/inbox')}>
                <Button variant="outline" size="sm" className="w-full">
                  Zur Inbox
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <User className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-1">Mein Profil</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Persönliche Daten verwalten
              </p>
              <Link to={getLocalizedUrl('/profile')}>
                <Button variant="outline" size="sm" className="w-full">
                  Zum Profil
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <h3 className="font-semibold mb-1">Live-Karte</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Aktuelle Aufträge & Fahrer
              </p>
              <Link to={getLocalizedUrl('/')}>
                <Button variant="outline" size="sm" className="w-full">
                  Zur Karte
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* System Status (nur für Admins) */}
        {(profile?.role === 'admin' || profile?.role === 'super_admin') && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-blue-800 mb-2">
                <Crown className="h-4 w-4" />
                <span className="font-semibold">Admin-Hinweise</span>
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• System läuft stabil</p>
                <p>• Alle Services verfügbar</p>
                <p>• Letzte Aktualisierung: Heute</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardWelcome;
