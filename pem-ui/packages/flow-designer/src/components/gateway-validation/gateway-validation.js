import React from 'react';
import ConditionalBuilder from '../condition-builder';
import { Select, SelectItem, Grid, Column } from '@carbon/react';

export default function GatewayValidation({ readOnly, selectedNode }) {
  console.log('selectedNode', selectedNode);
  const onGatewayValidation = (query) => {
    console.log('query', query);
  };
  return (
    <>
      <Grid>
        <Column className="form-field" lg={8}>
          <Select id={`select-1`} labelText="Select dialog">
            <SelectItem value="" text="" />
            <SelectItem value="option-1" text="Option 1" />
            <SelectItem value="option-2" text="Option 2" />
          </Select>
        </Column>
      </Grid>
      <ConditionalBuilder setOpenCancelDialog={() => console.log('Cancel')} onSubmitExitValidationForm={onGatewayValidation} readOnly={readOnly} />
    </>
  );
}
