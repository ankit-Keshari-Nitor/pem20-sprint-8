import { Form, Grid, Column, TextArea, TextInput, Button } from '@carbon/react';
import React from 'react';

export default function ApiDefineForm({ id }) {
  return (
    <>
      <Form aria-label="approval form" data-testid={id}>
        <Grid>
          <Column className="col-margin" lg={16}>
            <TextInput id="one" labelText="Name" />
          </Column>
          <Column className="col-margin" lg={16}>
            <TextArea id="one" labelText="Description" />
          </Column>
        </Grid>
        <Grid className="buttons-wrapper-grid">
          <Column lg={8}>
            <Button type="button" kind="secondary" className="cancel-button">
              Cancel
            </Button>
          </Column>
          <Column lg={8}>
            <Button type="submit" kind="secondary" className="save-button">
              Save
            </Button>
          </Column>
        </Grid>
      </Form>
    </>
  );
}
