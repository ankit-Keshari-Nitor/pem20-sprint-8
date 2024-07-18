import { routes as PartnerRoutes } from './partner';
// import { routes as SponsorUserRoutes } from './sponsor-users';
import { routes as ActivityRoutes } from './activity';
import { routes as FileRoutes } from './File';
import { routes as ApiConfigurationRoutes } from './ApiConfiguration';
// import { routes as CustomFieldRoutes } from './CustomField';

// import { routes as POCROutes } from '@b2bi/poc';

const routes = [
  {
    path: 'directories',
    breadcrumb: null,
    group: true,
    children: [...PartnerRoutes]
  },
  {
    path: 'activities',
    breadcrumb: null,
    group: true,
    children: [...ActivityRoutes]
  },
  {
    path: 'library',
    breadcrumb: null,
    group: true,
    children: [...FileRoutes]
  },
  {
    path: 'settings',
    breadcrumb: null,
    group: true,
    children: [...ApiConfigurationRoutes, ...CustomFieldRoutes]
  }
];

// routes.push(...POCROutes);

export { routes };
