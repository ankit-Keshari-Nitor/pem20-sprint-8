
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

export const TASK_INITIAL_NODES = [
  {
    id: 'start',
    type: NODE_TYPE.START,
    data: { taskName: 'Start' },
    position: { x: 250, y: 300 },
    sourcePosition: 'right'
  },
  {
    id: 'end',
    type: NODE_TYPE.END,
    data: { taskName: 'End' },
    position: { x: 450, y: 300 },
    targetPosition: 'left'
  }
];
