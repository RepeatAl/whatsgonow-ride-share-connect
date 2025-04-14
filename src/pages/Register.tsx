
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Register = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Automatically redirect to login page with signup mode
    navigate("/login");
  }, [navigate]);
  
  return (
    <Layout>
      <div className="container py-12 text-center">
        <p>Weiterleitung zur Registrierungsseite...</p>
      </div>
    </Layout>
  );
};

export default Register;
