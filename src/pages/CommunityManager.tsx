
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import Layout from "@/components/Layout";
import UserList from "@/components/community-manager/UserList";
import UserActivity from "@/components/community-manager/UserActivity";
import OnboardingChecklist from "@/components/community-manager/OnboardingChecklist";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { LogOut, Users, MapPin, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// This file follows the conventions from /docs/conventions/roles_and_ids.md
const CommunityManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [managerData, setManagerData] = useState<any>(null);
  const [region, setRegion] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }
      
      setUser(session.user);
      
      // Check if user has CM role
      if (session.user) {
        const { data: userData, error: userError } = await supabase
          .from("profiles")
          .select("role, region")
          .eq("user_id", session.user.id)
          .single();
        
        if (userError || !userData || userData.role !== "cm") {
          toast({
            title: "Zugriff verweigert",
            description: "Du hast keine Berechtigung, diese Seite zu sehen.",
            variant: "destructive"
          });
          
          // Redirect based on role (if available)
          if (userData?.role === "driver") {
            navigate("/orders");
          } else if (userData?.role === "admin" || userData?.role === "super_admin") {
            navigate("/admin");
          } else {
            navigate("/dashboard");
          }
          return;
        }
        
        setRegion(userData.region || "");
        
        // Fetch CM specific data
        const { data: cmData, error: cmError } = await supabase
          .from("community_managers")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        
        if (cmError && cmError.code !== "PGRST116") {
          console.error("Error fetching CM data:", cmError);
        } else {
          setManagerData(cmData);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4 sm:px-6 max-w-7xl">
          <Skeleton className="h-12 w-[250px] mb-8" />
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        </div>
      </Layout>
    );
  }

  // Display a warning if no region is assigned
  const hasNoRegion = !region || region.trim() === "";

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 sm:px-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Community Manager Dashboard
              <Badge variant="outline" className="ml-2 bg-blue-50 border-blue-200 text-blue-800">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                {region || "Keine Region"}
              </Badge>
            </h1>
            <p className="text-muted-foreground">
              Verwalte Nutzer und überwache Aktivitäten in deiner Region
            </p>
          </div>
          
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Ausloggen
          </Button>
        </div>
        
        {hasNoRegion && (
          <Card className="mb-6 border-l-4 border-l-amber-500">
            <CardContent className="flex items-center gap-3 pt-6">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <div>
                <h3 className="font-medium">Keine Region zugewiesen</h3>
                <p className="text-sm text-muted-foreground">
                  Dir wurde noch keine Region zugewiesen. Bitte kontaktiere einen Administrator, 
                  um eine Region für dich einzurichten.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Nutzer in deiner Region
                {region && <span className="text-sm font-normal text-muted-foreground ml-2">({region})</span>}
              </CardTitle>
              <CardDescription>
                Verwalte Nutzer und überwache deren Aktivitäten
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserList region={region} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Onboarding</CardTitle>
              <CardDescription>
                Fortschritt als Community Manager
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OnboardingChecklist manager={managerData} user={user} />
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nutzeraktivität</CardTitle>
            <CardDescription>
              Letzte Aktivitäten in deiner Region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserActivity region={region} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CommunityManager;
