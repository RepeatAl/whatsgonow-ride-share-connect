
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { useNavigate } from "react-router-dom";
import { Shield, User, Settings, ChevronRight } from "lucide-react";
import { useLanguageMCP } from "@/mcp/language/LanguageMCP";

const Profile = () => {
  const { t } = useTranslation(["common"]);
  const { user, profile } = useOptimizedAuth();
  const navigate = useNavigate();
  const { getLocalizedUrl } = useLanguageMCP();
  const [activeTab, setActiveTab] = useState("profile");

  if (!user || !profile) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p>Profil wird geladen...</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Role-based visibility
  const isAdmin = profile.role === 'admin' || profile.role === 'super_admin';
  const isCM = profile.role === 'cm';
  const isDriver = profile.role === 'driver';
  const isSender = profile.role?.startsWith('sender');
  
  const showDriverSection = isDriver || profile.can_become_driver;
  const showBusinessSection = profile.role === 'sender_business';
  const showCMSection = isCM || isAdmin;
  const showAdminSection = isAdmin;
  const canBecomeDriver = !isDriver && profile.can_become_driver;

  const handleNavigateToDashboard = () => {
    // Rollenbasierte Dashboard-Navigation
    switch (profile.role) {
      case 'admin':
      case 'super_admin':
        navigate(getLocalizedUrl('/dashboard/admin'));
        break;
      case 'cm':
        navigate(getLocalizedUrl('/dashboard/cm'));
        break;
      case 'driver':
        navigate(getLocalizedUrl('/dashboard/driver'));
        break;
      case 'sender_private':
      case 'sender_business':
        navigate(getLocalizedUrl('/dashboard/sender'));
        break;
      default:
        navigate(getLocalizedUrl('/dashboard'));
    }
  };

  const handleNavigateToEnhancedAdmin = () => {
    navigate(getLocalizedUrl('/admin-enhanced'));
  };

  return (
    <Layout pageType="profile">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {t("common:navigation.profile", "Profil")}
                </h1>
                <p className="text-muted-foreground">
                  Verwalte deine Kontoinformationen und Einstellungen
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleNavigateToDashboard} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Zum Dashboard
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {isAdmin && (
                  <Button 
                    onClick={handleNavigateToEnhancedAdmin}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Enhanced Admin
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Profile Overview Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {profile.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <CardTitle className="text-xl">
                      {profile.first_name && profile.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : user.email
                      }
                    </CardTitle>
                    <p className="text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={isAdmin ? "destructive" : isCM ? "default" : "secondary"}>
                    {profile.role === 'admin' && 'Administrator'}
                    {profile.role === 'super_admin' && 'Super Admin'}
                    {profile.role === 'cm' && 'Community Manager'}
                    {profile.role === 'driver' && 'Fahrer'}
                    {profile.role === 'sender_private' && 'Privater Sender'}
                    {profile.role === 'sender_business' && 'Business Sender'}
                    {!profile.role && 'Benutzer'}
                  </Badge>
                  
                  {profile.verified && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      ✓ Verifiziert
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Region:</span>
                  <p className="text-muted-foreground">{profile.region || 'Nicht angegeben'}</p>
                </div>
                <div>
                  <span className="font-medium">Stadt:</span>
                  <p className="text-muted-foreground">{profile.city || 'Nicht angegeben'}</p>
                </div>
                <div>
                  <span className="font-medium">Profil vollständig:</span>
                  <p className="text-muted-foreground">
                    {profile.profile_complete ? '✓ Ja' : '⚠ Nein'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <ProfileTabs
            profile={profile}
            userId={user.id}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showDriverSection={showDriverSection}
            showBusinessSection={showBusinessSection}
            showCMSection={showCMSection}
            showAdminSection={showAdminSection}
            canBecomeDriver={canBecomeDriver}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
