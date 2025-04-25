
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export interface UploadSession {
  sessionId: string;
  userId: string;
  target: string;
  expiresAt: string;
  uploadedFiles: string[];
  completed: boolean;
}

export function useUploadSession(sessionId: string) {
  const [session, setSession] = useState<UploadSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data, error } = await supabase
          .from('upload_sessions')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (error) throw error;
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          throw new Error('Session abgelaufen');
        }

        setSession(data);
      } catch (err) {
        setError('Session ungültig oder abgelaufen');
        console.error('Error loading session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    }
  }, [sessionId]);

  return { session, error, isLoading };
}
