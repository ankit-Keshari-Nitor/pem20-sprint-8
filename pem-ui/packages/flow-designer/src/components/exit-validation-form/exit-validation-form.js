import React, { useState } from 'react';
import { TextArea, Grid, Column } from '@carbon/react';
import './exit-validation-form.scss';
import CarbonWrapper from './condition-builder-wrapper/carbon-wrapper';
import QueryBuilder, { defaultOperators, formatQuery } from 'react-querybuilder';
import { QueryBuilderDnD } from '@react-querybuilder/dnd';
import * as ReactDnD from 'react-dnd';
import * as ReactDndHtml5Backend from 'react-dnd-html5-backend';
import { INITIAL_QUERY, QUERY_COMBINATOR, QUERY_FIELDS } from '../../constants';

export default function ExitValidationFrom() {
  const [query, setQuery] = useState(INITIAL_QUERY);
  return (
    <div className="query-builder">
      <CarbonWrapper>
        <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
          <QueryBuilder
            fields={QUERY_FIELDS}
            query={query}
            onQueryChange={setQuery}
            combinators={QUERY_COMBINATOR}
            controlClassnames={{ queryBuilder: 'queryBuilder-branches', body: 'inline-indycomb-left' }}
          />
        </QueryBuilderDnD>
      </CarbonWrapper>
      <Grid className="grid-margin grid-margin-top">
        <Column lg={16}>
          <TextArea placeholder="Enter Text" labelText="Error Message" rows={4} id="text-area-1" />
        </Column>
      </Grid>
    </div>
  );
}
