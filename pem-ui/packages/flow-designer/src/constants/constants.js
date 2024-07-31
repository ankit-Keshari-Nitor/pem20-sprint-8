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
} from '../icons';
import { StartNode, EndNode, GatewayNode, TaskNode } from './../components/nodes';
import { componentTypes, useFormApi, FormSpy } from '@data-driven-forms/react-form-renderer';
import textField from '@data-driven-forms/carbon-component-mapper/text-field';
import textarea from '@data-driven-forms/carbon-component-mapper/textarea';
import select from '@data-driven-forms/carbon-component-mapper/select';
import checkbox from '@data-driven-forms/carbon-component-mapper/checkbox';
import { Button, Column, Grid } from '@carbon/react';
import CrossEdge from './../components/edges/cross-edge';
import './style.scss';
import { MarkerType, getConnectedEdges } from 'reactflow';

export const CATEGORY_TYPES = {
  TASK: 'task',
  DIALOG: 'dialog'
};

export const NODE_TYPE = {
  START: 'START',
  END: 'END',
  PARTNER: 'PARTNER',
  APPROVAL: 'APPROVAL',
  ATTRIBUTE: 'ATTRIBUTE',
  SPONSOR: 'SPONSOR',
  CUSTOM: 'CUSTOM',
  SYSTEM: 'SYSTEM',
  GATEWAY: 'GATEWAY',
  DIALOG: 'FORM',
  XSLT: 'XSLT',
  API: 'API'
};

export const NODE_TYPES = [
  {
    type: NODE_TYPE.PARTNER,
    shortName: 'Partner',
    borderColor: '#0585FC',
    taskName: 'Partner Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <PartnerBlockIcon />,
    category: CATEGORY_TYPES.TASK,
    active: true
  },
  {
    type: NODE_TYPE.APPROVAL,
    shortName: 'Approval',
    borderColor: '#0585FC',
    taskName: 'Approval Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <ApprovalBlockIcon />,
    category: CATEGORY_TYPES.TASK,
    active: false
  },
  {
    type: NODE_TYPE.ATTRIBUTE,
    shortName: 'Attribute',
    borderColor: '#0585FC',
    taskName: 'Attribute Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <AttributeBlockIcon />,
    category: CATEGORY_TYPES.TASK,
    active: false
  },
  {
    type: NODE_TYPE.SPONSOR,
    shortName: 'Sponsor',
    borderColor: '#0585FC',
    taskName: 'Sponsor Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
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
    shortName: 'Custom',
    borderColor: '#0585FC',
    taskName: 'Custom Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <CustomBlockIcon />,
    category: CATEGORY_TYPES.TASK,
    active: true
  },
  {
    type: NODE_TYPE.SYSTEM,
    shortName: 'System',
    borderColor: '#0585FC',
    taskName: 'System Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <SystemBlockIcon />,
    category: CATEGORY_TYPES.TASK,
    active: true
  },
  {
    type: NODE_TYPE.GATEWAY,
    shortName: 'Gatway',
    borderColor: '#0585FC',
    taskName: 'Gateway Task',
    editableProps: {
      name: 'Gateway'
    },
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <GatewayBlockIcon />,
    category: CATEGORY_TYPES.TASK,
    active: true
  },
  {
    type: NODE_TYPE.DIALOG,
    shortName: 'Dialog',
    borderColor: '#0585FC',
    taskName: 'Dialog Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <FormBlockIcon />,
    category: CATEGORY_TYPES.DIALOG,
    active: true
  },
  {
    type: NODE_TYPE.API,
    shortName: 'API',
    borderColor: '#0585FC',
    taskName: 'API Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <ApiBlockIcon />,
    category: CATEGORY_TYPES.DIALOG,
    active: true
  },
  {
    type: NODE_TYPE.XSLT,
    shortName: 'XSLT',
    borderColor: '#0585FC',
    taskName: 'XSLT Task',
    editableProps: {},
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <XsltBlockIcon />,
    category: CATEGORY_TYPES.DIALOG,
    active: true
  },
  {
    type: NODE_TYPE.GATEWAY,
    shortName: 'Gateway',
    borderColor: '#0585FC',
    taskName: 'Gateway Task',
    editableProps: {
      name: 'Gateway'
    },
    exitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateExitValidationQuery: {
      combinator: 'and',
      rules: []
    },
    exitValidationMessage: '',
    entryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    validateEntryValidationQuery: {
      combinator: 'and',
      rules: []
    },
    entryValidationMessage: '',
    contextMenu: [
      { label: 'Delete', action: 'delete' },
      { label: 'Clone', action: 'clone' },
      { label: 'Save as Template', action: 'savetemplate' }
    ],
    nodeIcon: <GatewayBlockIcon />,
    category: CATEGORY_TYPES.DIALOG,
    active: true
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

export const TASK_NODE_TYPES = {
  START: StartNode,
  END: EndNode,
  PARTNER: TaskNode,
  APPROVAL: TaskNode,
  ATTRIBUTE: TaskNode,
  SPONSOR: TaskNode,
  CUSTOM: TaskNode,
  SYSTEM: TaskNode,
  GATEWAY: GatewayNode
};

export const TASK_EDGE_TYPES = {
  crossEdge: CrossEdge
};

export const DIALOG_INITIAL_NODES = [
  {
    id: '1',
    type: NODE_TYPE.START,
    data: { label: 'Start', taskName: 'Start' },
    position: { x: 350, y: 500 },
    sourcePosition: 'right'
  },
  {
    id: '2',
    type: NODE_TYPE.END,
    data: { label: 'End', taskName: 'End' },
    position: { x: 950, y: 500 },
    targetPosition: 'left'
  }
];

export const DIALOG_NODE_TYPES = {
  START: StartNode,
  END: EndNode,
  FORM: TaskNode,
  XSLT: TaskNode,
  API: TaskNode,
  GATEWAY: GatewayNode
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
  const { handleSubmit, onCancel } = useFormApi();
  const readOnly = schema?.fields[0]?.isReadOnly;
  return (
    <form onSubmit={handleSubmit}>
      {formFields.map((formField, idx) => (
        <div key={idx} className="form-field">
          {formField}
        </div>
      ))}
      <FormSpy>
        {() => (
          <Grid fullWidth className="button-container-container">
            <Column lg={16} className="buttons-container">
              <Button kind="secondary" data-testid="cancel" name="cancel" type="button" onClick={onCancel} className="button" disabled={readOnly}>
                Cancel
              </Button>
              <Button data-testid="save" color="primary" variant="contained" type="submit" className="button" disabled={readOnly}>
                Save
              </Button>
            </Column>
          </Grid>
        )}
      </FormSpy>
    </form>
  );
};

// Query Builder Constants
export const DEFAULT_OPERATORS = [
  { name: '=', label: 'Equals (=)' },
  { name: '!=', label: 'Not Equals (!=)' },
  { name: '>', label: 'Greater than (>)' },
  { name: '>=', label: 'Greater than or equal (>=)' },
  { name: '<', label: 'Less than (<)' },
  { name: '<=', label: 'Less than or equal (<=)' },
  { name: 'contains', label: '[EAP?] contains' },
  { name: 'beginsWith', label: '[EAP?] begins with' },
  { name: 'endsWith', label: '[EAP?] ends with' },
  { name: 'doesNotContain', label: '[EAP?] does not contain' },
  { name: 'doesNotBeginWith', label: '[EAP?] does not begin with' },
  { name: 'doesNotEndWith', label: '[EAP?] does not end with' },
  { name: 'null', label: '[EAP?] is null' },
  { name: 'notNull', label: '[EAP?] is not null' },
  { name: 'in', label: '[EAP?] in' },
  { name: 'notIn', label: '[EAP?] not in' },
  { name: 'between', label: '[EAP?] between' },
  { name: 'notBetween', label: '[EAP?] not between' }
];

export const QUERY_FIELDS = [
  {
    name: 'string',
    label: 'String',
    operators: DEFAULT_OPERATORS.filter((op) =>
      [
        'Equals (=)',
        'Not Equals (!=)',
        'Greater than (>)',
        'Greater than or equal (>=)',
        'Less than (<)',
        'Less than or equal (<=)',
        '[EAP?] contains',
        '[EAP?] begins with',
        '[EAP?] ends with',
        '[EAP?] does not contain',
        '[EAP?] does not begin with',
        '[EAP?] does not end with',
        '[EAP?] is null',
        '[EAP?] is not null',
        '[EAP?] in',
        '[EAP?] not in'
      ].includes(op.label)
    )
  },
  {
    name: 'numeric',
    label: 'Number',
    operators: DEFAULT_OPERATORS.filter((op) =>
      [
        'Equals (=)',
        'Not Equals (!=)',
        'Greater than (>)',
        'Greater than or equal (>=)',
        'Less than (<)',
        'Less than or equal (<=)',
        '[EAP?] in',
        '[EAP?] not in',
        '[EAP?] between',
        '[EAP?] not between'
      ].includes(op.label)
    )
  },
  {
    name: 'boolean',
    label: 'Boolean',
    operators: DEFAULT_OPERATORS.filter((op) => ['Equals (=)', 'Not Equals (!=)'].includes(op.label))
  },
  {
    name: 'date',
    label: 'Date',
    operators: DEFAULT_OPERATORS.filter((op) =>
      [
        'Equals (=)',
        'Not Equals (!=)',
        'Greater than (>)',
        'Greater than or equal (>=)',
        'Less than (<)',
        'Less than or equal (<=)',
        '[EAP?] is null',
        '[EAP?] is not null',
        '[EAP?] between',
        '[EAP?] not between'
      ].includes(op.label)
    )
  }
];

export const INITIAL_QUERY = {
  combinator: 'and',
  rules: []
};

export const QUERY_COMBINATOR = [
  { name: 'and', value: 'and', label: 'AND' },
  { name: 'or', value: 'or', label: 'OR' }
];

export const selector =
  (nodeId, isConnectable = true, maxConnections = Infinity) =>
  (s) => {
    // If the user props say this handle is not connectable, we don't need to
    // bother checking anything else.
    if (!isConnectable) return false;

    const node = s.nodeInternals.get(nodeId);
    const connectedEdges = getConnectedEdges([node], s.edges);

    return connectedEdges.length < maxConnections;
  };
