
import React, { useState, useEffect, useCallback } from 'react';
import { useOptimizedAuth } from '@/contexts/OptimizedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadedImage {
  name: string;
  url: string;
  created_at: string;
  metadata?: any;
}

export default function ImageGallery() {
  const { user } = useOptimizedAuth();
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // FIXED: Stabilized loadUserImages with useCallback to prevent infinite re-renders
  const loadUserImages = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .storage
        .from('items-images')
        .list(user.id, {
          limit: 50,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error loading images:', error);
        toast({
          title: "Fehler beim Laden",
          description: "Bilder konnten nicht geladen werden.",
          variant: "destructive"
        });
        return;
      }

      if (data) {
        const imageList: UploadedImage[] = data
          .filter(item => item.name && !item.name.includes('.emptyFolderPlaceholder'))
          .map(item => {
            const { data: urlData } = supabase
              .storage
              .from('items-images')
              .getPublicUrl(`${user.id}/${item.name}`);
            
            return {
              name: item.name,
              url: urlData.publicUrl,
              created_at: item.created_at || '',
              metadata: item.metadata
            };
          });

        setImages(imageList);
      }
    } catch (error) {
      console.error('Error loading user images:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]); // FIXED: Only depend on user.id, not entire user object

  // FIXED: Only run effect when user.id changes, not on every render
  useEffect(() => {
    loadUserImages();
  }, [loadUserImages]);

  const deleteImage = useCallback(async (imageName: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .storage
        .from('items-images')
        .remove([`${user.id}/${imageName}`]);

      if (error) {
        toast({
          title: "Fehler beim Löschen",
          description: "Bild konnte nicht gelöscht werden.",
          variant: "destructive"
        });
        return;
      }

      setImages(prev => prev.filter(img => img.name !== imageName));
      toast({
        title: "Bild gelöscht",
        description: "Das Bild wurde erfolgreich entfernt.",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  }, [user?.id]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Meine Bilder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Meine Bilder ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {images.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Noch keine Bilder hochgeladen.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div key={image.name} className="relative group">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteImage(image.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Vollbild-Ansicht */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt="Vollbild"
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-4 right-4"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
