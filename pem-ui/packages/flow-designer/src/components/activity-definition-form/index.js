import React, { useState } from 'react';
import { Column, Grid, Modal } from '@carbon/react';
import ActivityTaskDefinition from '../activity-task-definition';
import { CrossIcon, ExpandIcon } from './../../icons';
import ActivityVersions from './activity-versions-dropdown';
import './../block-definition-form/block-definition-form.scss';

export default function ActivityDefinitionForm(props) {
  const { readOnly, versionData = [], setOpenPropertiesBlock, editDefinitionProp, activityOperation, activityDefinitionData } = props;
  const [openExpandMode, setOpenExpandMode] = useState(false);
  return (
    <div className="block-properties-container">
      <div className="title-bar">
        <span className="title">
          <Grid fullWidth>
            <Column lg={4} md={3} sm={2}>
              <b>Define Activity</b>
            </Column>
            <Column lg={2} md={2} sm={1} className="activity-active">
              Active
            </Column>
            <ActivityVersions {...props} />
          </Grid>
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
      <ActivityTaskDefinition
        id={'activity-drawer'}
        editDefinitionProp={editDefinitionProp}
        activityOperation={activityOperation}
        activityDefinitionData={activityDefinitionData}
        readOnly={readOnly}
      />
      <Modal
        open={openExpandMode}
        onRequestClose={() => setOpenExpandMode(false)}
        isFullWidth
        modalHeading={
          <Grid>
            <Column lg={4} md={3} sm={2}>
              <b>Define Activity</b>
            </Column>
            <Column lg={2} md={2} sm={1} className="activity-active">
              Active
            </Column>
            {versionData.length > 0 && <ActivityVersions {...props} />}
          </Grid>
        }
        passiveModal
        primaryButtonText="Exit"
        secondaryButtonText="Cancel"
      >
        <div className="block-properties-modal">
          {
            <ActivityTaskDefinition
              id={'activity-drawer'}
              editDefinitionProp={editDefinitionProp}
              activityOperation={activityOperation}
              activityDefinitionData={activityDefinitionData}
              readOnly={readOnly}
            />
          }
        </div>
      </Modal>
    </div>
  );
}
