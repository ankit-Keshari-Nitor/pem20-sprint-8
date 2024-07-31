import React, { useState } from 'react';
import { Column, Grid, Modal } from '@carbon/react';
import ActivityTaskDefinition from '../activity-task-definition';
import { CrossIcon, ExpandIcon } from './../../icons';
import ActivityVersions from './activity-versions-dropdown';
import './../block-properties-tray/block-properties-tray.scss';

export default function ActivityDefinitionForm(props) {
  const { readOnly, versionData = [], setShowActivityDefineDrawer, onActivityDetailsSave, activityOperation, activityDefinitionData } = props;

  const [openExpandMode, setOpenExpandMode] = useState(false);

  const onSubmitDefinitionForm = (values) => {
    const definition = {
      definationKey: '',
      name: values.name,
      description: values.description,
      contextData: values.contextData,
      encrypted: values.encrypted
    };
    const version = {
      encrypted: values.encrypted ? values.encrypted : false,
      contextData: values.contextData,
      status: 'Draft',
      number: 1,
      key: ''
    };
    onActivityDetailsSave({ definition, version });
    setShowActivityDefineDrawer(false);
  };

  return (
    <div className="block-properties-container">
      <div className="title-bar">
        <div className="title">
          <Grid fullWidth>
            <Column lg={6} md={3} sm={2}>
              <b>Define Activity</b>
            </Column>
            <Column lg={4} md={2} sm={1} className="activity-active">
              {versionData.length > 0 ? 'Active' : 'Draft'}
            </Column>
            <Column lg={6} md={3} sm={2} className="activity-version-dropdown">
              {versionData.length > 0 && <ActivityVersions {...props} />}
            </Column>
          </Grid>
        </div>
        <div className="icon">
          <span onClick={() => setOpenExpandMode(true)} className="icon">
            <ExpandIcon />
          </span>
          <span onClick={() => setShowActivityDefineDrawer(false)} className="icon" style={{ marginLeft: '1rem' }}>
            <CrossIcon />
          </span>
        </div>
      </div>
      <ActivityTaskDefinition
        id={'activity-drawer'}
        onSubmitDefinitionForm={onSubmitDefinitionForm}
        activityOperation={activityOperation}
        activityDefinitionData={activityDefinitionData}
        readOnly={readOnly}
        setShowActivityDefineDrawer={setShowActivityDefineDrawer}
      />
      <Modal
        open={openExpandMode}
        onRequestClose={() => setOpenExpandMode(false)}
        isFullWidth
        modalHeading={
          <Grid fullWidth>
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
              onSubmitDefinitionForm={onSubmitDefinitionForm}
              activityOperation={activityOperation}
              activityDefinitionData={activityDefinitionData}
              readOnly={readOnly}
              setShowActivityDefineDrawer={setShowActivityDefineDrawer}
            />
          }
        </div>
      </Modal>
    </div>
  );
}
