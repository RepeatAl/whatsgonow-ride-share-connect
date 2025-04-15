
import { Order } from "@/types/order";
import OrderCard from "./OrderCard";
import OrderSkeleton from "./OrderSkeleton";
import OrderEmptyState from "./OrderEmptyState";

interface OrdersListProps {
  loading: boolean;
  filteredOrders: Order[];
  orders: Order[];
  onResetFilters: () => void;
}

const OrdersList = ({ loading, filteredOrders, orders, onResetFilters }: OrdersListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <OrderSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <OrderEmptyState
        noOrdersAvailable={orders.length === 0}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {filteredOrders.map((order) => (
        <OrderCard key={order.order_id} order={order} />
      ))}
    </div>
  );
};

export default OrdersList;
