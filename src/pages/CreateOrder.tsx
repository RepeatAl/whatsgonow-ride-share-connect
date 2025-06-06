import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, MapPin, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

const CreateOrder = () => {
  const { profile } = useOptimizedAuth();

  if (!profile) {
    return (
      <Layout pageType="authenticated">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>Nicht angemeldet</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Bitte melde dich an, um fortzufahren.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageType="authenticated">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Neuen Auftrag erstellen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Hier kannst du einen neuen Transportauftrag erstellen.
            </p>
            <Button>
              <MapPin className="h-4 w-4 mr-2" />
              Adresse hinzufügen
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Datum auswählen
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateOrder;
