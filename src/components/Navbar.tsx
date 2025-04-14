import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import UnreadBadge from "./navbar/UnreadBadge";
import NavbarLogo from "./navbar/NavbarLogo";
import MobileMenu from "./navbar/MobileMenu";
import DesktopMenu from "./navbar/DesktopMenu";
import { ThemeToggle } from "./navbar/ThemeToggle";
const Navbar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const isMobile = useIsMobile();
  const location = useLocation();
  const {
    user
  } = useAuth();
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          const {
            data,
            error
          } = await supabase.from('users').select('role').eq('user_id', user.id).single();
          if (error) {
            console.error('Error fetching user role:', error);
            return;
          }
          setUserRole(data?.role || null);
        } catch (error) {
          console.error('Error in Navbar role check:', error);
        }
      } else {
        setUserRole(null);
      }
    };
    checkUserRole();
  }, [location.pathname, user]);
  useEffect(() => {
    if (!user) {
      setUnreadMessagesCount(0);
      return;
    }
    const fetchUnreadCount = async () => {
      try {
        const {
          count,
          error
        } = await supabase.from('messages').select('*', {
          count: 'exact',
          head: true
        }).eq('recipient_id', user.id).eq('read', false);
        if (error) throw error;
        setUnreadMessagesCount(count || 0);
      } catch (error) {
        console.error('Error fetching unread messages count:', error);
      }
    };
    fetchUnreadCount();
    const channel = supabase.channel('unread-messages-count').on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `recipient_id=eq.${user.id}`
    }, fetchUnreadCount).on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'messages',
      filter: `recipient_id=eq.${user.id}`
    }, fetchUnreadCount).subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);
  return <nav className="w-full py-4 px-4 md:px-6 flex items-center justify-between border-b shadow-sm fixed top-0 z-50 bg-slate-50">
      <div className="flex items-center">
        <NavbarLogo />
      </div>

      {isMobile ? <div className="flex items-center gap-2">
          {!isMobile && <ThemeToggle />}
          {user && <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/inbox">
                  <Button variant="ghost" size="icon" className="relative" aria-label="Messages">
                    <Inbox className="h-5 w-5" />
                    <UnreadBadge count={unreadMessagesCount} />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Messages ({unreadMessagesCount} unread)</p>
              </TooltipContent>
            </Tooltip>}
          <MobileMenu user={user} userRole={userRole} unreadMessagesCount={unreadMessagesCount} />
        </div> : <DesktopMenu user={user} userRole={userRole} unreadMessagesCount={unreadMessagesCount} />}
    </nav>;
};
export default Navbar;