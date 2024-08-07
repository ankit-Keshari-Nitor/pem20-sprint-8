import React from 'react';
import './blocks-tray.scss';
import { CATEGORYS, CATEGORY_TYPES } from '../../constants';

export const BlocksTray = ({ category = CATEGORYS.TASK, readOnly }) => {
  const onDragStart = (event, node) => {
    event.dataTransfer.setData('application/nodeData', JSON.stringify(node));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="task-tray-aside">
      {CATEGORY_TYPES[category].map((node) => {
        return (
          <div key={`${node.category}_${node.taskName}`} className="block-tray" onDragStart={(event) => onDragStart(event, node)} draggable={!readOnly}>
            <button className={`block-tray-field ${node.type}`}>
              <span className="block-tray-field-icon">{node.nodeIcon}</span>
              <span className="block-tray-field-text"> {node.shortName}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
