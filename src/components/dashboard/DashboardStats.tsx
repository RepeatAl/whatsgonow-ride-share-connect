
import { Users, Package, BadgeCheck, Banknote } from "lucide-react";
import { StatCard } from "./StatCard";
import { StatsGrid } from "./StatsGrid";
import { StatsSkeleton } from "./StatsSkeleton";

interface StatsData {
  totalUsers: number;
  activeUsers: number;
  pendingKyc: number;
  totalOrders: number;
  completedOrders: number;
  totalCommission: number;
}

interface DashboardStatsProps {
  role?: string;
  stats?: StatsData;
  isLoading?: boolean;
}

export const DashboardStats = ({ 
  role = 'sender', 
  stats = {
    totalUsers: 0,
    activeUsers: 0,
    pendingKyc: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalCommission: 0
  }, 
  isLoading = false 
}: DashboardStatsProps) => {
  if (isLoading) {
    return <StatsSkeleton />;
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="h-5 w-5 text-blue-500" aria-hidden="true" />,
      description: `${stats.activeUsers} active in last 30 days`,
      tooltip: "Total number of registered users on the platform",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <Package className="h-5 w-5 text-green-500" aria-hidden="true" />,
      description: `${stats.completedOrders} completed`,
      tooltip: "Total number of transport orders created",
    },
    {
      title: "Pending KYC",
      value: stats.pendingKyc,
      icon: <BadgeCheck className="h-5 w-5 text-amber-500" aria-hidden="true" />,
      description: "Users requiring verification",
      tooltip: "Users waiting for KYC verification approval",
    },
    {
      title: "Total Commission",
      value: `$${stats.totalCommission.toFixed(2)}`,
      icon: <Banknote className="h-5 w-5 text-purple-500" aria-hidden="true" />,
      description: "From completed orders",
      tooltip: "Total commission earned from completed transport orders",
    },
  ];

  return (
    <StatsGrid>
      {statItems.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          icon={item.icon}
          description={item.description}
          tooltip={item.tooltip}
        />
      ))}
    </StatsGrid>
  );
};
