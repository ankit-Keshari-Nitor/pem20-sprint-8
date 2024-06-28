import React, { useState } from 'react';
import { Modal } from '@carbon/react';
import { TASK_NODE_TYPES } from '../../constants';
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
    readOnly } = props;

  const [openExpandMode, setOpenExpandMode] = useState(false);

  const getForm = (selectedNode) => {
    switch (selectedNode && selectedNode.type) {
      case TASK_TASK_NODE_TYPESS.PARTNER:
        return <BlockDefinitionForm id={'partner-define-form'} schema={PARTNER_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.APPROVAL:
        return <BlockDefinitionForm id={'approval-define-form'} schema={APPROVAL_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.ATTRIBUTE:
        return <BlockDefinitionForm id={'attribute-define-form'} schema={ATTRIBUTE_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.SPONSOR:
        return <BlockDefinitionForm id={'sponsor-define-form'} schema={SPONSOR_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.CUSTOM:
        return <BlockDefinitionForm id={'custom-define-form'} schema={CUSTOM_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.SYSTEM:
        return <BlockDefinitionForm id={'system-define-form'} schema={SYSTEM_FORM_SCHEMA} selectedNode={selectedNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.DIALOG:
        return <BlockDefinitionForm id={'dialog-define-form'} schema={DIALOG_FORM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.XSLT:
        return <BlockDefinitionForm id={'xslt-define-form'} schema={XSLT_FROM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.API:
        return <BlockDefinitionForm id={'api-define-form'} schema={API_FORM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} readOnly={readOnly} />;
      case TASK_NODE_TYPES.GATEWAY:
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
