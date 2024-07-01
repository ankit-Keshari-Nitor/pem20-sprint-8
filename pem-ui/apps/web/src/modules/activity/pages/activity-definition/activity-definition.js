import React, { useState, useEffect, useRef,useCallback } from 'react';
import Designer from '@b2bi/flow-designer';
import './activity-definition.css';
import useActivityStore from '../../store';
import { getActivityDetails } from '../../services/activity-service';
import { getActivityVersions } from '../../services/actvity-version-service';
import { OPERATIONS, ROUTES } from '../../constants';
import { Button, Column, Grid } from '@carbon/react';
import { CloneIcon, CopyIcon, DeleteIcon, HistoryIcon, PlayIcon } from '../../icons';

export default function ActivityDefinition() {
  const currentActivity = useActivityStore((state) => state.selectedActivity);
  const activityReset = useActivityStore((state) => state.reset);
  const setSelectedActivity = useActivityStore((state) => state.setSelectedActivity);
  const updateActivityDetails = useActivityStore((state) => state.updateActivityDetails);
  const updateActivitySchema = useActivityStore((state) => state.updateActivitySchema);

  const [showActivityDefineDrawer, setShowActivityDefineDrawer] = useState();
  const [activityDefinitionData, setActivityDefinitionData] = useState();

  const [activityVersions, setActivityVersions] = useState([]);

  const readOnly = currentActivity?.operation === OPERATIONS.VIEW ? true : false;
  const ref = useRef();

  useEffect(() => {
    if (activityDefinitionData?.id !== '' || activityDefinitionData?.name === '' || activityDefinitionData?.name === null || activityDefinitionData?.name === undefined) {
      setShowActivityDefineDrawer(true);
    } else {
      setShowActivityDefineDrawer(false);
    }
  }, [activityDefinitionData]);


  const getActivityData = useCallback(() => async (activityDefKey) => {
    const response = await getActivityDetails(activityDefKey);
    if (response.success) {
      setActivityDefinitionData(response.data);
    }
    const activityVersionsResponse = await getActivityVersions(activityDefKey);
    if (activityVersionsResponse.success) {
      setActivityVersions(activityVersionsResponse.data);
    }
  }, []);

  useEffect(() => {
    if (currentActivity && currentActivity.activityDefKey) {
      getActivityData(currentActivity.activityDefKey);
    }
    return (() => {
      setSelectedActivity(null);
      activityReset();
    })
  }, [currentActivity, getActivityData,activityReset,setSelectedActivity])


  const saveActivity = () => {
    //todo - make api call to save the activity
    //prepare a file json data of activity and schema
    //post api call to save data
    activityReset();
  }

  return (
    <>
      <Grid className="activity-actions" fullWidth>
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
        <Column>
          <Button id="saveactivity" href={ROUTES.ACTIVITY_LIST} onClick={() => saveActivity()}>
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
        activityOperation={currentActivity?currentActivity.operation:'New'}
        readOnly={readOnly}
        onVersionSelection={(selectedVersion) => console.log(selectedVersion)}
        versionData={activityVersions}//todo -- this data will be based on version api response 
        selectedVersion={currentActivity? currentActivity.version:'Ver.1'}//todo - pass current version id being loaded
      />
    </>
  );
}
