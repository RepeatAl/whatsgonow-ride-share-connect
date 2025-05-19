
import React from "react";
import NavLink from "../NavLink";
import { Package, Car, MessageCircle, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MainNavLinksProps {
  isSender: boolean;
  unreadMessagesCount: number;
}

const MainNavLinks = ({ isSender, unreadMessagesCount }: MainNavLinksProps) => {
  const { t } = useTranslation();
  
  const navLinks = [
    { 
      name: t('landing.nav.find_transport'), 
      path: "/find-transport", 
      icon: <Package className="h-5 w-5 mr-2" />, 
      tooltip: t('landing.nav.find_transport')
    },
    { 
      name: t('landing.nav.offer_transport'), 
      path: "/offer-transport", 
      icon: <Car className="h-5 w-5 mr-2" />, 
      tooltip: t('landing.nav.offer_transport')
    },
    { 
      name: t('landing.nav.messages'), 
      path: "/inbox", 
      icon: <MessageCircle className="h-5 w-5 mr-2" />, 
      tooltip: t('landing.nav.messages'),
      badge: unreadMessagesCount
    },
  ];

  // Add create order link for senders
  if (isSender) {
    navLinks.push({
      name: t('landing.nav.order'),
      path: "/create-order",
      icon: <FileText className="h-5 w-5 mr-2" />,
      tooltip: t('dashboard.newOrder')
    });
  }
  
  return (
    <>
      {navLinks.map((link) => (
        <NavLink 
          key={link.path}
          to={link.path}
          icon={link.icon}
          name={link.name}
          tooltip={link.tooltip}
          badge={link.badge}
        />
      ))}
    </>
  );
};

export default MainNavLinks;
