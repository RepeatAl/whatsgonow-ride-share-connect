
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

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
}

export const useAdminLogs = (daysBack: number = 30, region?: string) => {
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
  const [timeRange, setTimeRange] = useState<string>(daysBack.toString());
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(region);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalTransactions: 0,
    averageRating: 4.7 // Default value
  });

  // Fetch admin logs
  const fetchData = async () => {
    setLoading(true);
    try {
      // Create a date [timeRange] days ago
      const daysAgo = parseInt(timeRange);
      
      // Fetch delivery logs
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
      
      // Fetch transactions
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
      
      // Use the DB function for getting user activity by region
      const { data: userData, error: userError } = await supabase
        .rpc('get_user_activity_by_region', {
          filter_region: selectedRegion === 'all' ? null : selectedRegion,
          days_back: daysAgo
        });
      
      if (userError) throw userError;
      
      // Format logs data
      const formattedLogs = logsData.map((log: any) => ({
        log_id: log.log_id,
        order_id: log.order_id,
        user_id: log.user_id,
        user_name: log.users?.name,
        action: log.action,
        ip_address: log.ip_address,
        timestamp: log.timestamp
      }));
      
      // Format transaction data
      const formattedTx = txData.map((tx: any) => ({
        tx_id: tx.tx_id,
        order_id: tx.order_id,
        payer_id: tx.payer_id,
        payer_name: tx.payers?.name,
        receiver_id: tx.receiver_id,
        receiver_name: tx.receivers?.name,
        amount: tx.amount,
        timestamp: tx.timestamp
      }));
      
      // Generate stats
      const totalDeliveries = formattedLogs.filter(log => 
        log.action === 'delivery_confirmed'
      ).length;
      
      const totalTxAmount = formattedTx.reduce((sum, tx) => sum + (tx.amount || 0), 0);
      
      // Update state
      setLogs(formattedLogs);
      setTransactions(formattedTx);
      setUserSummaries(userData || []);
      setStats({
        totalDeliveries,
        totalTransactions: totalTxAmount,
        averageRating: 4.7 // This would ideally be calculated from ratings data
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch data when timeRange or selectedRegion changes
  useEffect(() => {
    fetchData();
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
