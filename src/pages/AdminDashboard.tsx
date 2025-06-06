import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { profile } = useOptimizedAuth();

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Zugriff verweigert</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Diese Seite ist nur für Administratoren zugänglich.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="admin">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Benutzer verwalten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Benutzerkonten anzeigen, bearbeiten und verwalten
              </p>
              <Link to="/admin/users">
                <Button className="w-full">
                  Benutzer anzeigen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Feedback-Nachrichten
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Anzeigen und verwalten von Benutzer-Feedback
              </p>
              <Link to="/admin/feedback">
                <Button variant="outline" className="w-full">
                  Feedback anzeigen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Eskalationen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Überprüfen und bearbeiten von eskalierten Nutzern
              </p>
              <Link to="/admin/escalations">
                <Button variant="outline" className="w-full">
                  Eskalationen anzeigen
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Statistiken
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Anzeigen von Anwendungsstatistiken
              </p>
              <Badge variant="secondary">In Entwicklung</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Protokolle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Anzeigen von Anwendungsprotokollen
              </p>
              <Badge variant="secondary">In Entwicklung</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Einstellungen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Anwendungseinstellungen verwalten
              </p>
              <Link to="/admin/settings">
                <Button variant="outline" className="w-full">
                  Einstellungen anzeigen
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
