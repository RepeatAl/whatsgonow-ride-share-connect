
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DataDeletion = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Layout>
      <div className="container max-w-2xl px-4 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Zurück zur Startseite
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Antrag auf Datenlöschung</h1>
          <p className="text-gray-600 mb-4">
            Gemäß DSGVO haben Sie das Recht, die Löschung Ihrer persönlichen Daten zu beantragen.
          </p>
        </div>

        {isSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-green-800 mb-2">Vielen Dank!</h2>
            <p className="mb-4">
              Ihr Antrag auf Datenlöschung wurde erfolgreich eingereicht. Wir werden ihn so schnell wie möglich bearbeiten.
            </p>
            <Button asChild>
              <Link to="/">Zurück zur Startseite</Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="mb-4">
              Um die Löschung Ihrer Daten zu beantragen, füllen Sie bitte das folgende Formular aus oder kontaktieren Sie unseren Support.
            </p>
            <Button onClick={() => setIsSubmitted(true)}>
              Löschantrag stellen
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DataDeletion;
