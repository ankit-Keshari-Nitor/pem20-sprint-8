import React from 'react';

import './block-properties-tray.scss';
import { NODE_TYPE } from '../../constants';
import { ApprovalTaskDefinitionForm } from '../block-definition-forms';
import { CrossIcon } from './../../icons';

export default function BlockPropertiesTray({ selectedNode, setOpenPropertiesBlock }) {
  const getForm = (selectedNode) => {
    switch (selectedNode && selectedNode.type) {
      case NODE_TYPE.APPROVAL:
        return <ApprovalTaskDefinitionForm selectedNode={selectedNode} />;
      default:
        return null;
    }
  };

  return (
    <div className="block-properties-container">
      <div className="title-bar">
        <span className="title">
          {selectedNode?.data?.editableProps.name} ({selectedNode?.data?.taskName})
        </span>
        <span onClick={() => setOpenPropertiesBlock(false)} style={{ cursor: 'pointer' }}>
          <CrossIcon />
        </span>
      </div>
      {getForm(selectedNode)}
    </div>
  );
}
