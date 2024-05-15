import React, { useState } from 'react';
import './block-properties-tray.scss';
import { NODE_TYPE } from '../../constants';
import {
  ApiTaskDefinitionForm,
  ApprovalTaskDefinitionForm,
  AttributeTaskDefinitionForm,
  CustomTaskDefinitionForm,
  DialogTaskDefinitionForm,
  PartnerTaskDefinitionForm,
  SponsorTaskDefinitionForm,
  SystemTaskDefinitionForm,
  XsltTaskDefinitionForm
} from '../block-definition-forms';
import { CrossIcon, ExpandIcon } from './../../icons';
import { Modal } from '@carbon/react';

export default function BlockPropertiesTray({ selectedNode, setOpenPropertiesBlock }) {
  const [openExpandMode, setOpenExpandMode] = useState(false);

  const getForm = (selectedNode) => {
    switch (selectedNode && selectedNode.type) {
      case NODE_TYPE.PARTNER:
        return <PartnerTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.APPROVAL:
        return <ApprovalTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.ATTRIBUTE:
        return <AttributeTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.SPONSOR:
        return <SponsorTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.CUSTOM:
        return <CustomTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.SYSTEM:
        return <SystemTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.GATEWAY:
        return null;
      case NODE_TYPE.DIALOG:
        return <DialogTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.XSLT:
        return <XsltTaskDefinitionForm selectedNode={selectedNode} />;
      case NODE_TYPE.API:
        return <ApiTaskDefinitionForm selectedNode={selectedNode} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="block-properties-container">
        <div className="title-bar">
          <span className="title">
            {selectedNode?.data?.editableProps.name} ({selectedNode?.data?.taskName})
          </span>
          <div className="icon">
            <span onClick={() => setOpenExpandMode(true)} className="icon">
              <ExpandIcon />
            </span>
            <span onClick={() => setOpenPropertiesBlock(false)} className="icon" style={{ marginLeft: '1rem' }}>
              <CrossIcon />
            </span>
          </div>
        </div>
        {getForm(selectedNode)}
      </div>
      <Modal
        open={openExpandMode}
        onRequestClose={() => setOpenExpandMode(false)}
        isFullWidth
        modalHeading={selectedNode?.data?.editableProps.name}
        passiveModal
        primaryButtonText="Exit"
        secondaryButtonText="Cancel"
      >
        <div className="block-properties-modal">{getForm(selectedNode)}</div>
      </Modal>
    </>
  );
}
