
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function PreRegisterSuccess() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Voranmeldung erfolgreich!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Vielen Dank für dein Interesse an whatsgonow. Wir informieren dich, sobald die Plattform live geht.
          </p>
          <Button asChild>
            <Link to="/">Zurück zur Startseite</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
