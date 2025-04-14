
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogOut, User as UserIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/login");
        return;
      }

      setUser(session.user);
      
      // Fetch user role from the users table
      if (session.user) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        if (error) {
          console.error("Error fetching user role:", error);
        } else if (data) {
          setUserRole(data.role);
          
          // Redirect based on role
          if (data.role === "driver") {
            navigate("/orders");
          } else if (data.role === "cm") {
            navigate("/cm");
          } else if (data.role === "admin") {
            navigate("/admin");
          }
        }
      }
      
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Abmeldung erfolgreich",
        description: "Du wurdest erfolgreich abgemeldet."
      });
      navigate("/login");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <UserIcon className="h-6 w-6" />
            Willkommen, {user?.user_metadata?.name || user?.email || "Nutzer"}
          </CardTitle>
          <CardDescription>
            {userRole && (
              <span className="font-medium text-muted-foreground">
                Rolle: {userRole}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Dies ist dein persönliches Dashboard. Hier kannst du deine Aktivitäten verwalten und deine Einstellungen ändern.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Aktuelle Aufträge</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Keine aktuellen Aufträge vorhanden.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Statistiken</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Keine Statistiken verfügbar.</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
