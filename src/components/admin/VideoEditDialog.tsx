
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import type { AdminVideo } from "@/types/admin";

interface VideoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  video: AdminVideo | null;
  onSave: (videoId: string, data: {
    display_title_de?: string;
    display_title_en?: string;
    display_description_de?: string;
    display_description_en?: string;
  }) => Promise<void>;
}

const VideoEditDialog = ({ open, onOpenChange, video, onSave }: VideoEditDialogProps) => {
  const { t } = useTranslation('admin');
  const [isLoading, setIsLoading] = useState(false);
  
  const [titleDe, setTitleDe] = useState(video?.display_title_de || "");
  const [titleEn, setTitleEn] = useState(video?.display_title_en || "");
  const [descriptionDe, setDescriptionDe] = useState(video?.display_description_de || "");
  const [descriptionEn, setDescriptionEn] = useState(video?.display_description_en || "");

  // Reset form values when video changes
  React.useEffect(() => {
    if (video) {
      setTitleDe(video.display_title_de || "");
      setTitleEn(video.display_title_en || "");
      setDescriptionDe(video.display_description_de || "");
      setDescriptionEn(video.display_description_en || "");
    }
  }, [video]);

  const handleSave = async () => {
    if (!video) return;
    
    setIsLoading(true);
    try {
      await onSave(video.id, {
        display_title_de: titleDe,
        display_title_en: titleEn,
        display_description_de: descriptionDe,
        display_description_en: descriptionEn
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating video:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('videos.edit_title', 'Video bearbeiten')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title-de">{t('videos.title_de', 'Titel (DE)')}</Label>
            <Input 
              id="title-de"
              value={titleDe} 
              onChange={(e) => setTitleDe(e.target.value)}
              placeholder={video.original_name}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title-en">{t('videos.title_en', 'Titel (EN)')}</Label>
            <Input 
              id="title-en"
              value={titleEn} 
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder={video.original_name}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description-de">{t('videos.description_de', 'Beschreibung (DE)')}</Label>
            <Textarea 
              id="description-de"
              value={descriptionDe} 
              onChange={(e) => setDescriptionDe(e.target.value)}
              rows={3}
              placeholder={video.description || t('videos.enter_description', 'Beschreibung eingeben...')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description-en">{t('videos.description_en', 'Beschreibung (EN)')}</Label>
            <Textarea 
              id="description-en"
              value={descriptionEn} 
              onChange={(e) => setDescriptionEn(e.target.value)}
              rows={3}
              placeholder={video.description || t('videos.enter_description', 'Description in English...')}
            />
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
