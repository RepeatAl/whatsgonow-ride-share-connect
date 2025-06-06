import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Upload } from 'lucide-react';
import Layout from '@/components/Layout';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';

const CreateOrderWithItemsTest = () => {
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
              Neuen Auftrag erstellen (Test)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Hier kannst du einen neuen Auftrag mit Artikeln erstellen.
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Auftrag erstellen
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateOrderWithItemsTest;
