
import { AuditEventType, AuditSeverity, AuditEntityType, DEFAULT_VISIBILITY } from '@/constants/auditEvents';
import { supabase } from '@/integrations/supabase/client';

interface AuditLogParams {
  eventType: AuditEventType;
  entityType: AuditEntityType;
  entityId: string;
  actorId: string;
  targetId?: string;
  metadata?: Record<string, any>;
  severity?: AuditSeverity;
  visibleTo?: string[];
}

/**
 * Hook für das zentrale System-Auditing.
 * Bietet Funktionen zum Protokollieren von Ereignissen im System.
 */
export const useSystemAudit = () => {
  /**
   * Protokolliert ein Event im zentralen Audit-System.
   * @param eventParams Parameter für das Audit-Event
   * @returns Ergebnis der Protokollierung
   */
  const logEvent = async ({
    eventType,
    entityType,
    entityId,
    actorId,
    targetId = null,
    metadata = {},
    severity = undefined,
    visibleTo = undefined
  }: AuditLogParams) => {
    try {
      // Standardwerte verwenden, wenn nicht explizit angegeben
      const eventSeverity = severity || AuditSeverity.INFO;
      const eventVisibility = visibleTo || DEFAULT_VISIBILITY[eventSeverity];
      
      // Zeitstempel für das Event setzen (wird vom Server überschrieben)
      const timestamp = new Date().toISOString();
      
      // Event in system_logs speichern
      const { data, error } = await supabase
        .from('system_logs')
        .insert({
          event_type: eventType,
          entity_type: entityType,
          entity_id: entityId,
          actor_id: actorId,
          target_id: targetId,
          metadata,
          severity: eventSeverity,
          visible_to: eventVisibility,
          created_at: timestamp
        });
      
      if (error) {
        console.error('Fehler beim Logging:', error);
        return { success: false, error };
      }
      
      // Bei kritischen Events: Benachrichtigung über Edge Function senden
      if (eventSeverity === AuditSeverity.CRITICAL) {
        try {
          await supabase.functions.invoke('notify-critical-event', {
            body: { eventType, entityId, metadata, actorId, timestamp }
          });
        } catch (notifyError) {
          console.error('Benachrichtigung für kritisches Event fehlgeschlagen:', notifyError);
          // Hauptfunktion trotzdem als erfolgreich betrachten, da der Log erstellt wurde
        }
      }
      
      return { success: true, data };
    } catch (err) {
      console.error('Systemaudit konnte nicht durchgeführt werden:', err);
      return { success: false, error: err };
    }
  };

  /**
   * Ruft Audit-Logs basierend auf den angegebenen Kriterien ab.
   * @param filters Filter für die Abfrage von Logs
   * @returns Ergebnis der Abfrage
   */
  const queryLogs = async (filters: {
    eventType?: AuditEventType;
    entityType?: AuditEntityType;
    entityId?: string;
    actorId?: string;
    startDate?: Date;
    endDate?: Date;
    severity?: AuditSeverity | AuditSeverity[];
    limit?: number;
    page?: number;
  }) => {
    try {
      const {
        eventType,
        entityType,
        entityId,
        actorId,
        startDate,
        endDate,
        severity,
        limit = 100,
        page = 0
      } = filters;
      
      let query = supabase
        .from('system_logs')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Filter anwenden
      if (eventType) query = query.eq('event_type', eventType);
      if (entityType) query = query.eq('entity_type', entityType);
      if (entityId) query = query.eq('entity_id', entityId);
      if (actorId) query = query.eq('actor_id', actorId);
      
      if (startDate) {
        query = query.gte('created_at', startDate.toISOString());
      }
      
      if (endDate) {
        query = query.lte('created_at', endDate.toISOString());
      }
      
      if (severity) {
        if (Array.isArray(severity)) {
          query = query.in('severity', severity);
        } else {
          query = query.eq('severity', severity);
        }
      }
      
      // Pagination
      query = query
        .range(page * limit, (page + 1) * limit - 1);
      
      const { data, error, count } = await query;
      
      if (error) {
        console.error('Fehler beim Abrufen der Logs:', error);
        return { success: false, error };
      }
      
      return { 
        success: true, 
        data,
        pagination: {
          page,
          limit,
          total: count,
          hasMore: data && data.length === limit
        }
      };
      
    } catch (err) {
      console.error('Fehler beim Abfragen der Audit-Logs:', err);
      return { success: false, error: err };
    }
  };
  
  return { logEvent, queryLogs };
};

export default useSystemAudit;
