/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import './style.scss';
import { OverflowMenuVertical } from '@carbon/icons-react';
import { Popover, PopoverContent } from '@carbon/react';

export default function TaskNode(nodeConfig) {
  const { borderColor, contextMenu, editableProps, taskName, onDoubleClick, type } = nodeConfig?.data;
  const [openContextMenu, setOpenContextMenu] = useState(false);

  return (
    <div
      onClick={() => {
        setOpenContextMenu(!openContextMenu);
      }}
      onDoubleClick={() => onDoubleClick(type)}
      className="task-node-container"
      style={{ borderColor: borderColor, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <Handle id="left" type="target" position={Position.Left} style={{ background: '#ed3e32' }} isConnectable={nodeConfig?.isConnectable} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ color: borderColor }}>{editableProps?.name}</label>
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
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#61e897' }} isConnectable={nodeConfig?.isConnectable} />
    </div>
  );
}
