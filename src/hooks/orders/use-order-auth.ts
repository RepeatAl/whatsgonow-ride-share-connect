import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

export type UserWithRole = {
  id: string;
  role: string;
  region?: string;
};

export const useOrderAuth = () => {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        navigate("/login");
        return;
      }

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id, role, region")
        .eq("user_id", session.user.id)
        .single();

      if (userError || !userData || userData.role !== "driver") {
        toast({
          title: "Zugriff verweigert",
          description: "Du hast keine Berechtigung, diese Seite zu sehen.",
          variant: "destructive"
        });
        setLoading(false);
        navigate("/dashboard");
        return;
      }

      const authenticatedUser: UserWithRole = {
        id: session.user.id,
        role: userData.role,
        region: userData.region
      };

      setUser(authenticatedUser);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  return { user, loading };
};
