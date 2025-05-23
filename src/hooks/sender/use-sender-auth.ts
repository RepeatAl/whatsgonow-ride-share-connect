import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserWithRole } from "@/types/order";

export const useSenderAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          navigate("/login");
          return;
        }

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("user_id, role, region")
          .eq("user_id", session.user.id)
          .single();

        if (userError || !userData) {
          toast({
            title: "Fehler",
            description: "Benutzerprofil konnte nicht geladen werden.",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }

        const authenticatedUser = {
          id: session.user.id,
          role: userData.role,
          region: userData.region
        };

        setUser(authenticatedUser);
      } catch (err) {
        toast({
          title: "Fehler",
          description: "Beim Authentifizieren ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    // eslint-disable-next-line
  }, [navigate]);

  return { user, loading };
};
