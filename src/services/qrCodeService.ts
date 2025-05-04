
import { supabase } from '@/integrations/supabase/client';
import { AuditEventType, AuditEntityType, AuditSeverity } from '@/constants/auditEvents';
import { useSystemAudit } from '@/hooks/use-system-audit';

export const generateQrCode = async (orderId: string, userId: string) => {
  try {
    // Generate a unique token
    const qrToken = `${orderId}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
    
    // Generate a 6-digit backup code
    const backupCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store codes in database
    const { error } = await supabase
      .from('orders')
      .update({
        qr_code_token: qrToken,
        backup_code: backupCode,
        token_expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      })
      .eq('order_id', orderId);
      
    if (error) throw error;
    
    // Log QR generation
    const { logEvent } = useSystemAudit();
    await logEvent({
      eventType: AuditEventType.QR_GENERATED,
      entityType: AuditEntityType.ORDER,
      entityId: orderId,
      actorId: userId,
      metadata: {
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      severity: AuditSeverity.INFO
    });
    
    return {
      success: true,
      qrCode: qrToken,
      backupCode
    };
  } catch (error) {
    console.error('Error generating QR code:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

export const verifyQrCode = async (qrCode: string, userId: string) => {
  try {
    // Extract order ID from QR code
    const orderId = qrCode.split('-')[0];
    
    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('qr_code_token, token_expires_at, status')
      .eq('order_id', orderId)
      .single();
      
    if (error) throw error;
    
    // Validate token
    if (order.qr_code_token !== qrCode) {
      return {
        success: false,
        error: 'Ungültiger QR-Code'
      };
    }
    
    // Check if token has expired
    const expiresAt = new Date(order.token_expires_at);
    if (expiresAt < new Date()) {
      return {
        success: false,
        error: 'Der QR-Code ist abgelaufen'
      };
    }
    
    // Check if order is in the right status
    if (order.status !== 'deal_accepted' && order.status !== 'confirmed_by_sender') {
      return {
        success: false,
        error: `Ungültiger Status für QR-Scan: ${order.status}`
      };
    }
    
    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'in_delivery'
      })
      .eq('order_id', orderId);
      
    // Log QR scan
    const { logEvent } = useSystemAudit();
    await logEvent({
      eventType: AuditEventType.QR_SCANNED,
      entityType: AuditEntityType.ORDER,
      entityId: orderId,
      actorId: userId,
      metadata: {
        scan_time: new Date().toISOString(),
        new_status: 'in_delivery'
      },
      severity: AuditSeverity.CRITICAL
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Error verifying QR code:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

export const useBackupCode = async (orderId: string, backupCode: string, userId: string) => {
  try {
    // Get order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('backup_code, token_expires_at, status')
      .eq('order_id', orderId)
      .single();
      
    if (error) throw error;
    
    // Validate backup code
    if (order.backup_code !== backupCode) {
      return {
        success: false,
        error: 'Ungültiger Backup-Code'
      };
    }
    
    // Check if token has expired
    const expiresAt = new Date(order.token_expires_at);
    if (expiresAt < new Date()) {
      return {
        success: false,
        error: 'Der Backup-Code ist abgelaufen'
      };
    }
    
    // Check if order is in the right status
    if (order.status !== 'deal_accepted' && order.status !== 'confirmed_by_sender') {
      return {
        success: false,
        error: `Ungültiger Status für Backup-Code: ${order.status}`
      };
    }
    
    // Update order status
    await supabase
      .from('orders')
      .update({
        status: 'in_delivery'
      })
      .eq('order_id', orderId);
      
    // Log backup code usage
    const { logEvent } = useSystemAudit();
    await logEvent({
      eventType: AuditEventType.QR_BACKUP_USED,
      entityType: AuditEntityType.ORDER,
      entityId: orderId,
      actorId: userId,
      metadata: {
        backup_code_used: true,
        use_time: new Date().toISOString(),
        new_status: 'in_delivery',
        device_info: navigator.userAgent
      },
      severity: AuditSeverity.CRITICAL
    });
    
    return { success: true };
    
  } catch (error) {
    console.error('Error using backup code:', error);
    return {
      success: false,
      error: (error as Error).message
    };
  }
};

// Funktion, die den Typ des Geräts zurückgibt (für Metadaten)
export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let deviceInfo = {
    type: 'unknown',
    os: 'unknown',
    browser: 'unknown'
  };
  
  // Gerätetyp ermitteln
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    deviceInfo.type = 'tablet';
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated/i.test(ua)
  ) {
    deviceInfo.type = 'mobile';
  } else {
    deviceInfo.type = 'desktop';
  }
  
  // Betriebssystem ermitteln
  if (/windows/i.test(ua)) {
    deviceInfo.os = 'windows';
  } else if (/(macintosh|macintel|macppc|mac68k|macos)/i.test(ua)) {
    deviceInfo.os = 'macos';
  } else if (/android/i.test(ua)) {
    deviceInfo.os = 'android';
  } else if (/(iphone|ipad|ipod)/i.test(ua)) {
    deviceInfo.os = 'ios';
  } else if (/linux/i.test(ua)) {
    deviceInfo.os = 'linux';
  }
  
  // Browser ermitteln
  if (/chrome|chromium|crios/i.test(ua)) {
    deviceInfo.browser = 'chrome';
  } else if (/firefox|fxios/i.test(ua)) {
    deviceInfo.browser = 'firefox';
  } else if (/safari/i.test(ua)) {
    deviceInfo.browser = 'safari';
  } else if (/edge/i.test(ua)) {
    deviceInfo.browser = 'edge';
  } else if (/opera|opr/i.test(ua)) {
    deviceInfo.browser = 'opera';
  } else if (/msie|trident/i.test(ua)) {
    deviceInfo.browser = 'ie';
  }
  
  return deviceInfo;
};
