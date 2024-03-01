import React from 'react';
import './App.scss';
import * as Shell from '@b2bi/shell';
import { sideNavConfig, headerMenuList } from './modules/configurations';
const routes = [
  {
    path: '/login',
    element: <Shell.Login />
  },
  {
    path: '/',
    breadcrumb: null,
    element: <Shell.Container />,
    children: [...Shell.routes]
    //children: [...Shell.routes]
  }
];

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
