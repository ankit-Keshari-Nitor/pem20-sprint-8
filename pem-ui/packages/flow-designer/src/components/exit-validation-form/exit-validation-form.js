import React, { useState } from 'react';
import * as ReactDnD from 'react-dnd';
import { TextArea, Grid, Column, Button } from '@carbon/react';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import CarbonWrapper from './condition-builder-wrapper/carbon-wrapper';
import QueryBuilder, { formatQuery } from 'react-querybuilder';
import { validationQuery } from '../helpers/generate-validation-query';
import { INITIAL_QUERY, QUERY_COMBINATOR, QUERY_FIELDS } from '../../constants';

import './exit-validation-form.scss';

export default function ExitValidationFrom({ onSubmitExitValidationForm, setOpenCancelDialog, readOnly={readOnly} }) {
  const [query, setQuery] = useState(INITIAL_QUERY);
  return (
    <>
      <Grid>
        <Column className="form-field" lg={16}>
          <CarbonWrapper>
            <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
              <QueryBuilder
                fields={QUERY_FIELDS}
                query={query}
                onQueryChange={setQuery}
                combinators={QUERY_COMBINATOR}
                controlClassnames={{ queryBuilder: 'queryBuilder-branches', body: 'inline-indycomb-left' }}
                disabled={readOnly}
              />
            </QueryBuilderDnD>
          </CarbonWrapper>
        </Column>
        <Column className="form-field" lg={16}>
          <TextArea placeholder="Enter Text" labelText="Error Message" rows={4} id="text-area-1" readOnly={readOnly} />
        </Column>
        <Column className="form-field" lg={16}>
          <h4>Query</h4>
          <pre>
            <code>{formatQuery(validationQuery(query), 'json')}</code>
          </pre>
        </Column>
        <Column lg={8}>
          <Button data-testid="cancel" name="cancel" kind="secondary" type="button" className="cancel-button" disabled={readOnly} onClick={setOpenCancelDialog}>
            Cancel
          </Button>
        </Column>
        <Column lg={8}>
          <Button data-testid="save" color="primary" variant="contained" type="submit" style={{ width: '100%' }} disabled={readOnly} onClick={() => onSubmitExitValidationForm(query)}>
            Save
          </Button>
        </Column>
      </Grid>
    </>
  );
}
