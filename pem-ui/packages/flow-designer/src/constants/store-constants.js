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
