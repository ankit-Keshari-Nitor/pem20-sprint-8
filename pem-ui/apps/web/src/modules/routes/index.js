import React from 'react';
import Shell from '@b2bi/shell';

const Designer = {
  Designer: React.lazy(() => import('./pages/designer')),

};

const routes = [
  {
    path: '/designer/page',
    breadcrumb: 'mod-designer:breadcrumb.page-designer',
    resourceKey: 'DESIGNER.PAGE.VIEW',
    element: (
      <Shell.RoutePage resourceKey="PARTNERS.VIEW" dataLoaderConfig={{}}>
        <Designer.Designer />
      </Shell.RoutePage>
    )
  }
];

export { routes };
