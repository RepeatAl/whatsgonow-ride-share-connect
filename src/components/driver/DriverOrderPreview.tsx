
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Order } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Package, Calendar } from "lucide-react";
import { formatDate } from "@/utils/pdfGenerator";

interface OrderWithItems extends Order {
  order_items?: {
    item_id: string;
    title: string;
    description: string | null;
    image_url: string | null;
  }[];
}

export function DriverOrderPreview() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("status", "open")
          .not("published_at", "is", null);

        if (error) {
          console.error("Fehler beim Laden der Aufträge:", error);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error("Unerwarteter Fehler:", err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();

    // Realtime subscription
    const channel = supabase
      .channel("driver-order-preview")
      .on(
        "postgres_changes", 
        { event: "*", schema: "public", table: "orders" }, 
        () => loadOrders()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Lade Aufträge...</span>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground">Keine offenen Aufträge verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {orders.map((order) => (
        <Card key={order.order_id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium truncate flex-1">{order.description}</h3>
                <Badge variant="outline" className="ml-2">
                  {order.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Von:</div>
                    <div>{order.from_address}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Nach:</div>
                    <div>{order.to_address}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Lieferfrist:</div>
                    <div>{formatDate(order.deadline)}</div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Package className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-xs text-gray-500">Gewicht:</div>
                    <div>{order.weight} kg</div>
                  </div>
                </div>
              </div>
            </div>
            
            {order.order_items && order.order_items.length > 0 && (
              <div className="p-4 bg-gray-50">
                <h4 className="font-medium text-sm mb-2">Artikel:</h4>
                <ul className="space-y-2">
                  {order.order_items.map((item) => (
                    <li key={item.item_id} className="text-sm">
                      <strong>{item.title}</strong>
                      {item.description && <p className="text-gray-600 text-xs">{item.description}</p>}
                      {item.image_url && (
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="mt-1 h-16 w-auto object-cover rounded" 
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
