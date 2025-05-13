
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Plus, FolderPlus } from "lucide-react";
import { useBulkUpload } from "@/contexts/BulkUploadContext";

interface ImageAssignButtonProps {
  imageUrl: string;
}

export function ImageAssignButton({ imageUrl }: ImageAssignButtonProps) {
  const { 
    articleForms, 
    assignImageToArticle, 
    createNewArticleWithImage 
  } = useBulkUpload();
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter for articles that don't have the maximum number of images yet
  const availableArticles = articleForms.filter(article => article.images.length < 4);
  
  const handleNewArticle = () => {
    createNewArticleWithImage(imageUrl);
    setIsOpen(false);
  };
  
  const handleAssignToArticle = (articleId: string) => {
    assignImageToArticle(imageUrl, articleId);
    setIsOpen(false);
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="w-full mt-2">
          <Plus className="h-4 w-4 mr-1" />
          Zuweisen
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={handleNewArticle}>
          <FolderPlus className="h-4 w-4 mr-2" />
          <span>Neuen Artikel erstellen</span>
        </DropdownMenuItem>
        
        {availableArticles.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {availableArticles.map(article => (
              <DropdownMenuItem 
                key={article.id} 
                onClick={() => handleAssignToArticle(article.id)}
              >
                <span>
                  {article.title || "Artikel"} ({article.images.length}/4 Bilder)
                </span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
