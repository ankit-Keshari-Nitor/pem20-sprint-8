import React from 'react';
import Shell from '@b2bi/shell';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Activity = {
  Definition: React.lazy(() => import('./pages/activities/definitions'))
};

const Workflow = {
  Designer: React.lazy(() => import('./pages/activities/workflow'))
};

const routes = [
  {
    path: '/activities/definitions',
    breadcrumb: 'mod-activity-designer:breadcrumb.definitions',
    resourceKey: 'DEFINITIONS.VIEW',
    element: (
      <Shell.RoutePage resourceKey="DEFINITIONS.VIEW" dataLoaderConfig={{}}>
        <DndProvider backend={HTML5Backend}>
          <Activity.Definition />
        </DndProvider>
      </Shell.RoutePage>
    )
  },
  {
    path: '/activities/definitions/new',
    breadcrumb: 'mod-activity-designer:breadcrumb.workflow',
    resourceKey: 'DESIGNER.VIEW',
    element: (
      <Shell.RoutePage resourceKey="DESIGNER.VIEW" dataLoaderConfig={{}}>
        <DndProvider backend={HTML5Backend}>
          <Workflow.Designer />
        </DndProvider>
      </Shell.RoutePage>
    )
  }
];

export { routes };
