import React, { useEffect } from 'react';
import ConditionalBuilder from '../condition-builder';
import { Select, SelectItem, Grid, Column } from '@carbon/react';
import useTaskStore from '../../store';

export default function GatewayValidation({ readOnly, selectedNode }) {
  const storeData = useTaskStore((state) => state.tasks);
  
  const onGatewayValidation = (query) => {
    console.log('query', query);
  };

  useEffect(() => {
    if (storeData && storeData.taskEdges.length > 0 && storeData.taskNodes.length > 0) {
      let connectedEdges = storeData.taskEdges.map((edge) => {
        if (edge.source === selectedNode.id) {
          return edge;
        }
      });
      let connectedNodes = storeData.taskNodes.filter((o1) => {
        return connectedEdges.some((o2) => o2.target === o1.id);
      });

      console.log('connectedNodes', connectedNodes);
    }
  }, []);

  return (
    <>
      <Grid>
        <Column className="form-field" lg={8}>
          <Select id={`select-1`} labelText="Select dialog">
            <SelectItem value="option-1" text="Option 1" />
            <SelectItem value="option-2" text="Option 2" />
          </Select>
        </Column>
      </Grid>
      <ConditionalBuilder setOpenCancelDialog={() => console.log('Cancel')} onSubmitExitValidationForm={onGatewayValidation} readOnly={readOnly} />
    </>
  );
}
