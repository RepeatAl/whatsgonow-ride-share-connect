
import React, { useMemo } from "react";
import ThemeLanguageControls from "./ThemeLanguageControls";
import MainNavLinks from "./navigation/MainNavLinks";
import AdminLinks from "./navigation/AdminLinks";
import InboxButton from "./notification/InboxButton";
import LoggedInButtons from "./auth-buttons/LoggedInButtons";
import LoggedOutButton from "./auth-buttons/LoggedOutButton";
import CreateOrderButton from "./sender/CreateOrderButton";

interface DesktopMenuProps {
  user: any;
  userRole: string | null;
  unreadMessagesCount: number;
}

const DesktopMenu = React.memo(({ user, userRole, unreadMessagesCount }: DesktopMenuProps) => {
  // Memoize role checks to prevent unnecessary re-renders
  const roleChecks = useMemo(() => ({
    isSender: userRole?.startsWith('sender_') || false,
    isAdmin: userRole === 'admin' || userRole === 'admin_limited' || userRole === 'super_admin'
  }), [userRole]);

  return (
    <div className="flex items-center gap-4">
      <ThemeLanguageControls />
      
      {user ? (
        <>
          <MainNavLinks isSender={roleChecks.isSender} unreadMessagesCount={unreadMessagesCount} />
          <AdminLinks isAdmin={roleChecks.isAdmin} />
          
          <div className="h-6 border-l mx-1"></div>
          <InboxButton unreadMessagesCount={unreadMessagesCount} />
          <LoggedInButtons />

          {/* Highlight new order button for senders */}
          <CreateOrderButton isSender={roleChecks.isSender} />
        </>
      ) : (
        <LoggedOutButton />
      )}
    </div>
  );
});

DesktopMenu.displayName = "DesktopMenu";

export default DesktopMenu;
