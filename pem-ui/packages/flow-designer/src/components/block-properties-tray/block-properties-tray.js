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
import { Column, Grid, Modal, Select, SelectItem } from '@carbon/react';
import ActivityTaskDefinition from '../block-definition-forms/activity-task-definition';

export default function BlockPropertiesTray({ selectedNode, selectedTaskNode, setOpenPropertiesBlock, editDefinitionProp }) {
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
        return <DialogTaskDefinitionForm selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} />;
      case NODE_TYPE.XSLT:
        return <XsltTaskDefinitionForm selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} />;
      case NODE_TYPE.API:
        return <ApiTaskDefinitionForm selectedNode={selectedNode} selectedTaskNode={selectedTaskNode} />;
      default:
        return <ActivityTaskDefinition id={'activity-drawer'} editDefinitionProp={editDefinitionProp} />;
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
                  <span>{selectedNode?.data?.editableProps.name} ({selectedNode?.data?.taskName})</span>
                ) : (
                  <span>{selectedNode?.id} ({selectedNode?.data?.taskName})</span>
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
        {getForm(selectedNode)}
      </div>
      <Modal
        open={openExpandMode}
        onRequestClose={() => setOpenExpandMode(false)}
        isFullWidth
        modalHeading={selectedNode?.data?.editableProps.name ? (
          <span>{selectedNode?.data?.editableProps.name} ({selectedNode?.data?.taskName})</span>
        ) : (
          <span>{selectedNode?.id} ({selectedNode?.data?.taskName})</span>
        )}
        passiveModal
        primaryButtonText="Exit"
        secondaryButtonText="Cancel"
      >
        <div className="block-properties-modal">{getForm(selectedNode)}</div>
      </Modal>
    </>
  );
}
