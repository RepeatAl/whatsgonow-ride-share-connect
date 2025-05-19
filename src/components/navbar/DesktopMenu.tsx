
import React from "react";
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

const DesktopMenu = ({ user, userRole, unreadMessagesCount }: DesktopMenuProps) => {
  const isSender = userRole?.startsWith('sender_');
  const isAdmin = userRole === 'admin' || userRole === 'admin_limited';

  return (
    <div className="flex items-center gap-4">
      <ThemeLanguageControls />
      
      {user ? (
        <>
          <MainNavLinks isSender={isSender} unreadMessagesCount={unreadMessagesCount} />
          <AdminLinks isAdmin={isAdmin} />
          
          <div className="h-6 border-l mx-1"></div>
          <InboxButton unreadMessagesCount={unreadMessagesCount} />
          <LoggedInButtons />

          {/* Highlight new order button for senders */}
          <CreateOrderButton isSender={isSender} />
        </>
      ) : (
        <LoggedOutButton />
      )}
    </div>
  );
};

export default DesktopMenu;
