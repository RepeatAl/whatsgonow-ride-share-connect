
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
          <p className="text-lg text-muted-foreground mb-4">
            Vielen Dank für dein Interesse an whatsgonow. Wir haben dir (falls technisch möglich) eine Bestätigungs-E-Mail geschickt.
            <br/>Bitte klicke auf den Bestätigungslink in dieser E-Mail, um deinen Zugang zu aktivieren.
            <br/>Danach kannst du dich jederzeit einloggen!
          </p>
          <p className="text-base text-gray-500 mb-8">
            Sollte die E-Mail nicht ankommen, prüfe deinen Spam-Ordner oder versuch es später erneut.
          </p>
          <Button asChild>
            <Link to="/">Zurück zur Startseite</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
