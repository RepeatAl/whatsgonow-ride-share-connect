
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  // Redirect based on user role
  React.useEffect(() => {
    if (profile) {
      const role = profile.role;
      if (role === "driver") {
        navigate("/dashboard/driver");
      } else if (role === "cm") {
        navigate("/dashboard/cm");
      } else if (role === "sender" || role === "contractor") {
        navigate("/dashboard/sender");
      } else if (role === "admin" || role === "super_admin") {
        navigate("/admin/dashboard");
      }
    }
  }, [profile, navigate]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-lg">Einen Moment bitte, Sie werden weitergeleitet...</p>
      </div>
    </Layout>
  );
};

export default Dashboard;
