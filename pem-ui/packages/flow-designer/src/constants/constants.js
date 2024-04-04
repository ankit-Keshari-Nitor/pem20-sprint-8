import React from 'react';
import { PartnerBlockIcon, CustomBlockIcon, SponsorBlockIcon, SystemBlockIcon, ApprovalBlockIcon, AttributeBlockIcon, GatewayBlockIcon } from '../assets/icons';

export const NODE_TYPES = [
  {
    id: 'partner',
    type: 'partner',
    data: {
      label: 'Partner'
    },
    nodeIcon: <PartnerBlockIcon />
  },
  {
    id: 'approval',
    type: 'approval',
    data: {
      label: 'Approval'
    },
    nodeIcon: <ApprovalBlockIcon />
  },
  {
    id: 'attribute',
    type: 'attribute',
    data: {
      label: 'Attribute'
    },
    nodeIcon: <AttributeBlockIcon />
  },
  {
    id: 'sponsor',
    type: 'sponsor',
    data: {
      label: 'Sponsor'
    },
    nodeIcon: <SponsorBlockIcon />
  },
  {
    id: 'custom',
    type: 'custom',
    data: { label: 'Custom' },
    nodeIcon: <CustomBlockIcon />
  },
  {
    id: 'system',
    type: 'system',
    data: { label: 'System' },
    nodeIcon: <SystemBlockIcon />
  },
  {
    id: 'gateway',
    type: 'gateway',
    data: {
      label: 'Gateway'
    },
    nodeIcon: <GatewayBlockIcon />
  }
];
