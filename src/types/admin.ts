export interface AdminVideo {
  id: string;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  public_url?: string;
  thumbnail_url?: string; // New field for custom thumbnails
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
  display_titles?: Record<string, string>;
  display_descriptions?: Record<string, string>;
  thumbnail_titles?: Record<string, string>; // New field for multilingual thumbnail alt text
  tags?: string[];
}

export interface VideoUploadData {
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  public_url?: string;
  thumbnail_url?: string; // New field
  uploaded_by?: string;
  public: boolean;
  description?: string;
  display_title_de?: string;
  display_title_en?: string;
  display_title_ar?: string;
  display_description_de?: string;
  display_description_en?: string;
  display_description_ar?: string;
  thumbnail_titles?: Record<string, string>; // New field
  tags?: string[];
}

export interface AdminUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region: string;
  active: boolean;
  banned_until?: string;
}

export interface StatsData {
  totalUsers: number;
  activeUsers: number;
  pendingKyc: number;
  totalOrders: number;
  completedOrders: number;
  totalCommission: number;
  verifiedUsers?: number;
}

export interface DashboardStatsProps {
  role?: string;
  stats?: StatsData;
  isLoading?: boolean;
}
