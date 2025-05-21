
import React from "react";
import NavLink from "../NavLink";
import { Shield, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminLinksProps {
  isAdmin: boolean;
}

const AdminLinks = ({ isAdmin }: AdminLinksProps) => {
  const { t } = useTranslation('landing');
  
  if (!isAdmin) return null;
  
  return (
    <>
      <div className="h-6 border-l mx-1"></div>
      <NavLink 
        to="/admin"
        icon={<Shield className="h-5 w-5 mr-2" />}
        name={t('nav.admin')}
        tooltip={t('nav.admin')}
      >
        <div className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          <span>{t('nav.admin')}</span>
        </div>
      </NavLink>
      <NavLink 
        to="/trust-management"
        icon={<TrendingUp className="h-5 w-5 mr-2" />}
        name={t('nav.trust_management')}
        tooltip={t('nav.trust_management')}
      >
        <div className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          <span>{t('nav.trust_management')}</span>
        </div>
      </NavLink>
    </>
  );
};

export default AdminLinks;
