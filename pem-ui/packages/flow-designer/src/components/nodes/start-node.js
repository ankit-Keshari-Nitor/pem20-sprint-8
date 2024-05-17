import React from 'react';
import { Handle, Position } from 'reactflow';
import './style.scss';
export default function StartNode(nodeConfig) {
  return (
    <div className="start-node-container">
      <Handle id="start-node-right" type="source" position={Position.Right} style={{ background: '#61e897', width: '10px', height: '10px' }} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
