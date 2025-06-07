
import { supabase } from "@/lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import type { GuestUploadSession } from "@/types/upload";

export interface CreateGuestSessionOptions {
  existingSessionId?: string;
}

export const createGuestSession = async (
  options: CreateGuestSessionOptions = {}
): Promise<{ sessionId: string; session: GuestUploadSession } | null> => {
  try {
    const { existingSessionId } = options;

    // Check if session exists in localStorage
    const sessionId = existingSessionId || localStorage.getItem('whatsgonow-guest-session');
    
    if (sessionId) {
      console.log('🔍 Checking existing guest session:', sessionId);
      
      // Verify session is still valid
      const { data: sessionData } = await supabase
        .from('guest_upload_sessions')
        .select('*')
        .eq('session_id', sessionId)
        .gt('expires_at', new Date().toISOString())
        .single();
        
      if (sessionData) {
        console.log('✅ Valid existing session found');
        const session: GuestUploadSession = {
          id: sessionData.id,
          session_id: sessionData.session_id,
          lat: sessionData.lat,
          lng: sessionData.lng,
          accuracy: sessionData.accuracy,
          location_consent: sessionData.location_consent || false,
          location_captured_at: sessionData.location_captured_at,
          expires_at: sessionData.expires_at,
          created_at: sessionData.created_at,
          file_count: sessionData.file_count,
          migrated_to_user_id: sessionData.migrated_to_user_id,
          migrated_at: sessionData.migrated_at
        };
        return { sessionId: sessionData.session_id, session };
      }
    }

    // Create new session
    const newSessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

    console.log('🆕 Creating new guest session:', newSessionId);

    const { data, error } = await supabase
      .from('guest_upload_sessions')
      .insert({
        session_id: newSessionId,
        expires_at: expiresAt.toISOString(),
        file_count: 0,
        location_consent: false
      })
      .select()
      .single();

    if (error) throw error;

    localStorage.setItem('whatsgonow-guest-session', newSessionId);
    
    const newSession: GuestUploadSession = {
      id: data.id,
      session_id: newSessionId,
      lat: null,
      lng: null,
      accuracy: null,
      location_consent: false,
      location_captured_at: null,
      expires_at: data.expires_at,
      created_at: data.created_at,
      file_count: 0,
      migrated_to_user_id: null,
      migrated_at: null
    };
    
    console.log('✅ Guest session created successfully');
    return { sessionId: newSessionId, session: newSession };
  } catch (error) {
    console.error('❌ Error creating guest session:', error);
    return null;
  }
};
