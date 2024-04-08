import React from 'react';
import './sidetray.css';
import { NODE_TYPES } from '../constants';

export const BlockTray = ({ blockType = "group1" }) => {

  console.log(blockType);
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="task-tray-aside">
      {NODE_TYPES.filter((x) => x.blockType == blockType).map((node) => {
        return (
          <div key={node.id} className="dnd-node" onDragStart={(event) => onDragStart(event, node.type)} draggable>
            <button className="dnd-node-field">
              <span className="dnd-node-field-icon">
                <>{node.nodeIcon}</>
              </span>
              <span className="dnd-node-field-text"> {node.data.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
