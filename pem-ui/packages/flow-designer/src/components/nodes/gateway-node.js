/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './task-node.css';
import { GatewayNodeIcon } from '../../icons';

export default function GatewayNode(nodeConfig) {
  const { onDoubleClick } = nodeConfig?.data;

  const [openContextMenu, setOpenContextMenu] = useState(false);

  return (
    <div
      onClick={() => {
        setOpenContextMenu(!openContextMenu);
      }}
      onDoubleClick={onDoubleClick}
      className="gateway-node-container"
    >
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#565656' }} isConnectable={nodeConfig?.isConnectable} />
      <GatewayNodeIcon />
      <Handle id="top" type="source" position={Position.Top} style={{ background: '#565656' }} isConnectable={nodeConfig?.isConnectable} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#565656' }} isConnectable={nodeConfig?.isConnectable} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#565656' }} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
