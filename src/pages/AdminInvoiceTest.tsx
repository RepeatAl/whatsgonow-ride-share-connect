
import React from 'react';
import Layout from '@/components/Layout';
import { SendTestInvoiceSMSButton } from '@/components/admin/SendTestInvoiceSMSButton';
import { TestInvoiceResults } from '@/components/admin/TestInvoiceResults';

const AdminInvoiceTest = () => {
  // Debug-Log beim Laden der Komponente
  React.useEffect(() => {
    console.log("🔍 AdminInvoiceTest-Komponente wurde geladen");
  }, []);

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Rechnungsversand Testen</h1>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">SMS Test-Flow</h2>
              <p className="text-sm text-gray-600 mb-4">
                Dieser Test erstellt eine Beispielrechnung und versendet sie per SMS mit PIN-Schutz.
                Sie können den erhaltenen Link dann auf einem Mobilgerät testen.
              </p>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <p className="text-yellow-700">
                  <strong>Hinweis:</strong> Diese Seite ist temporär öffentlich zugänglich für Testzwecke.
                </p>
              </div>
            </div>
            
            <SendTestInvoiceSMSButton />
            
            <TestInvoiceResults />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminInvoiceTest;
