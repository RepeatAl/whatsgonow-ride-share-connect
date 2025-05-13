
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Save, Send, Trash2 } from "lucide-react";
import { useBulkUpload, ArticleForm } from "@/contexts/BulkUploadContext";

interface ArticleFormCardProps {
  articleId: string;
  onSave: (articleId: string, data: Partial<ArticleForm>) => void;
  onPublish: (articleId: string) => void;
  onDelete: (articleId: string) => void;
  suggestions: Record<string, any>;
}

export function ArticleFormCard({ 
  articleId, 
  onSave, 
  onPublish, 
  onDelete, 
  suggestions 
}: ArticleFormCardProps) {
  const { 
    getArticleById, 
    getImagesForArticle, 
    canPublishArticle, 
    updateArticle, 
    removeImageFromArticle 
  } = useBulkUpload();
  
  const article = getArticleById(articleId);
  const images = getImagesForArticle(articleId);
  
  if (!article) return null;
  
  // Get the first image suggestion for default title/category
  const firstImageUrl = images[0];
  const firstSuggestion = firstImageUrl ? suggestions[firstImageUrl] : null;
  
  // Local state for form fields
  const [title, setTitle] = React.useState(article.title || firstSuggestion?.title || '');
  const [category, setCategory] = React.useState(article.category || firstSuggestion?.category || '');
  
  // Handle form field changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateArticle(articleId, { title: e.target.value });
  };
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
    updateArticle(articleId, { category: e.target.value });
  };
  
  const handleSave = () => {
    onSave(articleId, { title, category });
  };
  
  const handlePublish = () => {
    if (canPublishArticle(articleId)) {
      onPublish(articleId);
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Artikel: {title || "Neuer Artikel"}</span>
          <Badge 
            variant="outline" 
            className={`${
              images.length < 2 ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"
            }`}
          >
            {images.length}/4 Bilder
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {/* Image thumbnails */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {images.map((imageUrl, index) => (
              <div key={`article-image-${index}`} className="relative h-24 bg-slate-50 rounded">
                <img
                  src={imageUrl}
                  alt={`Artikel Bild ${index + 1}`}
                  className="h-full w-full object-contain p-2"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0"
                  onClick={() => removeImageFromArticle(imageUrl)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          
          {/* Basic article form fields */}
          <div className="space-y-3">
            <FormItem>
              <FormLabel>Artikelname</FormLabel>
              <Input 
                value={title} 
                onChange={handleTitleChange} 
                placeholder="Artikelname eingeben" 
              />
            </FormItem>
            
            <FormItem>
              <FormLabel>Kategorie</FormLabel>
              <Input 
                value={category} 
                onChange={handleCategoryChange} 
                placeholder="Kategorie eingeben" 
              />
            </FormItem>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-1" />
          Als Entwurf speichern
        </Button>
        <Button 
          size="sm" 
          onClick={handlePublish}
          disabled={!canPublishArticle(articleId)}
          title={!canPublishArticle(articleId) ? "Mindestens 2 Bilder erforderlich" : ""}
        >
          <Send className="h-4 w-4 mr-1" />
          Veröffentlichen
        </Button>
      </CardFooter>
    </Card>
  );
}
