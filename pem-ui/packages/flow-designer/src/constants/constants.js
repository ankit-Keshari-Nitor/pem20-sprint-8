import React from 'react';
import { PartnerBlockIcon, CustomBlockIcon, SponsorBlockIcon, SystemBlockIcon, ApprovalBlockIcon, AttributeBlockIcon, GatewayBlockIcon } from '../assets/icons';

export const NODE_TYPES = [
  {
    nodeType: 'partner',
    nodeLabel: 'Partner',
    nodeIcon: <PartnerBlockIcon />
  },
  {
    nodeType: 'approval',
    nodeLabel: 'Approval',
    nodeIcon: <ApprovalBlockIcon />
  },
  {
    nodeType: 'attribute',
    nodeLabel: 'Attribute',
    nodeIcon: <ApprovalBlockIcon />
  },
  {
    nodeType: 'sponsor',
    nodeLabel: 'Sponsor',
    nodeIcon: <SponsorBlockIcon />
  },
  {
    nodeType: 'custom',
    nodeLabel: 'Custom',
    nodeIcon: <CustomBlockIcon />
  },
  {
    nodeType: 'system',
    nodeLabel: 'System',
    nodeIcon: <SystemBlockIcon />
  },
  {
    nodeType: 'gateway',
    nodeLabel: 'Gateway',
    nodeIcon: <GatewayBlockIcon />
  }
];
