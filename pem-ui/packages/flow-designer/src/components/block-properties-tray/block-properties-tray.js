import React, { useState } from 'react';
import { Modal } from '@carbon/react';
import { NODE_TYPE } from '../../constants';
import { CrossIcon, ExpandIcon } from './../../icons';
import BlockDefinitionForm from '../block-definition-form';
import {
  PARTNER_FORM_SCHEMA,
  APPROVAL_FORM_SCHEMA,
  ATTRIBUTE_FORM_SCHEMA,
  CUSTOM_FORM_SCHEMA,
  DIALOG_FORM_SCHEMA,
  SPONSOR_FORM_SCHEMA,
  SYSTEM_FORM_SCHEMA,
  XSLT_FROM_SCHEMA,
  API_FORM_SCHEMA
} from './../../constants/define-form-renderer.schema';

import './block-properties-tray.scss';

export default function BlockPropertiesTray(props) {
  const {
    selectedNode, //partner,approval,attribute,sponsor,system,custom
    selectedTaskNode, //dialog,xslt,api
    setOpenPropertiesBlock,
    readOnly
  } = props;

  const [openExpandMode, setOpenExpandMode] = useState(false);

  const getForm = (selectedNode) => {
    switch (selectedNode && selectedNode.type) {
      case NODE_TYPE.PARTNER:
        return <BlockDefinitionForm id={'partner-define-form'} schema={PARTNER_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case NODE_TYPE.APPROVAL:
        return <BlockDefinitionForm id={'approval-define-form'} schema={APPROVAL_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case NODE_TYPE.ATTRIBUTE:
        return <BlockDefinitionForm id={'attribute-define-form'} schema={ATTRIBUTE_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case NODE_TYPE.SPONSOR:
        return <BlockDefinitionForm id={'sponsor-define-form'} schema={SPONSOR_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case NODE_TYPE.CUSTOM:
        return <BlockDefinitionForm id={'custom-define-form'} schema={CUSTOM_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case NODE_TYPE.SYSTEM:
        return <BlockDefinitionForm id={'system-define-form'} schema={SYSTEM_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case NODE_TYPE.DIALOG:
        return <BlockDefinitionForm id={'dialog-define-form'} schema={DIALOG_FORM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} readOnly={readOnly} />;
      case NODE_TYPE.XSLT:
        return <BlockDefinitionForm id={'xslt-define-form'} schema={XSLT_FROM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} readOnly={readOnly} />;
      case NODE_TYPE.API:
        return <BlockDefinitionForm id={'api-define-form'} schema={API_FORM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} readOnly={readOnly} />;
      case NODE_TYPE.GATEWAY:
        return null;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="block-properties-container">
        <div className="title-bar">
          <span className="title">
            <span>
              {selectedNode?.data?.editableProps.name ? (
                <span>
                  {selectedNode?.data?.editableProps.name} ({selectedNode?.data?.taskName})
                </span>
              ) : (
                <span>
                  {selectedNode?.id} ({selectedNode?.data?.taskName})
                </span>
              )}
            </span>
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
        <div className="block-properties-form">{getForm(selectedNode)}</div>
      </div>
      <Modal
        open={openExpandMode}
        onRequestClose={() => setOpenExpandMode(false)}
        isFullWidth
        modalHeading={
          selectedNode?.data?.editableProps.name ? (
            <span>
              {selectedNode?.data?.editableProps.name} ({selectedNode?.data?.taskName})
            </span>
          ) : (
            <span>
              {selectedNode?.id} ({selectedNode?.data?.taskName})
            </span>
          )
        }
        passiveModal
        primaryButtonText="Exit"
        secondaryButtonText="Cancel"
      >
        <div className="block-properties-modal">{getForm(selectedNode)}</div>
      </Modal>
    </>
  );
}
