
import { TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/use-orders";
import OrderFilters from "@/components/order/OrderFilters";
import OrderCard from "@/components/order/OrderCard";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import OrderEmptyState from "@/components/order/OrderEmptyState";

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Verfügbare Aufträge</h1>
          <p className="text-muted-foreground mt-1">Finde Aufträge, die zu dir passen</p>
        </div>
        
        <Button onClick={fetchOrders} variant="outline" className="flex items-center gap-2">
          <TruckIcon className="h-4 w-4" /> Aufträge aktualisieren
        </Button>
      </div>
      
      {/* Filter section */}
      <OrderFilters
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        maxWeight={maxWeight}
        onWeightChange={setMaxWeight}
      />
      
      {/* Orders list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <OrderEmptyState
          noOrdersAvailable={orders.length === 0}
          onResetFilters={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <OrderCard key={order.order_id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
