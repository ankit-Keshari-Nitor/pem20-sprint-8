import React, { useState, useEffect, useRef } from 'react';
import Designer from '@b2bi/flow-designer';
import './activity-definition.css';
import useActivityStore from '../../store';
import { getActivityDetails } from '../../services/activity-service';
import { OPERATIONS } from '../../constants';
import { Button, Column, Grid } from '@carbon/react';
import { CloneIcon, CopyIcon, DeleteIcon, HistoryIcon, PlayIcon } from '../../icons';

export default function ActivityDefinition() {
  //const store = useActivityStore();
  const activityObj = useActivityStore((state) => state.activityData);
  const currentActivity = useActivityStore((state) => state.selectedActivity);
  const updateActivitySchema = useActivityStore((state) => state.updateActivitySchema);
  const updateActivityDetails = useActivityStore((state) => state.updateActivityDetails);

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


  const getActivityData = (activityDefKey, versionKey) => {
    getActivityDetails(activityDefKey, versionKey).then((response) => {
      if (response.success) {
        setActivityDefinitionData(response.definition);
        setActivityVersions(response.versions | []);
      } else {
        console.log('error in api call');
      }
    });
  }


  useEffect(() => {
    if (currentActivity && currentActivity.activityDefKey) {
      getActivityData(currentActivity.activityDefKey, currentActivity.actDefVerKey);
    }
    return (() => {
      //store.reset();
    })
  }, [currentActivity, getActivityData])


  const saveActivity = () => {
    console.log('activityObj', activityObj);
    //todo - make api call to save the activity
    //prepare a file json data of activity and schema
    //post api call to save data
    // activityReset();
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
          <Button id="saveactivity" onClick={() => saveActivity()}
            disabled={activityObj.definition.name.trim().length === 0}
          >
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
        versionData={activityVersions}//todo -- this data will be based on version api response 
        selectedVersion={currentActivity ? currentActivity.version : 'Ver.1'}//todo - pass current version id being loaded
      />
    </>
  );
}
