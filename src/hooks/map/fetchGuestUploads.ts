
import { supabase } from '@/lib/supabaseClient';
import { useTranslation } from 'react-i18next';
import type { PublicMapItem, GuestUploadSession } from '@/types/upload';

export const useFetchGuestUploads = () => {
  const { t } = useTranslation(['common']);

  const fetchGuestUploads = async (): Promise<PublicMapItem[]> => {
    try {
      console.log('🔍 Fetching guest uploads with location consent...');

      const { data: guestData, error: guestError } = await supabase
        .from('guest_upload_sessions')
        .select(`
          id,
          session_id,
          lat,
          lng,
          accuracy,
          location_consent,
          location_captured_at,
          expires_at,
          created_at,
          file_count,
          migrated_to_user_id,
          migrated_at
        `)
        .eq('location_consent', true)
        .not('lat', 'is', null)
        .not('lng', 'is', null)
        .gt('expires_at', new Date().toISOString())
        .is('migrated_to_user_id', null)
        .order('created_at', { ascending: false })
        .limit(20);

      if (guestError) {
        console.warn('⚠️ Guest uploads loading failed:', guestError.message);
        return [];
      }

      const guestUploads: GuestUploadSession[] = guestData || [];
      console.log(`✅ Loaded ${guestUploads.length} guest uploads with location`);

      // Convert guest uploads to PublicMapItem format
      return guestUploads
        .filter(guest => guest.lat && guest.lng)
        .map(guest => ({
          id: guest.session_id,
          type: 'guest' as const,
          title: t('common:guest_upload', 'Gast-Upload'),
          lat: guest.lat!,
          lng: guest.lng!,
          status: 'active',
          expires_at: guest.expires_at,
          session_id: guest.session_id,
          file_count: guest.file_count,
          description: t('common:guest_upload_description', '{{count}} Datei(en) hochgeladen', { count: guest.file_count })
        }));
    } catch (err) {
      console.warn('⚠️ Guest uploads query failed:', err);
      return [];
    }
  };

  return { fetchGuestUploads };
};
