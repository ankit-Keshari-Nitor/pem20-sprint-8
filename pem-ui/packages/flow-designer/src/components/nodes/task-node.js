import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './style.scss';
import { OverflowMenuVertical } from '@carbon/icons-react';
import { Popover, PopoverContent } from '@carbon/react';

export default function TaskNode(nodeConfig) {
  const { borderColor, contextMenu, editableProps, taskName, type } = nodeConfig?.data;
  const [openContextMenu, setOpenContextMenu] = useState(false);

  return (
    <div
      onClick={() => {
        setOpenContextMenu(!openContextMenu);
      }}
      className="task-node-container"
      style={{ borderColor: borderColor }}
    >
      <Handle id="left" type="target" position={Position.Left} isConnectable={nodeConfig?.isConnectable} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ color: borderColor }}>{editableProps.name ? editableProps?.name : nodeConfig?.id}</label>
        <label>{taskName}</label>
      </div>
      <div>
        <Popover open={openContextMenu} isTabTip align={'left-top'} onRequestClose={() => setOpenContextMenu(false)}>
          <button aria-label="Settings" type="button" aria-expanded={openContextMenu}>
            <OverflowMenuVertical />
          </button>
          <PopoverContent className="p-3">
            <div style={{ padding: '10px' }}>
              <ul>
                {contextMenu.map((x, i) => {
                  return (
                    <li key={i}>
                      <label>{x.label}</label>
                      {i + 1 < contextMenu.length && <hr />}
                    </li>
                  );
                })}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <Handle id="right" type="source" position={Position.Right} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
