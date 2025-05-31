
import { useState } from "react";
import Layout from "@/components/Layout";
import { RegionFilter } from "@/components/dashboard/RegionFilter";
import { UserTable } from "@/components/dashboard/UserTable";
import { CommissionOverview } from "@/components/dashboard/CommissionOverview";
import { SupportTools } from "@/components/dashboard/SupportTools";
import { OrderActivityChart } from "@/components/dashboard/OrderActivityChart";
import { RatingsDistributionChart } from "@/components/dashboard/RatingsDistributionChart";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { useManagerDashboard } from "@/hooks/use-manager-dashboard";

const ManagerDashboard = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const { users, orders, stats, loading } = useManagerDashboard(selectedRegion);

  return (
    <Layout>
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Community Manager Dashboard</h1>
          <RegionFilter 
            selectedRegion={selectedRegion} 
            onRegionChange={setSelectedRegion} 
          />
        </div>

        <DashboardStats stats={stats} loading={loading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <OrderActivityChart orders={orders} />
          <RatingsDistributionChart users={users} />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <CommissionOverview orders={orders} />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-8">
          <UserTable users={users} />
        </div>

        <div className="grid grid-cols-1 gap-6">
          <SupportTools />
        </div>
      </div>
    </Layout>
  );
};

export default ManagerDashboard;
