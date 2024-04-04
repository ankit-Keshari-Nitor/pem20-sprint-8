import React from 'react';
import { Handle, Position } from 'reactflow';
import './task-node.css';

export default function TaskNode({ data, isConnectable }) {
  return (
    <div className="task-node-container">
      {data.label}
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#000' }}
        onConnect={(params) => console.log('Left handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: 10, background: '#000' }}
        onConnect={(params) => console.log('Right handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </div>
  );
}
