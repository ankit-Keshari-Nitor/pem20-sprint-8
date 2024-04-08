import React from 'react';
import { PartnerBlockIcon, CustomBlockIcon, SponsorBlockIcon, SystemBlockIcon, ApprovalBlockIcon, AttributeBlockIcon, GatewayBlockIcon } from './icons'

export const NODE_TYPES = [
  {
    id: 'partner',
    type: 'partner',
    data: {
      label: 'Partner'
    },
    nodeIcon: <PartnerBlockIcon />,
    blockType:'group1'
  },
  {
    id: 'approval',
    type: 'approval',
    data: {
      label: 'Approval'
    },
    nodeIcon: <ApprovalBlockIcon />,
    blockType:'group1'
  },
  {
    id: 'attribute',
    type: 'attribute',
    data: {
      label: 'Attribute'
    },
    nodeIcon: <AttributeBlockIcon />,
    blockType:'group1'
  },
  {
    id: 'sponsor',
    type: 'sponsor',
    data: {
      label: 'Sponsor'
    },
    nodeIcon: <SponsorBlockIcon />,
    blockType:'group1'
  },
  {
    id: 'custom',
    type: 'custom',
    data: { label: 'Custom' },
    nodeIcon: <CustomBlockIcon />,
    blockType:'group1'
  },
  {
    id: 'system',
    type: 'system',
    data: { label: 'System' },
    nodeIcon: <SystemBlockIcon />,
    blockType:'group1'
  },
  {
    id: 'gateway',
    type: 'gateway',
    data: {
      label: 'Gateway'
    },
    nodeIcon: <GatewayBlockIcon />,
    blockType:'group1'
  }
];
