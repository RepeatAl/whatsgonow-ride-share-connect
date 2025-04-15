import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      navigate("/dashboard");
      return;
    }
    
    // Otherwise redirect to login page with signup mode
    navigate("/login?signup=true");
  }, [navigate, user]);
  
  return (
    <Layout>
      <div className="container py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Weiterleitung zur Registrierungsseite...</p>
      </div>
    </Layout>
  );
};

export default Register;
