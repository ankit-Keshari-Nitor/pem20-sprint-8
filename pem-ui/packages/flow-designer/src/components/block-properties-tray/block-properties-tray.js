import React, { useState } from 'react';
import { Column, Grid, Modal, Select, SelectItem } from '@carbon/react';

import { NODE_TYPE } from '../../constants';
import { CrossIcon, ExpandIcon } from './../../icons';
import BlockDefinitionForm from '../block-definition-form';
import ActivityTaskDefinition from '../activity-task-definition';
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

export default function BlockPropertiesTray({ selectedNode, selectedTaskNode, setOpenPropertiesBlock, editDefinitionProp, activityDefinitionData }) {
  const [openExpandMode, setOpenExpandMode] = useState(false);

  const getForm = (selectedNode) => {
    switch (selectedNode && selectedNode.type) {
      case NODE_TYPE.PARTNER:
        return <BlockDefinitionForm id={'partner-define-form'} schema={PARTNER_FORM_SCHEMA} selectedNode={selectedNode} />;
      case NODE_TYPE.APPROVAL:
        return <BlockDefinitionForm id={'approval-define-form'} schema={APPROVAL_FORM_SCHEMA} selectedNode={selectedNode} />;
      case NODE_TYPE.ATTRIBUTE:
        return <BlockDefinitionForm id={'attribute-define-form'} schema={ATTRIBUTE_FORM_SCHEMA} selectedNode={selectedNode} />;
      case NODE_TYPE.SPONSOR:
        return <BlockDefinitionForm id={'sponsor-define-form'} schema={SPONSOR_FORM_SCHEMA} selectedNode={selectedNode} />;
      case NODE_TYPE.CUSTOM:
        return <BlockDefinitionForm id={'custom-define-form'} schema={CUSTOM_FORM_SCHEMA} selectedNode={selectedNode} />;
      case NODE_TYPE.SYSTEM:
        return <BlockDefinitionForm id={'system-define-form'} schema={SYSTEM_FORM_SCHEMA} selectedNode={selectedNode} />;
      case NODE_TYPE.DIALOG:
        return <BlockDefinitionForm id={'dialog-define-form'} schema={DIALOG_FORM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} />;
      case NODE_TYPE.XSLT:
        return <BlockDefinitionForm id={'xslt-define-form'} schema={XSLT_FROM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} />;
      case NODE_TYPE.API:
        return <BlockDefinitionForm id={'api-define-form'} schema={API_FORM_SCHEMA} selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} />;
      case NODE_TYPE.GATEWAY:
        return null;
      default:
        return <ActivityTaskDefinition id={'activity-drawer'} editDefinitionProp={editDefinitionProp} activityDefinitionData={activityDefinitionData} />;
    }
  };

  return (
    <>
      <div className="block-properties-container">
        <div className="title-bar">
          <span className="title">
            {selectedNode ? (
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
            ) : (
              <Grid>
                <Column lg={4} md={3} sm={2}>
                  <b>Define Activity</b>
                </Column>
                <Column lg={2} md={2} sm={1} className="activity-active">
                  Active
                </Column>
                <Column lg={3} md={3} sm={2} id="versions">
                  <Select id={'activity-version'}>
                    <SelectItem value="ver.3.0" text="ver.3.0" />
                    <SelectItem value="ver.2.0" text="ver.2.0" />
                    <SelectItem value="ver.1.0" text="ver.1.0" />
                  </Select>
                </Column>
              </Grid>
            )}
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
