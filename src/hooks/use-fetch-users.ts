import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/contexts/SimpleAuthContext';

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
  rating_avg?: number;
  created_at: string;
  orders_count: number;
  flagged_by_cm?: boolean;
  flagged_at?: string;
  flag_reason?: string;
  verified?: boolean;
  active?: boolean;
  region?: string;
  city?: string;
  postal_code?: string;
}

interface UseFetchUsersOptions {
  onlyFlagged?: boolean;
  orderFlagged?: boolean;
}

export function useFetchUsers(region?: string, options: UseFetchUsersOptions = {}) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useSimpleAuth();
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
        
        // Query profiles table instead of users
        let query = supabase
          .from('profiles')
          .select(`
            user_id,
            first_name,
            last_name,
            email,
            phone,
            role,
            created_at,
            flagged_by_cm,
            flagged_at,
            flag_reason,
            verified,
            region,
            city,
            postal_code
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
        const transformedUsers = data.map(user => ({
          ...user,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unbekannt',
          rating_avg: 0, // Placeholder - would come from a real query
          orders_count: 0, // Placeholder - would come from a real query
          active: true // Default value since profiles don't have active field
        }));
        
        setUsers(transformedUsers);
      } catch (err) {
        console.error('Error fetching users from profiles:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [region, profile?.role, onlyFlagged, orderFlagged]);

  return { users, loading };
}
