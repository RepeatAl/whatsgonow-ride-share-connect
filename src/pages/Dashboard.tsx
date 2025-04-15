
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import OrderCard from "@/components/order/OrderCard";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import { useSenderOrders } from "@/contexts/SenderOrdersContext";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { orders, loading: ordersLoading } = useSenderOrders();
  const { profile, retryProfileLoad } = useAuth();

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg text-center">Profilinformationen fehlen</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-4">
                  Dein Benutzerprofil konnte nicht geladen werden. Dies kann bei einem neu erstellten Konto oder nach einer längeren Inaktivität vorkommen.
                </p>
                {retryProfileLoad ? (
                  <Button 
                    variant="default" 
                    className="w-full mb-2"
                    onClick={retryProfileLoad}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Profil neu laden
                  </Button>
                ) : null}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/profile')}
                >
                  Zum Profil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }
  
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
            <h1 className="text-3xl font-bold">Willkommen, {profile?.name || 'Benutzer'}</h1>
            <p className="text-muted-foreground">
              Dein Dashboard für {profile?.role === 'sender' ? 'Sendungen' : profile?.role === 'driver' ? 'Transporte' : 'Whatsgonow'}
            </p>
          </div>
          
          {profile?.role === 'sender' && (
            <Button 
              variant="brand" 
              className="flex items-center gap-2"
              onClick={() => navigate('/create-order')}
            >
              <PlusCircle className="h-4 w-4" />
              Neuen Auftrag erstellen
            </Button>
          )}
          
          {profile?.role === 'driver' && (
            <Button 
              variant="brand" 
              onClick={() => navigate('/orders')}
            >
              Verfügbare Aufträge
            </Button>
          )}
        </div>
        
        <DashboardStats role={profile?.role} />
        
        {profile?.role === 'sender' && (
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
