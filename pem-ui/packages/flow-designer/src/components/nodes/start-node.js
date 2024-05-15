/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Handle, Position } from 'reactflow';
import './style.scss';
export default function StartNode(nodeConfig) {
  return (
    <div className="start-node-container">
      <Handle id="start-node-right" type="source" position={Position.Right} style={{ background: '#61e897' }} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
