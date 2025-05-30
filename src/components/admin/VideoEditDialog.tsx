
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Star } from "lucide-react";
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
    tags?: string[];
  }) => Promise<void>;
}

const VideoEditDialog = ({ open, onOpenChange, video, onSave }: VideoEditDialogProps) => {
  const { t } = useTranslation('admin');
  const [isLoading, setIsLoading] = useState(false);
  
  const [titleDe, setTitleDe] = useState(video?.display_title_de || "");
  const [titleEn, setTitleEn] = useState(video?.display_title_en || "");
  const [titleAr, setTitleAr] = useState(video?.display_title_ar || "");
  const [descriptionDe, setDescriptionDe] = useState(video?.display_description_de || "");
  const [descriptionEn, setDescriptionEn] = useState(video?.display_description_en || "");
  const [descriptionAr, setDescriptionAr] = useState(video?.display_description_ar || "");
  const [tags, setTags] = useState<string[]>(video?.tags || []);
  const [newTag, setNewTag] = useState("");

  // Reset form values when video changes
  React.useEffect(() => {
    if (video) {
      setTitleDe(video.display_title_de || "");
      setTitleEn(video.display_title_en || "");
      setTitleAr(video.display_title_ar || "");
      setDescriptionDe(video.display_description_de || "");
      setDescriptionEn(video.display_description_en || "");
      setDescriptionAr(video.display_description_ar || "");
      setTags(video.tags || []);
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('videos.edit_title', 'Video bearbeiten')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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
