import React from 'react';
import './block-tray.css';
import { CATEGORY_TYPES, NODE_TYPES } from '../../constants';

export const BlockTray = ({ category = CATEGORY_TYPES.TASK }) => {
  const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/nodeData', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="task-tray-aside">
      {NODE_TYPES.filter((x) => x.category === category).map((node) => {
        return (
          <div key={node.id} className="dnd-node" onDragStart={(event) => onDragStart(event, node)} draggable>
            <button className="dnd-node-field">
              <span className="dnd-node-field-icon">{node.nodeIcon}</span>
              <span className="dnd-node-field-text"> {node.type}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
