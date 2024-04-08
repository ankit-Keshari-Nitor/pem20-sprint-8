import React from 'react';
import { Handle, Position } from 'reactflow';

export default function StartNode({ data, isConnectable }) {
  return (
    <div style={{ border: '1px solid #61E897' }}>
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: '8px', height: '8px', background: '#61E897' }}
        onConnect={(params) => console.log('Right handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </div>
  );
}
