import React from 'react';
import {
  PartnerBlockIcon,
  CustomBlockIcon,
  SponsorBlockIcon,
  SystemBlockIcon,
  ApprovalBlockIcon,
  AttributeBlockIcon,
  GatewayBlockIcon,
  FormBlockIcon,
  ApiBlockIcon,
  XsltBlockIcon
} from './icons';
import { MarkerType } from 'reactflow';
import { StartNode, EndNode, GatewayNode, TaskNode } from './components/nodes';
import { CrossEdge } from './components/edges';
import { componentTypes, useFormApi, FormSpy } from '@data-driven-forms/react-form-renderer';
import textField from '@data-driven-forms/carbon-component-mapper/text-field';
import textarea from '@data-driven-forms/carbon-component-mapper/textarea';
import select from '@data-driven-forms/carbon-component-mapper/select';
import checkbox from '@data-driven-forms/carbon-component-mapper/checkbox';
import { Button, Column, Grid } from '@carbon/react';

export const CATEGORY_TYPES = {
  TASK: 'task',
  DIALOG: 'dialog'
};

export const NODE_TYPE = {
  START: 'start',
  END: 'end',
  PARTNER: 'partner',
  APPROVAL: 'approval',
  ATTRIBUTE: 'attribute',
  SPONSOR: 'sponsor',
  CUSTOM: 'custom',
  SYSTEM: 'system',
  GATEWAY: 'gateway',
  DIALOG: 'form',
  XSLT: 'xslt',
  API: 'api'
};

export const NODE_TYPES = [
  {
    type: NODE_TYPE.PARTNER,
    borderColor: '#0585FC',
    taskName: 'Partner Task',
    editableProps: {
      name: 'Partner'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <PartnerBlockIcon />,
    category: CATEGORY_TYPES.TASK
  },
  {
    type: NODE_TYPE.APPROVAL,
    borderColor: '#0585FC',
    taskName: 'Approval Task',
    editableProps: {
      name: 'Approval'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <ApprovalBlockIcon />,
    category: CATEGORY_TYPES.TASK
  },
  {
    type: NODE_TYPE.ATTRIBUTE,
    borderColor: '#0585FC',
    taskName: 'Attribute Task',
    editableProps: {
      name: 'Attribute'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <AttributeBlockIcon />,
    category: CATEGORY_TYPES.TASK
  },
  {
    type: NODE_TYPE.SPONSOR,
    borderColor: '#0585FC',
    taskName: 'Sponsor Task',
    editableProps: {
      name: 'Sponsor'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <SponsorBlockIcon />,
    category: CATEGORY_TYPES.TASK
  },
  {
    type: NODE_TYPE.CUSTOM,
    borderColor: '#0585FC',
    taskName: 'Custom Task',
    editableProps: {
      name: 'Custom'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <CustomBlockIcon />,
    category: CATEGORY_TYPES.TASK
  },
  {
    type: NODE_TYPE.SYSTEM,
    borderColor: '#0585FC',
    taskName: 'System Task',
    editableProps: {
      name: 'System'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <SystemBlockIcon />,
    category: CATEGORY_TYPES.TASK
  },
  {
    type: NODE_TYPE.GATEWAY,
    borderColor: '#0585FC',
    taskName: 'Gateway Task',
    editableProps: {
      name: 'Gateway'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <GatewayBlockIcon />,
    category: CATEGORY_TYPES.TASK
  },
  {
    type: NODE_TYPE.DIALOG,
    borderColor: '#0585FC',
    taskName: 'Dialog Task',
    editableProps: {
      name: 'Form'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <FormBlockIcon />,
    category: CATEGORY_TYPES.DIALOG
  },
  {
    type: NODE_TYPE.API,
    borderColor: '#0585FC',
    taskName: 'API Task',
    editableProps: {
      name: 'API'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <ApiBlockIcon />,
    category: CATEGORY_TYPES.DIALOG
  },
  {
    type: NODE_TYPE.XSLT,
    borderColor: '#0585FC',
    taskName: 'XSLT Task',
    editableProps: {
      name: 'XSLT'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <XsltBlockIcon />,
    category: CATEGORY_TYPES.DIALOG
  },
  {
    type: NODE_TYPE.GATEWAY,
    borderColor: '#0585FC',
    taskName: 'Gateway Task',
    editableProps: {
      name: 'Gateway'
    },
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <GatewayBlockIcon />,
    category: CATEGORY_TYPES.DIALOG
  }
];

export const connectionLineStyle = { stroke: '#000' };
export const defaultViewport = { x: 0, y: 0, zoom: 1 };
export const snapGrid = [10, 10];
export const endMarks = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#FF0072'
};

export const TASK_INITIAL_NODES = [
  {
    id: 'start',
    type: NODE_TYPE.START,
    data: { label: 'Start' },
    position: { x: 250, y: 300 },
    sourcePosition: 'right'
  },
  {
    id: 'end',
    type: NODE_TYPE.END,
    data: { label: 'End' },
    position: { x: 450, y: 300 },
    targetPosition: 'left'
  }
];

export const TASK_NODE_TYPES = {
  start: StartNode,
  end: EndNode,
  partner: TaskNode,
  approval: TaskNode,
  attribute: TaskNode,
  sponsor: TaskNode,
  custom: TaskNode,
  system: TaskNode,
  gateway: GatewayNode
};

export const TASK_EDGE_TYPES = {
  crossEdge: CrossEdge
};

export const DIALOG_INITIAL_NODES = [
  {
    id: '1',
    type: 'start',
    data: { label: 'Start' },
    position: { x: 250, y: 300 },
    sourcePosition: 'right'
  },
  {
    id: '2',
    type: 'end',
    data: { label: 'End' },
    position: { x: 450, y: 300 },
    targetPosition: 'left'
  }
];

export const DIALOG_NODE_TYPES = {
  start: StartNode,
  end: EndNode,
  form: TaskNode,
  xslt: TaskNode,
  api: TaskNode,
  gateway: GatewayNode
};

export const DIALOG_EDGE_TYPES = {
  crossEdge: CrossEdge
};

export const COMPONENT_MAPPER = {
  [componentTypes.TEXT_FIELD]: textField,
  [componentTypes.TEXTAREA]: textarea,
  [componentTypes.SELECT]: select,
  [componentTypes.CHECKBOX]: checkbox
};

export const FORM_TEMPLATE = ({ formFields, schema }) => {
  const { handleSubmit, onCancel, getState } = useFormApi();
  const { submitting, valid, } = getState();
  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((formField) => (
        <div className="form-field">{formField}</div>
      ))}
      <FormSpy>
        {() => (
          <div className="form-field">
            <Grid>
              <Column lg={8}>
                <Button data-testid="cancel" name="cancel" kind="secondary" type="button" className="cancel-button" onClick={onCancel}>
                  Cancel
                </Button>
              </Column>
              <Column lg={8}>
                <Button disabled={submitting || !valid} data-testid="save" color="primary" variant="contained" type="submit" style={{ width: '100%' }}>
                  Save
                </Button>
              </Column>
            </Grid>
          </div>
        )}
      </FormSpy>
    </form>
  );
};
