import React, { useEffect, useState } from 'react';
import { Select, SelectItem, TextArea, TextInput, Checkbox, Button, Grid, Column } from '@carbon/react';
import './exit-validation-form.scss';
import { Add } from '@carbon/icons-react';
import { CrossIcon, ElippsisIcon, MenuIcon } from '../../icons';

export default function ExitValidationFrom() {
  const [isChecked, setIsChecked] = useState(false);
  const [rows, setRows] = useState([]);
  const [drows, setDrows] = useState([]);

  const handleRow = (rowSize) => {
    const row = (
      <Grid className="exit-grid">
        <Column className="col-margin-right" sm={0} md={0} lg={1}>
          <Checkbox id="checkbox" checked={isChecked} onChange={(_, { checked }) => setIsChecked(checked)} />
        </Column>
        <Column className="col-margin-right" sm={2} md={2} lg={3}>
          <Select id={`select-1`} className="select-opt">
            <SelectItem value="" text="Datatype" />
            <SelectItem value="string" text="String" />
            <SelectItem value="numeric" text="Numeric" />
            <SelectItem value="boolean" text="Boolean" />
            <SelectItem value="Date" text="Date" />
          </Select>
        </Column>
        <Column className="col-margin-right" sm={2} md={2} lg={3}>
          <Grid className="row-sub-grid">
            <Column lg={2}>
              <TextInput id="one" />
            </Column>
            <Column lg={1}>
              <Button size="md" className="opt-btn" kind="secondary" renderIcon={ElippsisIcon}></Button>
            </Column>
          </Grid>
        </Column>
        <Column className="col-margin-right" sm={2} md={2} lg={4}>
          <Select id={`select-2`} className="select-opt">
            <SelectItem value="" text="Operand" />
            <SelectItem value="option-1" text="=(equal to)" />
            <SelectItem value="option-2" text="!=(not equal)" />
            <SelectItem value="option-2" text=">(greater than)" />
            <SelectItem value="option-2" text=">=(greater than or equal)" />
            <SelectItem value="option-2" text="<(less than)" />
            <SelectItem value="option-2" text="<=(less than or equal)" />
          </Select>
        </Column>
        <Column className="col-margin-right" sm={2} md={2} lg={3}>
          <Grid className="row-sub-grid">
            <Column lg={2}>
              <TextInput id="one" />
            </Column>
            <Column lg={1}>
              <Button size="md" className="opt-btn" kind="secondary" renderIcon={ElippsisIcon}></Button>
            </Column>
          </Grid>
        </Column>
        <Column className="col-margin-right" sm={1} md={0} lg={2}>
          <Grid className="row-sub-grid">
            <Column lg={1}>
              <Button size="md" className="opt-btn" kind="secondary" renderIcon={CrossIcon}></Button>
            </Column>
            <Column lg={1}>
              <Button size="md" className="opt-btn" kind="secondary" renderIcon={MenuIcon}></Button>
            </Column>
          </Grid>
        </Column>
      </Grid>
    );
    setRows((pre) => [...pre, row]);
  };

  useEffect(() => {
    setDrows(rows);
  }, [rows]);

  //   const handelDeleteRow = (rowId) => {
  //     console.log('rowId', rowId);
  //     console.log('rowData', drows);
  //     // row.filter((item, index) => {
  //     //   console.log('index', index);
  //     // });
  //     // const postArray = row.slice(Number(rowId) + 1, row.length);
  //     // const preArray = row.slice(0, Number(rowId));
  //     // setRow([...preArray, ...postArray]);
  //   };
  return (
    <>
      <Grid className="btn-add-group grid-margin-top">
        <Column lg={4} className="btn-add">
          <Button
            type="submit"
            kind="secondary"
            onClick={(e) => {
              handleRow(rows.length);
            }}
          >
            Add <Add />
          </Button>
        </Column>
        <Column lg={4}>
          <Button type="submit" kind="secondary">
            Group <Add />
          </Button>
        </Column>
      </Grid>
      {rows.map((rowItem) => {
        return <>{rowItem}</>;
      })}
      <Grid className="grid-margin">
        <Column lg={16}>
          <TextArea placeholder="Enter Text" labelText="Error Message" rows={4} id="text-area-1" />
        </Column>
      </Grid>
    </>
  );
}
