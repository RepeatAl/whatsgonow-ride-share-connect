
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
