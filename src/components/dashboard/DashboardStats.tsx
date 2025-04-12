
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, BadgeCheck, Banknote } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    pendingKyc: number;
    totalOrders: number;
    completedOrders: number;
    totalCommission: number;
  };
  isLoading?: boolean;
}

export const DashboardStats = ({ stats, isLoading = false }: DashboardStatsProps) => {
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" aria-label="Dashboard statistics">
      {statItems.map((item) => (
        <Tooltip key={item.title}>
          <TooltipTrigger asChild>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3>
                  {item.icon}
                </div>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
              </CardContent>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.tooltip}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
