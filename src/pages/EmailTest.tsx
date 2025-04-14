
import Layout from "@/components/Layout";
import TestEmailSender from "@/components/email/TestEmailSender";

const EmailTest = () => {
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8 text-center">E-Mail-Funktionstest</h1>
        <div className="max-w-md mx-auto">
          <TestEmailSender />
        </div>
        
        <div className="mt-10 p-6 bg-gray-50 rounded-lg max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Über diesen Test</h2>
          <p className="mb-3">
            Diese Seite testet die Edge Function für E-Mail-Versand über:
          </p>
          <pre className="bg-gray-100 p-3 rounded text-sm mb-4 overflow-auto">
            https://orgcruwmxqiwnjnkxpjb.supabase.co/functions/v1/send-email
          </pre>
          
          <h3 className="font-medium mb-2">Was getestet wird:</h3>
          <ul className="list-disc pl-5 space-y-1 mb-4">
            <li>Generierung eines PDF-Dokuments im Browser</li>
            <li>Erstellung einer XML-Datei im XRechnung-Format</li>
            <li>Aufbau einer multipart/form-data Anfrage mit beiden Anhängen</li>
            <li>Authentifizierung mit dem SMTP-Server über die Edge Function</li>
            <li>Versand an die konfigurierte E-Mail-Adresse</li>
          </ul>
          
          <p className="text-sm text-gray-600">
            Auf Erfolg oder Misserfolg des Tests wird mit einem Toast und einer Statusmeldung hingewiesen.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default EmailTest;
