
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AnalysisStatus } from "../../ItemDetailsSection/types";

interface PreviewImageProps {
  preview: string;
  index: number;
  onRemove: (index: number) => void;
  isUploading?: boolean;
  isAssigned?: boolean;
  analysisState?: AnalysisStatus;
  handleCreateArticle: (previewUrl: string) => void;
  handleAssignToArticle: (previewUrl: string, articleId: string) => void;
  handleAnalyzeImage: (index: number) => void;
  articleForms: Array<{ id: string; title?: string }>;
  onAnalyze?: (index: number) => void;
}

export const PreviewImage: React.FC<PreviewImageProps> = ({
  preview,
  index,
  onRemove,
  isUploading,
  isAssigned,
  analysisState,
  handleCreateArticle,
  handleAssignToArticle,
  handleAnalyzeImage,
  articleForms,
  onAnalyze
}) => {
  const previewUrl = typeof preview === "string" ? preview : "";
  
  return (
    <>
      <img
        src={previewUrl}
        alt={`Foto ${index + 1}`}
        className="w-full h-full object-cover rounded transition-opacity duration-200"
        loading="lazy"
      />
      
      {/* Analysis Status Badge */}
      {analysisState && (
        <div className="absolute top-1 left-1">
          <Badge 
            className={`text-xs ${
              analysisState === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
              analysisState === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 
              'bg-red-100 text-red-800 border-red-200'
            }`}
          >
            {analysisState === 'pending' ? 'Analyse läuft...' : 
             analysisState === 'success' ? 'Analysiert' : 
             'Fehler'}
          </Badge>
        </div>
      )}
      
      {/* Assignment Badge */}
      {isAssigned && (
        <div className="absolute top-1 right-8">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Zugewiesen
          </Badge>
        </div>
      )}
      
      {/* Remove Button */}
      <Button 
        type="button" 
        variant="destructive" 
        size="icon" 
        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
        onClick={(e) => {
          e.stopPropagation();
          onRemove(index);
        }}
        disabled={isUploading}
      >
        <X className="h-4 w-4" />
      </Button>
      
      {/* Assignment Menu for existing images */}
      {!isAssigned && previewUrl && (
        <div className="absolute bottom-1 right-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                type="button" 
                variant="secondary" 
                size="icon" 
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={(e) => e.stopPropagation()} 
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => handleCreateArticle(previewUrl)}>
                Neuen Artikel erstellen
              </DropdownMenuItem>
              {articleForms.map(article => (
                <DropdownMenuItem 
                  key={article.id} 
                  onClick={() => handleAssignToArticle(previewUrl, article.id)}
                >
                  {article.title || `Artikel ${article.id.slice(0, 5)}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      
      {/* Analyze button - only if not already analyzed */}
      {!analysisState && onAnalyze && (
        <div className="absolute bottom-1 left-1">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-7 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              handleAnalyzeImage(index);
            }}
          >
            Analysieren
          </Button>
        </div>
      )}
    </>
  );
};
