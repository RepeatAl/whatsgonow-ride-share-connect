
import { supabase } from '@/integrations/supabase/client';
import { EntityType } from './types';

/**
 * Tabellenmapping für verschiedene Entitätstypen
 */
export const TABLE_MAPPING: Record<EntityType, string> = {
  order: 'orders',
  deal: 'deals',
  dispute: 'disputes'
};

/**
 * ID-Feld-Mapping für verschiedene Entitätstypen
 */
export const ID_FIELD_MAPPING: Record<EntityType, string> = {
  order: 'order_id',
  deal: 'deal_id',
  dispute: 'id'
};

/**
 * Status in der Datenbank aktualisieren
 * 
 * @param entityType Typ der Entität
 * @param entityId ID der Entität
 * @param newStatus Neuer Status
 * @returns Supabase Ergebnis
 */
export async function updateStatusInDatabase(
  entityType: EntityType,
  entityId: string,
  newStatus: string
): Promise<{ success: boolean; error?: any }> {
  try {
    const tableName = TABLE_MAPPING[entityType];
    const idField = ID_FIELD_MAPPING[entityType];
    
    const { error } = await supabase
      .from(tableName)
      .update({ status: newStatus })
      .eq(idField, entityId);
    
    if (error) {
      return { success: false, error };
    }
    
    return { success: true };
  } catch (err) {
    console.error(`Fehler beim Aktualisieren des Status für ${entityType} ${entityId}:`, err);
    return { success: false, error: err };
  }
}

/**
 * Aktuelle Status einer Entität abrufen.
 * 
 * @param entityType Typ der Entität ('order', 'deal', oder 'dispute')
 * @param entityId ID der Entität
 * @returns Aktueller Status oder null, wenn nicht gefunden
 */
export async function getCurrentStatus(
  entityType: EntityType,
  entityId: string
): Promise<string | null> {
  try {
    const tableName = TABLE_MAPPING[entityType];
    const idField = ID_FIELD_MAPPING[entityType];
    
    const { data, error } = await supabase
      .from(tableName)
      .select('status')
      .eq(idField, entityId)
      .single();
    
    if (error) throw error;
    
    return data?.status || null;
  } catch (err) {
    console.error(`Fehler beim Abrufen des Status für ${entityType} ${entityId}:`, err);
    return null;
  }
}
