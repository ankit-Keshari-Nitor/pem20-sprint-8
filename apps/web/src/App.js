import React from 'react';
import './App.scss';
import * as Shell from '@b2bi/shell';
import { sideNavConfig, headerMenuList } from './modules/configurations';
import { routes as PemRoutes } from './modules/routes';
import axios from 'axios';

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

const routes = [
  {
    path: '/login',
    element: <Shell.Login />
  },
  {
    path: '/',
    breadcrumb: null,
    element: <Shell.Container />,
    children: [...Shell.routes, ...flattenedRoutes]
    //children: [...Shell.routes]
  }
];



// Set global headers
axios.defaults.headers.common['Authorization'] = 'Basic ZGVib3JhaF9sZWVfYWNkQGhzYmMuY29tOlBAJCR3MHJk';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Accept'] = 'application/json';

function App() {
  return (
    <Shell.EnvironmentProvider config={{}}>
      <Shell.ConfigurationProvider locales={Shell.SupportedLocales} locale={'en_US'} sideNavConfig={sideNavConfig} headerMenuList={headerMenuList}>
        <Shell.AuthProvider>
          <Shell.ResourceProvider resourceMappings={{}}>
            <Shell.ModalProvider modals={[]}>
              <Shell.RouterProvider routes={routes} />
            </Shell.ModalProvider>
          </Shell.ResourceProvider>
        </Shell.AuthProvider>
      </Shell.ConfigurationProvider>
    </Shell.EnvironmentProvider>
  );
}

export default App;
