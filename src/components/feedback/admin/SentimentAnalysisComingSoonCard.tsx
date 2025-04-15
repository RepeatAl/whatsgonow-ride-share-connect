
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

export const SentimentAnalysisComingSoonCard = () => {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-800/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-indigo-500" />
          <span>KI-Sentiment-Analyse</span>
        </CardTitle>
        <CardDescription>
          Automatische Stimmungsanalyse für Feedback-Kommentare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>In Kürze verfügbar: Nutzen Sie die Kraft der KI, um Feedback-Kommentare automatisch zu analysieren und Stimmungstrends zu erkennen.</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Klassifizierung nach positiv, neutral, negativ</li>
            <li>Erkennung von wichtigen Themen</li>
            <li>Priorisierung von kritischem Feedback</li>
            <li>Wöchentliche KI-Zusammenfassungen</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100/50 dark:hover:bg-indigo-800/20">
          Für Beta anmelden
        </Button>
      </CardFooter>
    </Card>
  );
};
