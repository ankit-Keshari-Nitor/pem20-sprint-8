import { routes as PartnerRoutes } from './partner';
// import { routes as SponsorUserRoutes } from './sponsor-users';
import { routes as ActivityRoutes } from './activity';

const routes = [...PartnerRoutes, /*...SponsorUserRoutes,*/ ...ActivityRoutes];

export { routes };
