import React from 'react';
import { routes as PartnerRoutes } from './partner';
// import { routes as SponsorUserRoutes } from './sponsor-users';
import { routes as DesignerRoutes } from './designer';

const routes = [...PartnerRoutes, /*...SponsorUserRoutes,*/ ...DesignerRoutes];

export { routes };
