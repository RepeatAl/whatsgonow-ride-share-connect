
export const isProfileIncomplete = (user: any) => {
  if (!user) return true;

  // Prüfe wichtige Felder
  const { name, region, role, company_name, profile_complete } = user;

  if (!profile_complete) return true;

  if (!name || !region || !role) return true;

  if (role === 'sender_business' && !company_name) return true;

  return false;
};
