
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Package, 
  Calendar, 
  Clock, 
  ChevronRight,
  Filter,
  TruckIcon 
} from "lucide-react";
import { RegionFilter } from "@/components/dashboard/RegionFilter";

type Order = {
  order_id: string;
  description: string;
  from_address: string;
  to_address: string;
  weight: number;
  deadline: string;
  status: string;
  region?: string;
};

const Orders = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [maxWeight, setMaxWeight] = useState(100);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);
      
      // Check if user has driver role
      if (session.user) {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (userError || !userData || userData.role !== "driver") {
          toast({
            title: "Zugriff verweigert",
            description: "Du hast keine Berechtigung, diese Seite zu sehen.",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
        
        // Fetch orders
        fetchOrders();
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "offen");
      
      if (error) throw error;
      
      setOrders(data || []);
      setFilteredOrders(data || []);
    } catch (error) {
      console.error("Fehler beim Laden der Aufträge:", error);
      toast({
        title: "Fehler",
        description: "Die Aufträge konnten nicht geladen werden.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters whenever they change
    const applyFilters = () => {
      let filtered = [...orders];
      
      // Filter by region
      if (selectedRegion !== "all") {
        filtered = filtered.filter(order => {
          // Extract region from address or use stored region if available
          const region = order.region || extractRegionFromAddress(order.from_address);
          return region === selectedRegion;
        });
      }
      
      // Filter by weight
      filtered = filtered.filter(order => order.weight <= maxWeight);
      
      setFilteredOrders(filtered);
    };
    
    applyFilters();
  }, [selectedRegion, maxWeight, orders]);

  // Helper function to extract region from address (simplified example)
  const extractRegionFromAddress = (address: string) => {
    // In a real app, this would be more sophisticated
    // For demo, we'll just check for region names in the address
    const regions = ["North", "South", "East", "West", "Central"];
    for (const region of regions) {
      if (address.includes(region)) {
        return region;
      }
    }
    return "unknown";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
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
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Aufträge filtern
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <RegionFilter selectedRegion={selectedRegion} onRegionChange={setSelectedRegion} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <Package className="h-4 w-4 mr-1 text-brand-primary" />
                Max. Gewicht: {maxWeight} kg
              </label>
              <Slider
                value={[maxWeight]}
                min={0}
                max={100}
                step={5}
                onValueChange={(value) => setMaxWeight(value[0])}
                className="my-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Orders list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Keine Aufträge gefunden</h3>
            <p className="text-muted-foreground text-center mb-4">
              {orders.length === 0 
                ? "Es sind derzeit keine offenen Aufträge verfügbar."
                : "Keine Aufträge entsprechen deinen Filterkriterien."}
            </p>
            <Button onClick={() => {
              setSelectedRegion("all");
              setMaxWeight(100);
            }} variant="outline">
              Filter zurücksetzen
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <Card key={order.order_id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.description}</CardTitle>
                    <CardDescription>
                      <span className="inline-flex items-center gap-0.5">
                        <Package className="h-3.5 w-3.5" /> {order.weight} kg
                      </span>
                    </CardDescription>
                  </div>
                  <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                    {order.status}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-gray-700">{order.from_address}</div>
                      <div className="text-sm text-gray-700 mt-1 flex items-center">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        {order.to_address}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 pt-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formatDate(order.deadline)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{formatTime(order.deadline)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant="brand"
                  onClick={() => navigate(`/submit-offer/${order.order_id}`)}
                >
                  Angebot abgeben
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
