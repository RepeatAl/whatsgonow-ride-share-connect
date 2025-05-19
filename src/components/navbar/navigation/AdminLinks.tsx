
import React from "react";
import NavLink from "../NavLink";
import { Shield } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminLinksProps {
  isAdmin: boolean;
}

const AdminLinks = ({ isAdmin }: AdminLinksProps) => {
  const { t } = useTranslation();
  
  if (!isAdmin) return null;
  
  return (
    <>
      <div className="h-6 border-l mx-1"></div>
      <NavLink 
        to="/admin"
        icon={<Shield className="h-5 w-5 mr-2" />}
        name={t('landing.nav.admin')}
        tooltip={t('landing.nav.admin')}
      />
    </>
  );
};

export default AdminLinks;
