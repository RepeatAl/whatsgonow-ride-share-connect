
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  rating_avg?: number;
  created_at: string;
  orders_count: number;
  flagged_by_cm?: boolean;
  flagged_at?: string;
  flag_reason?: string;
}

interface UseFetchUsersOptions {
  onlyFlagged?: boolean;
  orderFlagged?: boolean;
}

export function useFetchUsers(region?: string, options: UseFetchUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();
  const { onlyFlagged = false, orderFlagged = false } = options;

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        
        // Only proceed if we have a region or the user is an admin
        if (!region && !['admin', 'super_admin'].includes(profile?.role || '')) {
          setUsers([]);
          return;
        }
        
        // Start building query - select all necessary columns including flag data
        let query = supabase
          .from('profiles')
          .select(`
            user_id,
            name,
            email,
            phone,
            role,
            created_at,
            flagged_by_cm,
            flagged_at,
            flag_reason
          `);
        
        // Add region filter if not admin
        if (region && !['admin', 'super_admin'].includes(profile?.role || '')) {
          query = query.eq('region', region);
        }
        
        // Filter by flagged status if requested
        if (onlyFlagged) {
          query = query.eq('flagged_by_cm', true);
        }
        
        // Order by flagged status if requested (flagged users first)
        if (orderFlagged) {
          query = query.order('flagged_by_cm', { ascending: false });
        }
        
        // Always order by creation date (newest first) as secondary sort
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        // Transform the data to match our User interface
        // In a real app, you'd probably want to fetch ratings and order counts separately
        const transformedUsers = data.map(user => ({
          ...user,
          rating_avg: 0, // Placeholder - would come from a real query
          orders_count: 0 // Placeholder - would come from a real query
        }));
        
        setUsers(transformedUsers);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [region, profile?.role, onlyFlagged, orderFlagged]);

  return { users, loading };
}
