import React from "react";
import "./tasks-tray.css";
import { NODE_TYPES } from "../../constants/constants";

export const TasksTray = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside>
      {NODE_TYPES.map((node) => {
        return (
          <div
            className="dndnode"
            onDragStart={(event) => onDragStart(event, node.nodeType)}
            draggable
          >
            <button className="palette-field">
              <span className="palette-field-icon">
                <>{node.nodeIcon}</>
              </span>
              <span className="palette-field-text"> {node.nodeLabel}</span>
            </button>
          </div>
        );
      })}
    </aside>
  );
};
