import React, { useState, useEffect, useRef } from 'react';
import Designer from '@b2bi/flow-designer';
import './activity-definition.css';
import useActivityStore from '../../store';
import { OPERATIONS } from '../../constants';

export default function ActivityDefinition() {
  const currentActivity = useActivityStore((state) => state.selectedActivity);
  const activityStore = useActivityStore((state) => state.activityData);
  const activityReset = useActivityStore((state) => state.reset);

  const editDefinitionProp = useActivityStore((state) => state.editDefinitionProps);
  const editSchemaProp = useActivityStore((state) => state.editSchemaProps);
  
  const [showActivityDefineDrawer, setShowActivityDefineDrawer] = useState();
  const [activityDefinitionData, setActivityDefinitionData] = useState();

  const readOnly = currentActivity.operation === OPERATIONS.VIEW ? true : false;
  const ref = useRef();

  useEffect(() => {
    if (activityDefinitionData?.id !== '' || activityDefinitionData?.name === '' || activityDefinitionData?.name === null || activityDefinitionData?.name === undefined) {
      setShowActivityDefineDrawer(true);
    } else {
      setShowActivityDefineDrawer(false);
    }
  }, [activityDefinitionData]);

  useEffect(() => {
    setActivityDefinitionData(activityStore.definition);
  }, [activityStore]);


  useEffect(()=>{
    return (()=>{
      //clear the current activity from the store
      console.log('clear the current activity from the store')
    })
 // TODO if we get activityDefinitionVersion Key and activityDefinition Key then make api call to load data
  },[])

  const handleActivityReset = () => {
    //ref.current?.handleRest();
    activityReset();
  };

  const saveActivity = () => {
    handleActivityReset()
  }

  return (
    <>
      {/* <Grid className="activity-actions">
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
          <Button id="saveactivity" onClick={saveActivity} disabled={readOnly}>
            Save Activity
          </Button>
        </Column>
      </Grid> */}
      <Designer.WorkFlowDesigner
        ref={ref}
        showActivityDefineDrawer={showActivityDefineDrawer}
        setShowActivityDefineDrawer={setShowActivityDefineDrawer}
        editDefinitionProp={editDefinitionProp}
        editSchemaProp={editSchemaProp}
        activityDefinitionData={activityDefinitionData}
        activityOperation={currentActivity.operation}
        readOnly={readOnly}
        onVersionSelection={(selectedVersion)=> console.log(selectedVersion)}
        versionData={[]}//todo -- this data will be based on version api response 
        selectedVersion={"1"}//todo - pass current version id being loaded
      />
    </>
  );
}
