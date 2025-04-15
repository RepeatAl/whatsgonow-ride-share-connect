
import React from 'react';
import { Card } from '@/components/ui/card';

interface TestInvoiceResultsProps {
  result: {
    invoiceId?: string;
    downloadLink?: string;
    pin?: string;
  } | null;
}

export const TestInvoiceResults = ({ result }: TestInvoiceResultsProps) => {
  if (!result) return null;

  return (
    <Card className="p-4 space-y-2 bg-muted">
      <h3 className="font-medium">Test-Ergebnisse:</h3>
      <div className="space-y-1 text-sm">
        <p><span className="font-medium">Rechnungs-ID:</span> {result.invoiceId}</p>
        <p>
          <span className="font-medium">Download-Link:</span> <br/>
          <a href={result.downloadLink} 
             target="_blank" 
             rel="noopener noreferrer" 
             className="text-blue-600 hover:underline break-all">
            {result.downloadLink}
          </a>
        </p>
        <p><span className="font-medium">PIN:</span> {result.pin}</p>
      </div>
    </Card>
  );
};
