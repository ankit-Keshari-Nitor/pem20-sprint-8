import React, { useState, useEffect, useRef } from 'react';
import Designer from '@b2bi/flow-designer';
import './activity-definition.css';
import useActivityStore from '../../store';
import { getActivityDetails, saveActivityData } from '../../services/activity-service';
import { OPERATIONS } from '../../constants';
import { Button, Column, Grid } from '@carbon/react';
import { CloneIcon, CopyIcon, DeleteIcon, HistoryIcon, PlayIcon } from '../../icons';
//import { saveAs } from 'file-saver';
import Notification from '../../helpers/wrapper-notification-toast';
import Shell from '@b2bi/shell';

export default function ActivityDefinition() {
  const store = useActivityStore();
  const pageUtil = Shell.PageUtil();
  const activityObj = useActivityStore((state) => state.activityData);
  const currentActivity = useActivityStore((state) => state.selectedActivity);
  const updateActivitySchema = useActivityStore((state) => state.updateActivitySchema);
  const updateActivityDetails = useActivityStore((state) => state.updateActivityDetails);
  const [notificationProps, setNotificationProps] = useState(null);
  const [showActivityDefineDrawer, setShowActivityDefineDrawer] = useState(true);

  const [activityDefinitionData, setActivityDefinitionData] = useState(store.activityData);
  const [activityVersions, setActivityVersions] = useState([]);

  const readOnly = currentActivity?.operation === OPERATIONS.VIEW ? true : false;
  const ref = useRef();

  useEffect(() => {
    const getActivityData = (activityDefKey, versionKey) => {
      getActivityDetails(activityDefKey, versionKey).then((response) => {
        if (response.success) {
          setActivityDefinitionData(response.definition);
          setActivityVersions(response.versions | []);
        } else {
          console.log('error in api call');
        }
      });
    };
    if (currentActivity && currentActivity.activityDefKey) {
      getActivityData(currentActivity.activityDefKey, currentActivity.actDefVerKey);
    }
    return () => {
      //store.reset();
    };
  }, [currentActivity]);

  useEffect(() => {
    setActivityDefinitionData(store.activityData);
  }, [store.activityData]);

  const saveActivity = async () => {
    const nodes = activityObj.schema.nodes.map((x, index) => {
      return {
        id: x.id ? x.id : `${x.type}-${index}`,
        name: x.data.label,
        type: x.type,
        diagram: {
          x: x.position.x,
          y: x.position.y
        },
        exitCondition: x.validateExitValidationQuery,
        exitConditionErrorMessage: x.exitValidationMessage,
        entryCondition: x.validateEntryValidationQuery,
        entryConditionErrorMessage: x.entryValidationMessage
      };
    });
    const edges = activityObj.schema.edges.map((x) => {
      return {
        id: x.id, //`${x.type}-${index}`,
        source: x.source,
        target: x.target,
        condition: null,
        diagram: []
      };
    });

    const newObj = {
      name: activityObj.definition.name,
      description: activityObj.definition.description,
      schemaVersion: 1.0,
      process: {
        nodes: nodes,
        connectors: edges
      }
    };

    const saveResponse = await saveActivityData(newObj);
    setNotificationProps({
      open: saveResponse.success,
      title: saveResponse.success ? 'Success - ' : 'Error - ',
      subtitle: saveResponse.success ? 'Actvity Created successfully!' : `Actvity creation failed`,
      kind: saveResponse.success ? 'success' : 'error',
      onCloseButtonClick: () => setNotificationProps(null)
    });
    if (saveResponse.success) {
      store.reset();
      setTimeout(() => {
        pageUtil.navigate('/activities', {});
      }, 2000);
    }
  };

  return (
    <>
      <Grid className="activity-actions" fullWidth>
        {currentActivity && currentActivity.activityDefKey !== '' && (
          <>
            <Column>
              <CloneIcon />
            </Column>
            <Column>
              <PlayIcon />
            </Column>
            <Column>
              <DeleteIcon />
            </Column>
            <Column>
              <CopyIcon />
            </Column>
            <Column>
              <HistoryIcon />
            </Column>
          </>
        )}
        <Column>
          <Button id="saveactivity" onClick={() => saveActivity()} disabled={activityObj.definition.name.trim().length === 0}>
            Save Activity
          </Button>
        </Column>
      </Grid>
      <Designer.WorkFlowDesigner
        ref={ref}
        showActivityDefineDrawer={showActivityDefineDrawer}
        setShowActivityDefineDrawer={setShowActivityDefineDrawer}
        updateActivityDetails={updateActivityDetails}
        updateActivitySchema={updateActivitySchema}
        activityDefinitionData={activityDefinitionData}
        activityOperation={currentActivity ? currentActivity.operation : 'New'}
        readOnly={readOnly}
        onVersionSelection={(selectedVersion) => console.log(selectedVersion)}
        versionData={activityVersions} //todo -- this data will be based on version api response
        selectedVersion={currentActivity ? currentActivity.version : 'Ver.1'} //todo - pass current version id being loaded
      />
      {notificationProps && notificationProps.open && <Notification {...notificationProps} />}
    </>
  );
}
