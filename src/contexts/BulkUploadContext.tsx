
import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

// Article form status types
export type ArticleFormStatus = 'draft' | 'pending' | 'published';

// Article form structure
export interface ArticleForm {
  id: string;
  images: string[];
  status: ArticleFormStatus;
  title?: string;
  category?: string;
}

// Context interface
interface BulkUploadContextType {
  // State
  queuedImages: string[];
  imageToArticleMap: Record<string, string>;
  articleForms: ArticleForm[];
  activeArticleId: string | null;
  
  // Actions
  setQueuedImages: (images: string[]) => void;
  assignImageToArticle: (imageUrl: string, articleId: string) => void;
  createNewArticleWithImage: (imageUrl: string) => string;
  removeImageFromArticle: (imageUrl: string) => void;
  finalizeArticle: (articleId: string, status: ArticleFormStatus) => void;
  setActiveArticle: (articleId: string | null) => void;
  getArticleById: (articleId: string) => ArticleForm | undefined;
  getImagesForArticle: (articleId: string) => string[];
  updateArticle: (articleId: string, data: Partial<ArticleForm>) => void;
  clearAllData: () => void;
  canPublishArticle: (articleId: string) => boolean;
}

// Create context with default values
const BulkUploadContext = createContext<BulkUploadContextType>({
  queuedImages: [],
  imageToArticleMap: {},
  articleForms: [],
  activeArticleId: null,
  
  setQueuedImages: () => {},
  assignImageToArticle: () => {},
  createNewArticleWithImage: () => "",
  removeImageFromArticle: () => {},
  finalizeArticle: () => {},
  setActiveArticle: () => {},
  getArticleById: () => undefined,
  getImagesForArticle: () => [],
  updateArticle: () => {},
  clearAllData: () => {},
  canPublishArticle: () => false,
});

export const BulkUploadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queuedImages, setQueuedImages] = useState<string[]>([]);
  const [imageToArticleMap, setImageToArticleMap] = useState<Record<string, string>>({});
  const [articleForms, setArticleForms] = useState<ArticleForm[]>([]);
  const [activeArticleId, setActiveArticle] = useState<string | null>(null);
  
  // Helper function to generate a unique ID for articles
  const generateArticleId = useCallback(() => {
    return `article-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);
  
  // Assign an image to an article
  const assignImageToArticle = useCallback((imageUrl: string, articleId: string) => {
    // Check if the article exists
    const articleExists = articleForms.some(article => article.id === articleId);
    if (!articleExists) {
      toast.error("Der ausgewählte Artikel existiert nicht");
      return;
    }
    
    // Check if the article already has 4 images
    const articleImages = articleForms.find(article => article.id === articleId)?.images || [];
    if (articleImages.length >= 4) {
      toast.error("Artikel hat bereits die maximale Anzahl an Bildern (4)");
      return;
    }
    
    // Update the image-to-article mapping
    setImageToArticleMap(prev => ({
      ...prev,
      [imageUrl]: articleId
    }));
    
    // Add the image to the article's images array
    setArticleForms(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, images: [...article.images, imageUrl] } 
          : article
      )
    );
    
    // Remove the image from the queue
    setQueuedImages(prev => prev.filter(image => image !== imageUrl));
    
    toast.success("Bild wurde dem Artikel zugewiesen");
  }, [articleForms]);
  
  // Create a new article with an initial image
  const createNewArticleWithImage = useCallback((imageUrl: string) => {
    const newArticleId = generateArticleId();
    
    // Create new article form
    setArticleForms(prev => [
      ...prev,
      {
        id: newArticleId,
        images: [imageUrl],
        status: 'draft'
      }
    ]);
    
    // Update the image-to-article mapping
    setImageToArticleMap(prev => ({
      ...prev,
      [imageUrl]: newArticleId
    }));
    
    // Remove the image from the queue
    setQueuedImages(prev => prev.filter(image => image !== imageUrl));
    
    // Set the new article as active
    setActiveArticle(newArticleId);
    
    toast.success("Neuer Artikel mit Bild erstellt");
    return newArticleId;
  }, [generateArticleId]);
  
  // Remove an image from an article
  const removeImageFromArticle = useCallback((imageUrl: string) => {
    // Find which article the image belongs to
    const articleId = imageToArticleMap[imageUrl];
    if (!articleId) {
      toast.error("Das Bild ist keinem Artikel zugewiesen");
      return;
    }
    
    // Remove the image from the article
    setArticleForms(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, images: article.images.filter(img => img !== imageUrl) } 
          : article
      )
    );
    
    // Remove the image from the mapping
    setImageToArticleMap(prev => {
      const newMap = { ...prev };
      delete newMap[imageUrl];
      return newMap;
    });
    
    // Add the image back to the queue
    setQueuedImages(prev => [...prev, imageUrl]);
    
    toast.success("Bild wurde aus dem Artikel entfernt");
  }, [imageToArticleMap]);
  
  // Finalize an article (mark as ready for publishing or save as draft)
  const finalizeArticle = useCallback((articleId: string, status: ArticleFormStatus) => {
    setArticleForms(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, status } 
          : article
      )
    );
    
    // If we're marking as published, validate the article first
    const article = articleForms.find(a => a.id === articleId);
    if (status === 'published' && article) {
      if (article.images.length < 2) {
        toast.error("Der Artikel benötigt mindestens 2 Bilder, um veröffentlicht zu werden");
        return false;
      }
    }
    
    toast.success(status === 'published' 
      ? "Artikel bereit zur Veröffentlichung" 
      : "Artikel als Entwurf gespeichert"
    );
    
    return true;
  }, [articleForms]);
  
  // Get article by ID
  const getArticleById = useCallback((articleId: string) => {
    return articleForms.find(article => article.id === articleId);
  }, [articleForms]);
  
  // Get images for a specific article
  const getImagesForArticle = useCallback((articleId: string) => {
    const article = articleForms.find(a => a.id === articleId);
    return article?.images || [];
  }, [articleForms]);
  
  // Update article data
  const updateArticle = useCallback((articleId: string, data: Partial<ArticleForm>) => {
    setArticleForms(prev => 
      prev.map(article => 
        article.id === articleId 
          ? { ...article, ...data } 
          : article
      )
    );
  }, []);
  
  // Clear all bulk upload data
  const clearAllData = useCallback(() => {
    setQueuedImages([]);
    setImageToArticleMap({});
    setArticleForms([]);
    setActiveArticle(null);
  }, []);
  
  // Check if an article can be published (has at least 2 images)
  const canPublishArticle = useCallback((articleId: string) => {
    const article = articleForms.find(a => a.id === articleId);
    return article ? article.images.length >= 2 : false;
  }, [articleForms]);
  
  return (
    <BulkUploadContext.Provider
      value={{
        queuedImages,
        imageToArticleMap,
        articleForms,
        activeArticleId,
        
        setQueuedImages,
        assignImageToArticle,
        createNewArticleWithImage,
        removeImageFromArticle,
        finalizeArticle,
        setActiveArticle,
        getArticleById,
        getImagesForArticle,
        updateArticle,
        clearAllData,
        canPublishArticle
      }}
    >
      {children}
    </BulkUploadContext.Provider>
  );
};

// Custom hook to use this context
export const useBulkUpload = () => {
  const context = useContext(BulkUploadContext);
  if (!context) {
    throw new Error("useBulkUpload must be used within a BulkUploadProvider");
  }
  return context;
};
