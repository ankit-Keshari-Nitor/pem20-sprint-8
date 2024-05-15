import React from 'react';
import Shell from '@b2bi/shell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const WorkFlow = {
  WorkFlow: React.lazy(() => import('./pages/workflow'))
};

const routes = [
  {
    path: '/activities/workflow',
    breadcrumb: 'mod-activity-designer:breadcrumb.workflow',
    resourceKey: 'WORKFLOW.VIEW',
    element: (
      <Shell.RoutePage resourceKey="WORKFLOW.VIEW" dataLoaderConfig={{}}>
        <DndProvider backend={HTML5Backend}>
          <WorkFlow.WorkFlow />
        </DndProvider>
      </Shell.RoutePage>
    )
  }
];

export { routes };
