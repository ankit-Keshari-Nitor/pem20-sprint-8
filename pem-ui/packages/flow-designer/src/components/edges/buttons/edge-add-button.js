import React from 'react';
import './edge-add-button.scss';
import { Popover, PopoverContent } from '@carbon/react';
import { useState } from 'react';
import { CATEGORY_TYPES, NODE_TYPES } from '../../../constants';
import { getBezierPath } from 'reactflow';

const EdgeAddButton = (props) => {
  const { data, id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition } = props;
  console.log('props', props);
  const [openContextMenu, setOpenContextMenu] = useState(false);

  const [labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  });

  return (
    <div
      onClick={() => {
        setOpenContextMenu(!openContextMenu);
      }}
    >
      <Popover open={openContextMenu}>
        <button
          className="edge-add-Button"
          type="button"
          onClick={() => {
            setOpenContextMenu(!openContextMenu);
          }}
        >
          +
        </button>
        <PopoverContent>
          <div>
            <ul style={{ margin: '4px 0px' }}>
              {NODE_TYPES.filter((x) => x.category === CATEGORY_TYPES.TASK).map((node, i) => {
                return (
                  <li className="node-type-list" key={i} onClick={() => data.onAddNodeCallback({ id, type: node.type, position: { x: labelX, y: labelY } })}>
                    <label className="node-type-list-label">{node.type}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        </PopoverContent>{' '}
      </Popover>
    </div>
  );
};

export default EdgeAddButton;
