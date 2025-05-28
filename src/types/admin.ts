
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

export interface AdminUser {
  user_id: string;
  name: string;
  email: string;
  role: string;
  region: string;
  active: boolean;
  first_name?: string;
  last_name?: string;
  banned_until?: string;
}
