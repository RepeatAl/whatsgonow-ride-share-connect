
import React, { useState, useMemo, useCallback } from "react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CameraModal } from "./CameraModal";
import { PreviewGrid } from "./components/image-preview";
import { usePublicUpload } from "@/hooks/file-upload/usePublicUpload";
import { useFilePreviews } from "@/hooks/file-upload/useFilePreviews";
import { validateFile } from "@/hooks/file-upload/fileValidation";
import { GuestUploadNotice } from "@/components/upload/GuestUploadNotice";
import { toast } from "sonner";
import { BulkUploadProvider } from "@/contexts/BulkUploadContext";
import { useItemAnalysis } from "@/hooks/useItemAnalysis";
import { useOptimizedAuth } from "@/contexts/OptimizedAuthContext";
import { useTranslation } from "react-i18next";
import AuthRequired from "@/components/auth/AuthRequired";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import type { GeoLocation } from "@/types/upload";

interface ImageUploadSectionProps {
  userId?: string;
  orderId?: string;
  uploadedPhotoUrls?: string[];
  onPhotosUploaded?: (urls: string[]) => void;
  existingUrls?: string[];
}

export const ImageUploadSection = ({
  userId,
  orderId,
  uploadedPhotoUrls = [],
  onPhotosUploaded,
  existingUrls = []
}: ImageUploadSectionProps) => {
  const { user } = useOptimizedAuth();
  const { t } = useTranslation(['upload', 'common']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlotIndex, setActiveSlotIndex] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState<Record<number, 'pending' | 'success' | 'failed'>>({});

  // Initialize public upload hook
  const {
    uploadFile,
    uploadFiles,
    handlePostLoginMigration,
    generateQrCodeUrl,
    isUploading,
    uploadProgress,
    isGuest,
    guestSession,
    updateSessionLocation
  } = usePublicUpload({
    orderId,
    onProgress: (progress) => console.log("Upload progress:", progress)
  });

  // Initialize file previews
  const {
    previews,
    updatePreviews,
    removePreview: removeFile,
    clearPreviews,
    canTakeMore,
    nextPhotoIndex
  } = useFilePreviews(existingUrls || uploadedPhotoUrls);
  
  // Initialize item analysis hook
  const { analyzeItemPhoto, isAnalyzing } = useItemAnalysis();

  // Handle location consent for guest uploads
  const handleLocationConsent = useCallback(async (location: GeoLocation | null) => {
    if (isGuest && updateSessionLocation) {
      const success = await updateSessionLocation(location);
      if (success && location) {
        console.log('📍 Location consent granted:', location);
      } else if (success && !location) {
        console.log('📍 Location consent revoked');
      }
    }
  }, [isGuest, updateSessionLocation]);

  // Handle file selection and upload
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    const validFiles: File[] = [];
    const newUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      if (validateFile(files[i])) {
        validFiles.push(files[i]);
      }
    }

    if (validFiles.length === 0) return;

    try {
      // Upload files (either to guest bucket or user bucket)
      for (const file of validFiles) {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          newUrls.push(uploadedUrl);
        }
      }

      if (newUrls.length > 0) {
        updatePreviews(newUrls);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.error(t('upload:upload_error', 'Fehler beim Hochladen der Dateien'));
    }

    // Reset input value
    e.target.value = '';
  }, [uploadFile, updatePreviews, t]);

  // Handle direct camera/photo upload
  const handleCapture = useCallback(async (file: File, previewUrl: string) => {
    if (validateFile(file)) {
      try {
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          updatePreviews([uploadedUrl]);
          // Revoke the blob URL since we have the uploaded URL
          URL.revokeObjectURL(previewUrl);
        }
      } catch (error) {
        console.error("Error uploading captured file:", error);
        toast.error(t('upload:capture_error', 'Fehler beim Speichern des Fotos'));
      }
    }
  }, [uploadFile, updatePreviews, t]);

  // Handle mobile upload completion
  const handleMobilePhotosComplete = useCallback(async (urls: string[]) => {
    updatePreviews(urls);
  }, [updatePreviews]);

  // Stable callback for removing files
  const handleRemoveFile = useCallback((index: number) => {
    removeFile(index);
    
    // Also remove analysis status
    setAnalysisStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[index];
      return newStatus;
    });
  }, [removeFile]);

  // Handle automatic analysis when a file is added
  const handleAnalyzeImage = useCallback(async (index: number) => {
    if (!previews[index]) return;
    
    const imageUrl = previews[index] as string;
    if (!imageUrl) return;
    
    setAnalysisStatus(prev => ({ ...prev, [index]: 'pending' }));
    
    try {
      const result = await analyzeItemPhoto({
        item_id: `temp-${index}`,
        photo_url: imageUrl
      });
      
      if (result) {
        setAnalysisStatus(prev => ({ ...prev, [index]: 'success' }));
      } else {
        setAnalysisStatus(prev => ({ ...prev, [index]: 'failed' }));
      }
    } catch (err) {
      console.error("Analysis error:", err);
      setAnalysisStatus(prev => ({ ...prev, [index]: 'failed' }));
      toast.error(t('upload:analysis_error', 'Fehler bei der Bildanalyse'));
    }
  }, [analyzeItemPhoto, previews, t]);

  // Handle post-login migration
  const handleAuthSuccess = useCallback(async () => {
    if (user && guestSession) {
      try {
        const migratedUrls = await handlePostLoginMigration(user.id);
        if (migratedUrls.length > 0) {
          updatePreviews(migratedUrls);
          if (onPhotosUploaded) {
            onPhotosUploaded(migratedUrls);
          }
        }
      } catch (error) {
        console.error("Error during post-login migration:", error);
        toast.error(t('upload:migration_error', 'Fehler beim Übernehmen der Bilder'));
      }
    }
  }, [user, guestSession, handlePostLoginMigration, updatePreviews, onPhotosUploaded, t]);

  // Save handler (only for authenticated users)
  const handleSave = useCallback(async () => {
    if (!user || !onPhotosUploaded) return;

    const uploadedUrls = previews.filter(Boolean) as string[];
    if (uploadedUrls.length > 0) {
      onPhotosUploaded(uploadedUrls);
      toast.success(t('upload:save_success', 'Fotos erfolgreich gespeichert'));
    }
  }, [user, previews, onPhotosUploaded, t]);
  
  // Convert previews to the format expected by PreviewGrid
  const imageList = useMemo(() => {
    return previews.length > 0 ? previews : Array(4).fill(null);
  }, [previews]);
  
  const handleImageChange = useCallback((index: number, file: File) => {
    // Handle file change using our existing handlers
    if (file) {
      const fileList = new DataTransfer();
      fileList.items.add(file);
      
      const syntheticEvent = {
        target: {
          files: fileList.files,
          value: ""
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      handleFileChange(syntheticEvent);
    }
  }, [handleFileChange]);

  // Generate QR code URL
  const handleGenerateQr = useCallback(async () => {
    try {
      const qrUrl = await generateQrCodeUrl();
      if (qrUrl) {
        console.log("QR Code URL:", qrUrl);
        // QR code functionality can be implemented here
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }, [generateQrCodeUrl]);

  // Create stable modal props
  const modalProps = useMemo(() => ({
    isOpen: isModalOpen,
    onClose: () => setIsModalOpen(false),
    onCapture: handleCapture,
    nextPhotoIndex: activeSlotIndex + 1
  }), [isModalOpen, handleCapture, activeSlotIndex]);

  return (
    <BulkUploadProvider>
      <div className="space-y-4">
        <h3 className="text-lg font-medium">
          {t('upload:section_title', 'Bilder hochladen')}
        </h3>
        
        {/* Guest Upload Notice with Location Consent */}
        {isGuest && guestSession && (
          <GuestUploadNotice 
            fileCount={guestSession.file_count}
            expiresAt={guestSession.expires_at}
            onLocationConsent={handleLocationConsent}
            locationEnabled={guestSession.location_consent}
          />
        )}
        
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <FormItem>
                <FormLabel>
                  {t('upload:form_label', 'Bilder hochladen (max. 4, 2 MB pro Datei)')}
                </FormLabel>
                
                <PreviewGrid 
                  images={imageList}
                  onImageChange={handleImageChange}
                  onImageRemove={handleRemoveFile}
                  imageCount={4}
                  deviceType="desktop"
                  userId={userId}
                  orderId={orderId}
                  onUploadComplete={handleMobilePhotosComplete}
                />
                
                <input 
                  type="file" 
                  multiple 
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleFileChange} 
                  className="hidden" 
                  id="file-upload-input"
                />
                
                <FormMessage />
              </FormItem>

              {/* Save Button - Only visible for authenticated users */}
              {user && previews.some(Boolean) && (
                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isUploading}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('upload:save_button', 'Fotos speichern')}
                  </Button>
                </div>
              )}

              {/* Publish Button with Auth Protection */}
              {previews.some(Boolean) && (
                <AuthRequired 
                  action="publish_item"
                  loginPrompt={t('upload:login_to_publish', 'Zum Veröffentlichen bitte anmelden')}
                  onAuthSuccess={handleAuthSuccess}
                >
                  <Button className="w-full" disabled={isUploading}>
                    {t('upload:publish_button', 'Artikel veröffentlichen')}
                  </Button>
                </AuthRequired>
              )}
            </div>
          </CardContent>
        </Card>

        <CameraModal {...modalProps} />
      </div>
    </BulkUploadProvider>
  );
};
