
import Layout from "@/components/Layout";
import { PreRegistrationForm } from "@/components/pre-registration/PreRegistrationForm";

export default function PreRegister() {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Sei dabei, wenn whatsgonow startet!
          </h1>
          <p className="text-lg text-muted-foreground">
            Registriere dich jetzt für die Warteliste und sei einer der Ersten, die whatsgonow nutzen können.
          </p>
        </div>

        <PreRegistrationForm />
      </div>
    </Layout>
  );
}
