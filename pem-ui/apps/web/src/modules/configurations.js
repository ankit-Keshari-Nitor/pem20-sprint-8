const sideNavConfig = [
  {
    label: 'pem:sideNav.partners',
    to: '/directories/partners',
    title: 'pem:sideNav.partners',
    resourceKey: 'PARTNERS.VIEW'
  },
  {
    label: 'pem:sideNav.partnerUsers',
    to: '/directories/partnerusers',
    title: 'pem:sideNav.partnerUsers',
    resourceKey: 'PARTNERS.USERS.VIEW'
  },
  {
    label: 'pem:sideNav.users',
    to: '/directories/sponsor-users',
    title: 'pem:sideNav.users',
    resourceKey: 'USERS.VIEW'
  },
  {
    label: 'pem:sideNav.roles',
    to: '/directories/roles',
    title: 'pem:sideNav.roles',
    resourceKey: 'ROLES.VIEW'
  },
  {
    label: 'pem:sideNav.divisions',
    to: '/directories/divisions',
    title: 'pem:sideNav.divisions',
    resourceKey: 'DIVISIONS.VIEW'
  },
  {
    label: 'pem:sideNav.workflow',
    to: '/activities/workflow',
    title: 'pem:sideNav.workflow',
    resourceKey: 'DESIGNER.VIEW'
  }
];

const headerMenuList = [
  {
    label: 'pem:headerLink.directories',
    title: 'pem:headerLink.directories',
    to: '/directories',
    id: 'directories'
  },
  {
    label: 'pem:headerLink.activities',
    title: 'pem:headerLink.activities',
    to: '/activities',
    id: 'activities'
  },
  {
    label: 'pem:headerLink.library',
    title: 'pem:headerLink.library',
    to: '/library',
    id: 'library'
  },
  {
    label: 'pem:headerLink.settings',
    title: 'pem:headerLink.settings',
    to: '/settings',
    id: 'settings'
  }
];

export { sideNavConfig, headerMenuList };
