
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguageMCP } from '@/mcp/language/LanguageMCP';
import Layout from '@/components/Layout';

const Debug: React.FC = () => {
  const location = useLocation();
  const { currentLanguage, supportedLanguages } = useLanguageMCP();

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
        
        <div className="space-y-4">
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Router Info</h3>
            <p>Current Path: {location.pathname}</p>
            <p>Search: {location.search}</p>
            <p>Hash: {location.hash}</p>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Language MCP</h3>
            <p>Current Language: {currentLanguage}</p>
            <p>Supported Languages: {supportedLanguages.map(l => l.code).join(', ')}</p>
          </div>
          
          <div className="p-4 border rounded">
            <h3 className="font-semibold">Browser Info</h3>
            <p>Navigator Language: {navigator.language}</p>
            <p>URL: {window.location.href}</p>
            <p>LocalStorage i18nextLng: {localStorage.getItem('i18nextLng')}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Debug;
