
import { useOrders } from "@/hooks/use-orders";
import OrderFilters from "@/components/order/OrderFilters";
import OrdersHeader from "@/components/order/OrdersHeader";
import OrdersList from "@/components/order/OrdersList";
import { Toaster } from "@/components/ui/toaster";

const Orders = () => {
  const {
    filteredOrders,
    loading,
    orders,
    selectedRegion,
    setSelectedRegion,
    maxWeight,
    setMaxWeight,
    fetchOrders
  } = useOrders();

  const resetFilters = () => {
    setSelectedRegion("all");
    setMaxWeight(100);
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 max-w-7xl">
      <OrdersHeader onRefresh={fetchOrders} />
      
      <OrderFilters
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        maxWeight={maxWeight}
        onWeightChange={setMaxWeight}
      />
      
      <OrdersList 
        loading={loading}
        filteredOrders={filteredOrders}
        orders={orders}
        onResetFilters={resetFilters}
      />
      
      <Toaster />
    </div>
  );
};

export default Orders;
