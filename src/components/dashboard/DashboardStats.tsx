
import { Card, CardContent } from "@/components/ui/card";
import { Users, Package, BadgeCheck, Banknote } from "lucide-react";

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    pendingKyc: number;
    totalOrders: number;
    completedOrders: number;
    totalCommission: number;
  };
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statItems = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      description: `${stats.activeUsers} active in last 30 days`,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <Package className="h-5 w-5 text-green-500" />,
      description: `${stats.completedOrders} completed`,
    },
    {
      title: "Pending KYC",
      value: stats.pendingKyc,
      icon: <BadgeCheck className="h-5 w-5 text-amber-500" />,
      description: "Users requiring verification",
    },
    {
      title: "Total Commission",
      value: `$${stats.totalCommission.toFixed(2)}`,
      icon: <Banknote className="h-5 w-5 text-purple-500" />,
      description: "From completed orders",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statItems.map((item) => (
        <Card key={item.title}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3>
              {item.icon}
            </div>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
