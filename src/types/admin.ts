
export interface AdminVideo {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  public_url?: string;
  uploaded_by?: string;
  uploaded_at: string;
  active: boolean;
  public: boolean;
  description?: string;
  display_title_de?: string;
  display_title_en?: string;
  display_title_ar?: string;
  display_description_de?: string;
  display_description_en?: string;
  display_description_ar?: string;
  tags?: string[];
}

export interface VideoUploadData {
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  public_url?: string;
  uploaded_by?: string;
  public: boolean;
  description?: string;
  display_title_de?: string;
  display_title_en?: string;
  display_title_ar?: string;
  display_description_de?: string;
  display_description_en?: string;
  display_description_ar?: string;
  tags?: string[];
}
