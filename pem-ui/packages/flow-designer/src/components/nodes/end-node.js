import React from 'react';
import { Handle, Position } from 'reactflow';

export default function EndNode({ data, isConnectable }) {
  return (
    <div style={{ border: '1px solid #ED3E32' }}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#ED3E32', width: '16px', height: '16px' }}
        onConnect={(params) => console.log('Left handle onConnect', params)}
        isConnectable={isConnectable}
      />
    </div>
  );
}
