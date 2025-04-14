
import { useState, useEffect } from 'react';
import { supabase } from "@/lib/supabaseClient";
import { toast } from "@/hooks/use-toast";

export interface AdminLogEntry {
  log_id: string;
  order_id: string | null;
  user_id: string | null;
  action: string;
  ip_address: string | null;
  timestamp: string | null;
  user_name?: string;
}

export interface TransactionEntry {
  tx_id: string;
  order_id: string | null;
  payer_id: string | null;
  receiver_id: string | null;
  amount: number;
  timestamp: string | null;
  payer_name?: string;
  receiver_name?: string;
}

export interface UserSummary {
  region: string;
  total_users: number;
  active_users: number;
  drivers: number;
  senders: number;
}

export const useAdminLogs = (timeRange: number = 30, region?: string) => {
  const [logs, setLogs] = useState<AdminLogEntry[]>([]);
  const [transactions, setTransactions] = useState<TransactionEntry[]>([]);
  const [userSummaries, setUserSummaries] = useState<UserSummary[]>([]);
  const [stats, setStats] = useState({
    totalDeliveries: 0,
    totalTransactions: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - timeRange);
        
        // Fetch logs with user names
        const { data: logsData, error: logsError } = await supabase
          .from('delivery_logs')
          .select(`
            log_id,
            order_id,
            user_id,
            action,
            ip_address,
            timestamp,
            users!inner(name)
          `)
          .gte('timestamp', startDate.toISOString())
          .lte('timestamp', endDate.toISOString())
          .order('timestamp', { ascending: false });

        if (logsError) throw logsError;

        // Process logs to include user names
        const processedLogs: AdminLogEntry[] = logsData.map((log: any) => ({
          log_id: log.log_id,
          order_id: log.order_id,
          user_id: log.user_id,
          action: log.action,
          ip_address: log.ip_address,
          timestamp: log.timestamp,
          user_name: log.users?.name || 'Unknown',
        }));

        setLogs(processedLogs);

        // Fetch transactions with user names
        const { data: txData, error: txError } = await supabase
          .from('transactions')
          .select(`
            tx_id,
            order_id,
            payer_id,
            receiver_id,
            amount,
            timestamp,
            payers:users!payer_id(name),
            receivers:users!receiver_id(name)
          `)
          .gte('timestamp', startDate.toISOString())
          .lte('timestamp', endDate.toISOString())
          .order('timestamp', { ascending: false });

        if (txError) throw txError;

        // Process transactions to include user names
        const processedTx: TransactionEntry[] = txData.map((tx: any) => ({
          tx_id: tx.tx_id,
          order_id: tx.order_id,
          payer_id: tx.payer_id,
          receiver_id: tx.receiver_id,
          amount: tx.amount,
          timestamp: tx.timestamp,
          payer_name: tx.payers?.name || 'Unknown',
          receiver_name: tx.receivers?.name || 'Unknown',
        }));

        setTransactions(processedTx);

        // Fetch user summaries by region
        const { data: userSummaryData, error: userSummaryError } = await supabase
          .rpc('get_user_activity_by_region', { 
            filter_region: region || null,
            days_back: timeRange
          });

        if (userSummaryError) {
          console.error('Error fetching user summaries:', userSummaryError);
          // We'll continue even if this fails
          
          // Fallback: fetch simple region counts
          const { data: regionCounts, error: regionError } = await supabase
            .from('users')
            .select('region, role, active')
            .order('region');
            
          if (!regionError && regionCounts) {
            // Process region data manually
            const regionMap = new Map<string, UserSummary>();
            
            regionCounts.forEach(user => {
              const region = user.region || 'Unknown';
              
              if (!regionMap.has(region)) {
                regionMap.set(region, {
                  region: region,
                  total_users: 0,
                  active_users: 0,
                  drivers: 0,
                  senders: 0
                });
              }
              
              const summary = regionMap.get(region)!;
              summary.total_users++;
              
              if (user.active) {
                summary.active_users++;
              }
              
              if (user.role === 'driver') {
                summary.drivers++;
              } else if (user.role === 'sender') {
                summary.senders++;
              }
            });
            
            setUserSummaries(Array.from(regionMap.values()));
          } else {
            setUserSummaries([]);
          }
        } else {
          setUserSummaries(userSummaryData || []);
        }

        // Calculate stats
        const totalDeliveries = processedLogs.filter(log => 
          log.action === 'delivery_confirmed' || log.action === 'delivered'
        ).length;
        
        const totalTransactionAmount = processedTx.reduce((sum, tx) => sum + tx.amount, 0);
        
        // Fetch average rating
        const { data: ratingsData, error: ratingsError } = await supabase
          .from('ratings')
          .select('score')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString());
          
        let avgRating = 0;
        
        if (!ratingsError && ratingsData && ratingsData.length > 0) {
          const totalScore = ratingsData.reduce((sum, rating) => 
            sum + (rating.score || 0), 0
          );
          avgRating = totalScore / ratingsData.length;
        }
        
        setStats({
          totalDeliveries,
          totalTransactions: totalTransactionAmount,
          averageRating: parseFloat(avgRating.toFixed(1))
        });
        
      } catch (error) {
        console.error('Error fetching admin data:', error);
        toast({
          title: "Fehler",
          description: "Die Daten konnten nicht geladen werden.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    // Create a stored procedure for getting user activity by region if it doesn't exist
    const createStoredProcedure = async () => {
      const { error } = await supabase.rpc('get_user_activity_by_region', { 
        filter_region: null,
        days_back: 30
      });
      
      // If the function doesn't exist, create it
      if (error && error.message.includes('does not exist')) {
        const { error: createError } = await supabase.rpc('create_user_activity_function');
        if (createError) {
          console.error('Error creating stored procedure:', createError);
        }
      }
    };

    createStoredProcedure();
    fetchData();
  }, [timeRange, region]);

  return { 
    logs, 
    transactions, 
    userSummaries, 
    stats,
    loading 
  };
};
