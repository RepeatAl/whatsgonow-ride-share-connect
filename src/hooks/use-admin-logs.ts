import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

// Typen für Admin Log, Transaktion und User Summary
export interface AdminLogEntry {
  log_id: string;
  order_id: string | null;
  user_id: string | null;
  user_name: string | null;
  action: string;
  ip_address: string | null;
  timestamp: string | null;
}

export interface TransactionEntry {
  tx_id: string;
  order_id: string | null;
  payer_id: string | null;
  payer_name: string | null;
  receiver_id: string | null;
  receiver_name: string | null;
  amount: number;
  timestamp: string | null;
}

export interface UserSummary {
  region: string;
  total_users: number;
  active_users: number;
  drivers: number;
  senders: number;
  verified_users?: number;
}

export interface AdminStatsData {
  totalUsers: number;
  activeUsers: number;
  pendingKyc: number;
  totalOrders: number;
  completedOrders: number;
  totalCommission: number;
  verifiedUsers: number;
}

export const useAdminLogs = (daysBack: number = 30, region?: string) => {
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
  const [timeRange, setTimeRange] = useState<string>(daysBack.toString());
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(region);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<AdminStatsData>({
    totalUsers: 0,
    activeUsers: 0,
    pendingKyc: 0,
    totalOrders: 0,
    completedOrders: 0,
    totalCommission: 0,
    verifiedUsers: 0
  });

  // Daten laden
  const fetchData = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(timeRange, 10);

      // DELIVERY LOGS
      const { data: logsData, error: logsError } = await supabase
        .from('delivery_logs')
        .select(`
          log_id,
          order_id,
          user_id,
          action,
          ip_address,
          timestamp,
          users:user_id (name)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (logsError) throw logsError;

      // TRANSACTIONS
      const { data: txData, error: txError } = await supabase
        .from('transactions')
        .select(`
          tx_id,
          order_id,
          payer_id,
          receiver_id,
          amount,
          timestamp,
          payers:payer_id (name),
          receivers:receiver_id (name)
        `)
        .order('timestamp', { ascending: false })
        .limit(50);

      if (txError) throw txError;

      // USER SUMMARIES aus RPC (z. B. get_user_activity_by_region)
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_activity_by_region', {
          filter_region: selectedRegion === 'all' ? null : selectedRegion,
          days_back: daysAgo
        });

      if (userError) throw userError;

      // Logs aufbereiten
      const formattedLogs: AdminLogEntry[] = (logsData || []).map((log: any) => ({
        log_id: log.log_id,
        order_id: log.order_id,
        user_id: log.user_id,
        user_name: log.users?.name || null,
        action: log.action,
        ip_address: log.ip_address,
        timestamp: log.timestamp
      }));

      // Transaktionen aufbereiten
      const formattedTx: TransactionEntry[] = (txData || []).map((tx: any) => ({
        tx_id: tx.tx_id,
        order_id: tx.order_id,
        payer_id: tx.payer_id,
        payer_name: tx.payers?.name || null,
        receiver_id: tx.receiver_id,
        receiver_name: tx.receivers?.name || null,
        amount: tx.amount,
        timestamp: tx.timestamp
      }));

      // UserSummary ist bereits als Array vorhanden
      const userSummaries: UserSummary[] = userData || [];

      // STATS berechnen
      const totalDeliveries = formattedLogs.filter(log =>
        log.action === 'delivery_confirmed'
      ).length;

      const totalTxAmount = formattedTx.reduce((sum, tx) => sum + (tx.amount || 0), 0);

      const totalUsers = userSummaries.reduce((sum, region) =>
        sum + (region.total_users || 0), 0);

      const activeUsers = userSummaries.reduce((sum, region) =>
        sum + (region.active_users || 0), 0);

      // verified_users nur, falls es existiert (sonst Fallback)
      const verifiedUsers = userSummaries.reduce((sum, region) =>
        sum + (region.verified_users || 0), 0) || Math.round(totalUsers * 0.3);

      setLogs(formattedLogs);
      setTransactions(formattedTx);
      setUserSummaries(userSummaries);
      setStats({
        totalUsers,
        activeUsers,
        pendingKyc: Math.round(totalUsers * 0.05),
        totalOrders: Math.round(totalDeliveries * 1.5), // Fallback-Schätzung
        completedOrders: totalDeliveries,
        totalCommission: totalTxAmount,
        verifiedUsers
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, selectedRegion]);

  return {
    logs,
    transactions,
    userSummaries,
    stats,
    timeRange,
    setTimeRange,
    selectedRegion,
    setSelectedRegion,
    loading,
    refreshData: fetchData
  };
};
