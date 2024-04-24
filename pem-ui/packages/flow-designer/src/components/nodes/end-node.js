/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './task-node.css';

export default function EndNode(nodeConfig) {
  return (
    <div className="end-node-container">
      <Handle
        id="end-node-left"
        type="target"
        position={Position.Left}
        style={{ background: '#ED3E32' }}
        onConnect={(params) => console.log('Left handle onConnect', params)}
        isConnectable={nodeConfig?.isConnectable}
      />
    </div>
  );
}
