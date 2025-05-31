import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Star, Upload, Image } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { AdminVideo } from "@/types/admin";

interface VideoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: AdminVideo | null;
  onSave: (videoId: string, data: {
    display_title_de?: string;
    display_title_en?: string;
    display_title_ar?: string;
    display_description_de?: string;
    display_description_en?: string;
    display_description_ar?: string;
    thumbnail_url?: string;
    thumbnail_titles?: Record<string, string>;
    tags?: string[];
  }) => Promise<void>;
}

const VideoEditDialog = ({ open, onOpenChange, video, onSave }: VideoEditDialogProps) => {
  const { t } = useTranslation('admin');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [titleDe, setTitleDe] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descriptionDe, setDescriptionDe] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAr, setDescriptionAr] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailAltDe, setThumbnailAltDe] = useState("");
  const [thumbnailAltEn, setThumbnailAltEn] = useState("");
  const [thumbnailAltAr, setThumbnailAltAr] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Helper-Funktion für sichere String-Extraktion
  const safeGetString = (value: any): string => {
    if (typeof value === 'string') return value;
    return '';
  };

  // Reset form values when video changes mit sicherer Fallback-Logik
  React.useEffect(() => {
    if (video) {
      // Versuche zuerst JSON-Struktur, dann Fallback auf einzelne Spalten
      if (video.display_titles && typeof video.display_titles === 'object') {
        const titles = video.display_titles as Record<string, string>;
        setTitleDe(titles.de || '');
        setTitleEn(titles.en || '');
        setTitleAr(titles.ar || '');
      } else {
        setTitleDe(safeGetString(video.display_title_de));
        setTitleEn(safeGetString(video.display_title_en));
        setTitleAr(safeGetString(video.display_title_ar));
      }
      
      if (video.display_descriptions && typeof video.display_descriptions === 'object') {
        const descriptions = video.display_descriptions as Record<string, string>;
        setDescriptionDe(descriptions.de || '');
        setDescriptionEn(descriptions.en || '');
        setDescriptionAr(descriptions.ar || '');
      } else {
        setDescriptionDe(safeGetString(video.display_description_de));
        setDescriptionEn(safeGetString(video.display_description_en));
        setDescriptionAr(safeGetString(video.display_description_ar));
      }

      // Handle thumbnail data
      setThumbnailUrl(video.thumbnail_url || '');
      
      if (video.thumbnail_titles && typeof video.thumbnail_titles === 'object') {
        const thumbTitles = video.thumbnail_titles as Record<string, string>;
        setThumbnailAltDe(thumbTitles.de || '');
        setThumbnailAltEn(thumbTitles.en || '');
        setThumbnailAltAr(thumbTitles.ar || '');
      }
      
      setTags(video.tags || []);
    } else {
      // Reset zu leeren Werten wenn kein Video
      setTitleDe("");
      setTitleEn("");
      setTitleAr("");
      setDescriptionDe("");
      setDescriptionEn("");
      setDescriptionAr("");
      setThumbnailUrl("");
      setThumbnailAltDe("");
      setThumbnailAltEn("");
      setThumbnailAltAr("");
      setTags([]);
    }
  }, [video]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleLandingPageToggle = (checked: boolean) => {
    if (checked) {
      // Add 'howto' tag if not present
      if (!tags.includes('howto')) {
        setTags([...tags, 'howto']);
      }
    } else {
      // Remove 'howto' tag
      setTags(tags.filter(tag => tag !== 'howto'));
    }
  };

  const handleFeaturedToggle = (checked: boolean) => {
    if (checked) {
      // Add 'featured' tag if not present
      if (!tags.includes('featured')) {
        setTags([...tags, 'featured']);
      }
    } else {
      // Remove 'featured' tag
      setTags(tags.filter(tag => tag !== 'featured'));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleThumbnailUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload this to Supabase Storage
      // For now, we'll create a local URL as demonstration
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
      console.log('📁 Thumbnail file selected:', file.name, file.size);
      // TODO: Implement actual upload to Supabase Storage
    }
  };

  const handleSave = async () => {
    if (!video) return;
    
    setIsLoading(true);
    try {
      await onSave(video.id, {
        display_title_de: titleDe,
        display_title_en: titleEn,
        display_title_ar: titleAr,
        display_description_de: descriptionDe,
        display_description_en: descriptionEn,
        display_description_ar: descriptionAr,
        thumbnail_url: thumbnailUrl,
        thumbnail_titles: {
          de: thumbnailAltDe,
          en: thumbnailAltEn,
          ar: thumbnailAltAr
        },
        tags: tags
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!video) return null;

  const isOnLandingPage = tags.includes('howto');
  const isFeatured = tags.includes('featured');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('videos.edit_title', 'Video bearbeiten')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Thumbnail Upload Section */}
          <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              <Label className="text-base font-medium">Custom Thumbnail</Label>
            </div>
            
            <div className="flex items-start gap-4">
              {thumbnailUrl ? (
                <div className="relative">
                  <img 
                    src={thumbnailUrl} 
                    alt="Thumbnail Preview" 
                    className="w-32 h-18 object-cover rounded border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full"
                    onClick={() => setThumbnailUrl('')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-32 h-18 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <div className="flex-1">
                <Button
                  variant="outline"
                  onClick={handleThumbnailUpload}
                  className="mb-2"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Thumbnail hochladen
                </Button>
                <p className="text-xs text-gray-600">
                  Empfohlen: 320x180px (16:9), max. 2MB, JPG/PNG/WebP
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Thumbnail Alt Text */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="thumb-alt-de">Alt-Text (Deutsch)</Label>
                <Input 
                  id="thumb-alt-de"
                  value={thumbnailAltDe} 
                  onChange={(e) => setThumbnailAltDe(e.target.value)}
                  placeholder="Beschreibung für Screenreader..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="thumb-alt-en">Alt-Text (English)</Label>
                <Input 
                  id="thumb-alt-en"
                  value={thumbnailAltEn} 
                  onChange={(e) => setThumbnailAltEn(e.target.value)}
                  placeholder="Description for screenreaders..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumb-alt-ar">Alt-Text (العربية)</Label>
                <Input 
                  id="thumb-alt-ar"
                  value={thumbnailAltAr} 
                  onChange={(e) => setThumbnailAltAr(e.target.value)}
                  placeholder="وصف لقارئات الشاشة..."
                  dir="rtl"
                />
              </div>
            </div>
          </div>

          {/* Landing Page und Featured Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label className="text-base font-medium">Landing Page</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="landing-page"
                  checked={isOnLandingPage}
                  onCheckedChange={handleLandingPageToggle}
                />
                <Label htmlFor="landing-page" className="text-sm">
                  Auf der Landing Page anzeigen
                </Label>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Featured Video</Label>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={handleFeaturedToggle}
                />
                <Label htmlFor="featured" className="text-sm flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  Als Featured Video markieren
                </Label>
              </div>
              {isFeatured && (
                <p className="text-xs text-muted-foreground">
                  Dieses Video wird prominente in der Galerie angezeigt.
                </p>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Tags</Label>
            
            {/* Current Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag === 'featured' && <Star className="h-3 w-3" />}
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-muted-foreground">Keine Tags hinzugefügt</p>
              )}
            </div>

            {/* Add New Tag */}
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Neuen Tag hinzufügen..."
                className="flex-1"
              />
              <Button onClick={handleAddTag} disabled={!newTag.trim()}>
                Hinzufügen
              </Button>
            </div>
          </div>

          {/* Title Fields - Drei Sprachen */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title-de">Titel (Deutsch)</Label>
              <Input 
                id="title-de"
                value={titleDe} 
                onChange={(e) => setTitleDe(e.target.value)}
                placeholder={video.original_name}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="title-en">Title (English)</Label>
              <Input 
                id="title-en"
                value={titleEn} 
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={video.original_name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title-ar">العنوان (العربية)</Label>
              <Input 
                id="title-ar"
                value={titleAr} 
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder={video.original_name}
                dir="rtl"
              />
            </div>
          </div>

          {/* Description Fields - Drei Sprachen */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description-de">Beschreibung (Deutsch)</Label>
              <Textarea 
                id="description-de"
                value={descriptionDe} 
                onChange={(e) => setDescriptionDe(e.target.value)}
                rows={4}
                placeholder="Beschreibung auf Deutsch..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description-en">Description (English)</Label>
              <Textarea 
                id="description-en"
                value={descriptionEn} 
                onChange={(e) => setDescriptionEn(e.target.value)}
                rows={4}
                placeholder="Description in English..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description-ar">الوصف (العربية)</Label>
              <Textarea 
                id="description-ar"
                value={descriptionAr} 
                onChange={(e) => setDescriptionAr(e.target.value)}
                rows={4}
                placeholder="الوصف باللغة العربية..."
                dir="rtl"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            {t('common.cancel', 'Abbrechen')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? t('common.saving', 'Speichern...') : t('common.save', 'Speichern')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEditDialog;
