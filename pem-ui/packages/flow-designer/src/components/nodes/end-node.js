import React from 'react';
import { Handle, Position } from 'reactflow';
import './style.scss';

export default function EndNode(nodeConfig) {
  return (
    <div className="end-node-container">
      <Handle
        id="end-node-left"
        type="target"
        position={Position.Left}
        style={{ background: '#ed3e32', width: '10px', height: '10px' }}
        isConnectable={nodeConfig?.isConnectable}
      />
    </div>
  );
}
