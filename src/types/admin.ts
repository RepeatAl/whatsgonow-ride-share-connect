
export interface AdminVideo {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by?: string;
  uploaded_at: string;
  public_url?: string;
  description?: string;
  tags?: string[];
  active: boolean;
  public: boolean;
}

export interface VideoUploadMetadata {
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}
