
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItemPhotoAnalysisGrid } from "./ItemPhotoAnalysisGrid";
import { MultiItemSuggestionBoxProps } from "./types";
import { useBulkUpload } from "@/contexts/BulkUploadContext";
import { WaitingQueueContainer } from "./WaitingQueueContainer";
import { ArticleFormCard } from "./ArticleFormCard";
import { ArticleForm } from "@/contexts/BulkUploadContext";
import { toast } from "sonner";

export function MultiItemSuggestionBox({
  suggestions,
  onAccept,
  onIgnore,
  form
}: MultiItemSuggestionBoxProps) {
  const { 
    queuedImages, 
    setQueuedImages, 
    articleForms,
    finalizeArticle
  } = useBulkUpload();

  // Initialisiere die Warteschleife mit allen Bildern bei erstem Rendering
  useEffect(() => {
    if (suggestions && Object.keys(suggestions).length > 0 && queuedImages.length === 0) {
      setQueuedImages(Object.keys(suggestions));
    }
  }, [suggestions, queuedImages.length, setQueuedImages]);

  if (!suggestions || Object.keys(suggestions).length === 0) {
    return null;
  }

  // Handler für das Speichern eines Artikels
  const handleSaveArticle = (articleId: string, data: Partial<ArticleForm>) => {
    finalizeArticle(articleId, 'draft');
    toast.success("Artikel als Entwurf gespeichert");
  };

  // Handler für das Veröffentlichen eines Artikels
  const handlePublishArticle = (articleId: string) => {
    finalizeArticle(articleId, 'published');
    toast.success("Artikel bereit zur Veröffentlichung");
  };

  // Handler für das Löschen eines Artikels
  const handleDeleteArticle = (articleId: string) => {
    // Implementierung für das Löschen von Artikeln
    // (wird in dieser Version nicht implementiert)
  };

  return (
    <div className="space-y-4">
      <Card className="mt-4 border-blue-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>KI-Vorschläge für {Object.keys(suggestions).length} Artikel</span>
            <Badge variant="outline" className="bg-blue-50">KI</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          {/* Warteschleife für nicht zugewiesene Bilder */}
          <WaitingQueueContainer suggestions={suggestions} />
          
          {/* Artikel-Formulare */}
          {articleForms.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium">Artikel in Bearbeitung</h3>
              {articleForms.map(article => (
                <ArticleFormCard 
                  key={article.id}
                  articleId={article.id}
                  onSave={handleSaveArticle}
                  onPublish={handlePublishArticle}
                  onDelete={handleDeleteArticle}
                  suggestions={suggestions}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
