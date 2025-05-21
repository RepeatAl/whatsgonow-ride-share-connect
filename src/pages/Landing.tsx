
import React from "react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Willkommen bei Whatsgonow</h1>
          <p className="text-xl mb-8 max-w-2xl">
            Die Plattform für spontane und planbare Transporte zwischen privaten oder 
            kleingewerblichen Auftraggebern und mobilen Fahrern.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild className="px-8 py-6 text-lg" variant="brand">
              <Link to="/register">Jetzt registrieren</Link>
            </Button>
            <Button asChild className="px-8 py-6 text-lg" variant="outline">
              <Link to="/login">Anmelden</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Landing;
