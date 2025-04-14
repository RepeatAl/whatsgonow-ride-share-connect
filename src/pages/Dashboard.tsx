
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { PlusCircle } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import OrderCard from "@/components/order/OrderCard";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import { useSenderOrders } from "@/hooks/use-sender-orders";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { orders, loading: ordersLoading } = useSenderOrders();

  useEffect(() => {
    const getUserProfile = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", session.user.id)
        .single();
      
      if (error) {
        console.error("Error loading user profile", error);
        return;
      }
      
      setUser(data);
      setLoading(false);
    };
    
    getUserProfile();
  }, [navigate]);
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-8"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Willkommen, {user?.name || 'Benutzer'}</h1>
            <p className="text-muted-foreground">
              Dein Dashboard für {user?.role === 'sender' ? 'Sendungen' : user?.role === 'driver' ? 'Transporte' : 'Whatsgonow'}
            </p>
          </div>
          
          {user?.role === 'sender' && (
            <Button 
              variant="brand" 
              className="flex items-center gap-2"
              onClick={() => navigate('/create-order')}
            >
              <PlusCircle className="h-4 w-4" />
              Neuen Auftrag erstellen
            </Button>
          )}
          
          {user?.role === 'driver' && (
            <Button 
              variant="brand" 
              onClick={() => navigate('/orders')}
            >
              Verfügbare Aufträge
            </Button>
          )}
        </div>
        
        <DashboardStats role={user?.role} />
        
        {user?.role === 'sender' && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Deine aktuellen Aufträge</h2>
            
            {ordersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <OrderSkeleton key={i} />
                ))}
              </div>
            ) : orders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <OrderCard 
                    key={order.order_id} 
                    order={order} 
                    showActions={false}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Keine Aufträge</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Du hast noch keine Aufträge erstellt. Klicke oben auf "Neuen Auftrag erstellen".
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
