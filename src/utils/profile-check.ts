export const isProfileIncomplete = (user: any) => {
  if (!user) return true;

  // If profile_complete flag is explicitly set to true, trust it
  if (user.profile_complete === true) return false;

  // Otherwise, perform detailed validation
  const { name, region, role, company_name } = user;

  // Base validation for all users
  if (!name || !region || !role) return true;

  // Role-specific validation
  switch (role) {
    case 'sender_business':
      if (!company_name) return true;
      break;
    case 'cm':
      // Additional CM validation could go here
      break;
    // Add other role-specific validations as needed
  }

  return false;
};

/**
 * Returns missing profile fields based on user role
 */
export const getMissingProfileFields = (user: any): string[] => {
  if (!user) return ['all fields'];

  const missingFields: string[] = [];
  const { name, region, role, company_name } = user;

  // Check basic fields all users need
  if (!name) missingFields.push('name');
  if (!region) missingFields.push('region');
  if (!role) missingFields.push('role');

  // Role-specific fields
  if (role === 'sender_business' && !company_name) {
    missingFields.push('company_name');
  }

  return missingFields;
};
