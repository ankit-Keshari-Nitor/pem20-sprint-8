import React from 'react';
import Shell from '@b2bi/shell';

const CDM = {
  CDMModalPage: React.lazy(() => import('./CDM.page'))
};

const modals = [
  {
    page: 'CONTEXT_DATA_MAPPING.SELECT',
    size: 'md',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={{}}>
        <POC.CDMModalPage mode="SELECT" context=""></POC.CDMModalPage>
      </Shell.PageContainer>
    )
  },
  {
    page: 'CONTEXT_DATA_MAPPING.EDIT',
    size: 'lg',
    element: (
      <Shell.PageContainer mode="MODAL_PAGE" dataLoaderConfig={{}}>
        <POC.CDMModalPage mode="EDIT" context="PROPERTY"></POC.CDMModalPage>
      </Shell.PageContainer>
    )
  }
];
export { routes, modals, sideNavConfig };
