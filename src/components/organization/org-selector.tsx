'use client';
import { OrganizationSwitcher, useOrganization, useOrganizationList } from '@clerk/nextjs';
import { useEffect } from 'react';

export function OrgSelector() {
  const { organization } = useOrganization();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });

  // Auto-select the first organization if none is selected
  useEffect(() => {
    const autoSelectOrg = async () => {
      if (isLoaded && !organization && userMemberships.data?.length) {
        const firstOrg = userMemberships.data[0];
        if (firstOrg?.organization) {
          await setActive({ organization: firstOrg.organization.id });
        }
      }
    };

    autoSelectOrg();
  }, [isLoaded, organization, userMemberships.data, setActive]);

  return <OrganizationSwitcher hidePersonal />;
}
