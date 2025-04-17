import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { LoadingScreen } from "@/components/ui/loading-screen";

const Register = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate("/dashboard"); // ✅ Eingeloggt? → weiterleiten
      } else {
        setShowForm(true); // ✅ Nicht eingeloggt? → Formular anzeigen
      }
    }
  }, [user, loading, navigate]);

  if (loading || !showForm) {
    return <LoadingScreen message="Lade Registrierungsseite..." />;
  }

  return (
    <Layout>
      <div className="container py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default Register;
