
import { Users, Package, BadgeCheck, Banknote } from "lucide-react";
import { StatCard } from "./StatCard";
import { StatsGrid } from "./StatsGrid";
import { StatsSkeleton } from "./StatsSkeleton";

interface StatsData {
  totalUsers: number;
  activeOrders: number;
  completedDeliveries: number;
  avgRating: number;
}

interface DashboardStatsProps {
  stats: StatsData;
  loading?: boolean;
}

export const DashboardStats = ({ stats, loading = false }: DashboardStatsProps) => {
  if (loading) {
    return <StatsSkeleton />;
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="h-5 w-5 text-blue-500" aria-hidden="true" />,
      description: `Platform users`,
      tooltip: "Total number of registered users on the platform",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: <Package className="h-5 w-5 text-green-500" aria-hidden="true" />,
      description: "Currently active",
      tooltip: "Number of currently active orders",
    },
    {
      title: "Completed Deliveries", 
      value: stats.completedDeliveries,
      icon: <BadgeCheck className="h-5 w-5 text-amber-500" aria-hidden="true" />,
      description: "Successfully delivered",
      tooltip: "Total number of completed deliveries",
    },
    {
      title: "Average Rating",
      value: stats.avgRating.toFixed(1),
      icon: <Banknote className="h-5 w-5 text-purple-500" aria-hidden="true" />,
      description: "Platform rating",
      tooltip: "Average rating across all users",
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
