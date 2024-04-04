import React from 'react';
import './tasks-tray.css';
import { NODE_TYPES } from './../../constants/constants';

export const TasksTray = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="task-tray-aside">
      {NODE_TYPES.map((node) => {
        return (
          <div className="dnd-node" onDragStart={(event) => onDragStart(event, node.type)} draggable>
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
