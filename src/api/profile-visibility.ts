
// API Utilities für Profile Visibility System
// ================================================================

import { supabase } from '@/lib/supabaseClient';
import type { 
  ProfileAccessRequest,
  ProfileAccessResponse,
  PrivacySettings,
  VisibilityLevel,
  ProfileVisibilitySettings,
  PublicProfile,
  TransactionProfile,
  AdminProfile
} from '@/types/profile-visibility';

// API Base Class für Profile Visibility
export class ProfileVisibilityAPI {
  
  // Prüft Zugriffsberechtigung und gibt entsprechende Profildaten zurück
  static async requestProfileAccess(
    request: ProfileAccessRequest
  ): Promise<ProfileAccessResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return {
          granted: false,
          accessible_fields: [],
          access_limitations: ['Authentication required']
        };
      }

      // Prüfe Zugriffsberechtigung basierend auf access_type
      const accessGranted = await this.checkAccessPermission(
        user.id,
        request.target_user_id,
        request.access_type,
        request.order_id
      );

      if (!accessGranted) {
        return {
          granted: false,
          accessible_fields: [],
          access_limitations: [`Insufficient permissions for ${request.access_type} access`]
        };
      }

      // Hole entsprechende Profildaten
      const profileData = await this.fetchProfileData(
        request.target_user_id,
        request.access_type,
        request.requested_fields
      );

      if (!profileData) {
        return {
          granted: false,
          accessible_fields: [],
          access_limitations: ['Profile not found']
        };
      }

      // Protokolliere Zugriff
      await this.logAccess(user.id, request);

      // Berechne Ablaufzeit für Transaktionen
      const expiresAt = request.access_type === 'transaction' && request.order_id ? 
        await this.calculateTransactionExpiry(request.order_id) : undefined;

      return {
        granted: true,
        profile_data: profileData,
        accessible_fields: this.getAccessibleFields(request.access_type),
        expires_at: expiresAt
      };

    } catch (error) {
      console.error('Profile access request failed:', error);
      return {
        granted: false,
        accessible_fields: [],
        access_limitations: ['Internal server error']
      };
    }
  }

  // Interne Hilfsmethoden
  private static async checkAccessPermission(
    requesterId: string,
    targetUserId: string,
    accessType: VisibilityLevel,
    orderId?: string
  ): Promise<boolean> {
    switch (accessType) {
      case 'public':
        return true;

      case 'private':
        return requesterId === targetUserId;

      case 'transaction':
        if (!orderId) return false;
        const { data } = await supabase.rpc('has_transaction_relationship', {
          user_a: requesterId,
          user_b: targetUserId
        });
        return data || false;

      case 'admin':
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', requesterId)
          .single();
        return profile?.role && ['admin', 'super_admin', 'cm'].includes(profile.role);

      default:
        return false;
    }
  }

  private static async fetchProfileData(
    userId: string,
    accessType: VisibilityLevel,
    requestedFields?: string[]
  ): Promise<PublicProfile | TransactionProfile | AdminProfile | null> {
    const fieldSelects = this.buildFieldSelect(accessType, requestedFields);
    
    const { data, error } = await supabase
      .from('profiles')
      .select(fieldSelects)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile data:', error);
      return null;
    }

    return data as PublicProfile | TransactionProfile | AdminProfile;
  }

  private static buildFieldSelect(
    accessType: VisibilityLevel,
    requestedFields?: string[]
  ): string {
    const fieldMap = {
      public: [
        'user_id', 'first_name', 'region', 'role', 
        'avatar_url', 'verified', 'profile_complete'
      ],
      private: ['*'],
      transaction: [
        'user_id', 'first_name', 'last_name', 'email', 'phone',
        'region', 'role', 'postal_code', 'city', 'street', 
        'house_number', 'address_extra', 'company_name',
        'avatar_url', 'verified'
      ],
      admin: ['*']
    };

    const allowedFields = fieldMap[accessType];
    
    if (requestedFields) {
      return requestedFields
        .filter(field => allowedFields.includes(field) || allowedFields.includes('*'))
        .join(', ');
    }

    return allowedFields.join(', ');
  }

  private static getAccessibleFields(accessType: VisibilityLevel): string[] {
    const fieldMap = {
      public: ['first_name', 'region', 'role', 'avatar_url', 'verified'],
      private: ['*'],
      transaction: [
        'first_name', 'last_name', 'email', 'phone', 'business_address',
        'region', 'role', 'company_name'
      ],
      admin: ['*']
    };

    return fieldMap[accessType];
  }

  private static async logAccess(
    accessorId: string,
    request: ProfileAccessRequest
  ): Promise<void> {
    try {
      await supabase
        .from('profile_access_audit')
        .insert({
          accessed_by: accessorId,
          accessed_user_id: request.target_user_id,
          access_type: request.access_type,
          order_id: request.order_id,
          accessed_fields: request.requested_fields
        });
    } catch (error) {
      console.error('Failed to log profile access:', error);
    }
  }

  private static async calculateTransactionExpiry(orderId: string): Promise<string> {
    // TODO: Berechne Ablaufzeit basierend auf Transaktionsstatus
    // Für jetzt: 30 Tage nach Transaktionsstart
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return thirtyDaysFromNow.toISOString();
  }

  // Privacy Settings Management
  static async updatePrivacySettings(
    userId: string,
    settings: Partial<PrivacySettings>
  ): Promise<boolean> {
    try {
      // Aktualisiere Feld-spezifische Einstellungen
      if (settings.field_settings) {
        const updates = Object.entries(settings.field_settings).map(([field, level]) => ({
          user_id: userId,
          field_name: field,
          visibility_level: level,
          opt_in: true
        }));

        const { error } = await supabase
          .from('profile_visibility_settings')
          .upsert(updates);

        if (error) throw error;
      }

      return true;
    } catch (error) {
      console.error('Failed to update privacy settings:', error);
      return false;
    }
  }

  // Holt aktuelle Privacy-Einstellungen
  static async getPrivacySettings(userId: string): Promise<PrivacySettings | null> {
    try {
      const { data: settings } = await supabase
        .from('profile_visibility_settings')
        .select('*')
        .eq('user_id', userId);

      if (!settings) return null;

      const fieldSettings: Record<string, VisibilityLevel> = {};
      settings.forEach(setting => {
        fieldSettings[setting.field_name] = setting.visibility_level as VisibilityLevel;
      });

      return {
        user_id: userId,
        field_settings: fieldSettings,
        global_privacy_level: 'standard', // TODO: Berechne aus field_settings
        opt_in_marketing: false, // TODO: Aus separater Tabelle
        opt_in_analytics: false,
        data_retention_preference: 'standard'
      };
    } catch (error) {
      console.error('Failed to get privacy settings:', error);
      return null;
    }
  }

  // Löscht abgelaufene Transaktionsbeziehungen
  static async cleanupExpiredTransactions(): Promise<void> {
    try {
      // Markiere abgeschlossene Transaktionen als beendet
      await supabase
        .from('transaction_participants')
        .update({ 
          status: 'completed',
          ended_at: new Date().toISOString()
        })
        .eq('status', 'active')
        .lt('started_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // 30 Tage alt

    } catch (error) {
      console.error('Failed to cleanup expired transactions:', error);
    }
  }
}

// Convenience Exports für direkte Nutzung
export const {
  requestProfileAccess,
  updatePrivacySettings,
  getPrivacySettings,
  cleanupExpiredTransactions
} = ProfileVisibilityAPI;
