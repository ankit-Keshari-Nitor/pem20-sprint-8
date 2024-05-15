import React from 'react';
import './App.scss';
import * as Shell from '@b2bi/shell';
import { routes as PemRoutes } from './modules/routes';
import axios from 'axios';
import AppAuthHandler from './AppAuthHandler';
import AppConfiguration from './AppConfiguration';

const flattenRoutes = (flattenedRoutes, nestedRoutes, parentPath) => {
  nestedRoutes.forEach((nestedRoute) => {
    const { path, children, ...routeAttr } = nestedRoute;
    if (routeAttr.group !== true) {
      flattenedRoutes.push({
        path: parentPath + path,
        ...routeAttr
      });
    }

    if (children && children.length > 0) {
      flattenRoutes(flattenedRoutes, children, parentPath + path);
    }
  });
};
const flattenedRoutes = [];
flattenRoutes(flattenedRoutes, PemRoutes, '/');
flattenRoutes(flattenedRoutes, Shell.routes, '/');

const routes = [
  {
    path: '/login',
    element: <Shell.Login />
  },
  {
    path: '/',
    breadcrumb: null,
    element: <Shell.Container />,
    children: [...flattenedRoutes]
  }
];

// Set global headers
axios.defaults.headers.common['Authorization'] = 'Basic ZGVib3JhaF9sZWVfYWNkQGhzYmMuY29tOlBAJCR3MHJk';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

function App() {
  return (
    <Shell.EnvironmentProvider config={{}}>
      <Shell.ApplicationInfoProvider>
        <Shell.AuthProvider handler={AppAuthHandler()}>
          <Shell.ConfigurationProvider
            locales={Shell.SupportedLocales}
            locale={'en_US'}
            sideNavConfig={[/*...sideNavConfig, ...Shell.sideNavConfig*/]}
            headerMenuList={[/*...headerMenuList *//*, ...Shell.headerMenuList*/]}
          >
            <Shell.ResourceProvider resourceMappings={{}}>
              <Shell.ModalProvider modals={{}}>
                <Shell.NotificationProvider>
                  <AppConfiguration>
                    <Shell.RouterProvider routes={routes} />
                  </AppConfiguration>
                </Shell.NotificationProvider>
              </Shell.ModalProvider>
            </Shell.ResourceProvider>
          </Shell.ConfigurationProvider>
        </Shell.AuthProvider>
      </Shell.ApplicationInfoProvider>
    </Shell.EnvironmentProvider>
  );
}


export default App;
