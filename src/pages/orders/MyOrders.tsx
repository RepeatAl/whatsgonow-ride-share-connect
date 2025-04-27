
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/lib/supabaseClient";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Order } from "@/types/order";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setOrders(data || []);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meine Aufträge</h1>
          <Button asChild>
            <Link to="/create-order">Neuer Auftrag</Link>
          </Button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Keine Aufträge vorhanden.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white p-4 rounded-lg shadow-sm border"
              >
                <h3 className="font-medium mb-2">{order.description}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Von: {order.from_address}
                  <br />
                  Nach: {order.to_address}
                </p>
                <p className="text-sm text-gray-500">Status: {order.status}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyOrders;
