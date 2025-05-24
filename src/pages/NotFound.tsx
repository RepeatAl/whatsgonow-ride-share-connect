
import React from 'react';
import Layout from '@/components/Layout';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="container py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Seite nicht gefunden</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Die angeforderte Seite konnte nicht gefunden werden.
        </p>
        <p className="text-sm text-muted-foreground">
          Aktueller Pfad: {window.location.pathname}
        </p>
      </div>
    </Layout>
  );
};

export default NotFound;
