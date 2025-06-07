// 🔒 SYSTEM LOCKED – Änderungen nur mit Freigabe durch @Christiane
// Status: FINAL - EINGEFROREN (2025-06-07)

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { AdminVideo } from '@/types/admin';

export const useAdminVideos = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('admin_videos')
        .select(`
          id, 
          filename,
          original_name,
          file_path,
          file_size,
          mime_type,
          public_url,
          thumbnail_url,
          thumbnail_titles,
          display_title_de, 
          display_title_en, 
          display_title_ar, 
          display_titles,
          display_descriptions,
          description, 
          tags, 
          active, 
          public, 
          uploaded_at
        `)
        .eq('public', true)
        .eq('active', true)
        .order('uploaded_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setVideos(data || []);
    } catch (err: any) {
      console.error('Error fetching admin videos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    loading,
    error,
    refetch: fetchVideos
  };
};
