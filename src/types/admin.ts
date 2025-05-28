
export interface AdminUser {
  user_id: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  role: string;
  region: string;
  active: boolean;
  banned_until?: string;
}

export interface DashboardStatsProps {
  role?: string;
  stats?: StatsData;
  isLoading?: boolean;
  timeRange?: number;
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

export interface VideoUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUploaded: (url: string) => void;
}

export interface TrustScore {
  score: number;
  level: 'high' | 'medium' | 'low';
  badges?: string[];
}

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
  // Zukünftige Erweiterung für mehrsprachige Metadaten
  metadata_i18n?: {
    [language: string]: {
      title?: string;
      description?: string;
      tags?: string[];
    };
  };
}

export interface VideoUploadError {
  type: 'bucket_not_found' | 'permission_denied' | 'file_too_large' | 'invalid_format' | 'network_error' | 'unknown';
  message: string;
  originalError?: any;
}
