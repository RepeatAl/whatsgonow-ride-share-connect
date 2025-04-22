
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function RegisterSuccess() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">
            Registrierung erfolgreich!
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Dein whatsgonow-Konto wurde erfolgreich erstellt. Du kannst dich jetzt einloggen und die Plattform nutzen.
          </p>
          <Button asChild variant="brand">
            <Link to="/login">Zum Login</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
