/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Handle, Position } from 'reactflow';
import './style.scss';

export default function EndNode(nodeConfig) {
  return (
    <div className="end-node-container">
      <Handle id="end-node-left" type="target" position={Position.Left} style={{ background: '#ed3e32' }} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
