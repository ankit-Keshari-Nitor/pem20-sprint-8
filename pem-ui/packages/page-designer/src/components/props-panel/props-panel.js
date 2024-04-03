import React, { useEffect } from 'react';
import { Accordion, AccordionItem, Toggle, TextInput, Dropdown, Button, Select, SelectItem } from '@carbon/react';

import './props-panel.scss';
import { ROW } from '../../constants/constants';
import { findChildComponentById } from '../../utils/helpers';

export default function PropsPanel({ selectedFiledProps, handleSchemaChanges, columnSizeCustomization }) {
  const [editableProps, setEditableProps] = React.useState({});
  const [advanceProps, setAdvanceProps] = React.useState([]);
  const [componentStyle, setComponentStyle] = React.useState([]);
  const items = [{ text: '2' }, { text: '4' }, { text: '6' }, { text: '8' }, { text: '10' }, { text: '12' }, { text: '14' }, { text: '16' }];
  useEffect(() => {
    setEditableProps(selectedFiledProps?.component?.editableProps);
    setAdvanceProps(selectedFiledProps?.component?.advanceProps);
    setComponentStyle(selectedFiledProps?.component?.style);
  }, [selectedFiledProps]);

  const handleChange = (e) => {
    columnSizeCustomization(e.target.value, selectedFiledProps.currentPathDetail);
    setComponentStyle([{ labelText: 'Column Size', text: e.target.value }]);
  };

  return (
    <div className="right-palette-container">
      {/* Form Field Id */}
      <div className="palette-header">{selectedFiledProps?.id}</div>
      <Accordion className="custom-class">
        {/* To Show the Add Column Button */}
        {selectedFiledProps?.type === ROW && (
          <Button
            onClick={(e) => {
              handleSchemaChanges(selectedFiledProps?.id, 'customColumn', '', 1, selectedFiledProps?.currentPathDetail);
            }}
          >
            Add Column
          </Button>
        )}
        {/* Basic and Condition Properties Field  */}
        {editableProps &&
          Object.keys(editableProps).map((key, idx) => {
            return (
              <>
                {editableProps[key] && editableProps[key].length > 0 && (
                  <AccordionItem key={idx} title={key} open>
                    {editableProps[key].map((item, idx) => {
                      return key === 'Basic' ? (
                        <TextInput
                          key={idx}
                          id={String(idx)}
                          className="right-palette-form-item "
                          labelText={item.label}
                          value={item.value}
                          onChange={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, e.target.value, selectedFiledProps?.currentPathDetail)}
                        />
                      ) : (
                        <ul key={idx}>
                          <li>
                            <Toggle
                              key={idx}
                              id={'toggle-' + String(idx) + '-' + selectedFiledProps?.id}
                              className="right-palette-form-item "
                              labelText={item.label}
                              defaultToggled={item.value}
                              toggled={item.value}
                              onClick={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, !item.value, selectedFiledProps?.currentPathDetail)}
                              hideLabel
                            />
                          </li>
                        </ul>
                      );
                    })}
                  </AccordionItem>
                )}
              </>
            );
          })}
        {/* Advance Properties Field  */}
        {advanceProps && advanceProps.length > 0 && (
          <AccordionItem key={'advance'} title={'Advance'}>
            {advanceProps.map((advncProps, idx) => {
              return (
                <TextInput
                  key={idx}
                  id={String(idx)}
                  className="right-palette-form-item"
                  labelText={advncProps.label}
                  value={advncProps.value}
                  onChange={(e) => {
                    if (isNaN(e.target.value)) {
                      e.preventDefault();
                    } else {
                      handleSchemaChanges(selectedFiledProps?.id, 'advance', advncProps.propsName, e.target.value, selectedFiledProps?.currentPathDetail);
                    }
                  }}
                />
              );
            })}
          </AccordionItem>
        )}
        {/* Column Size Style  */}
        {componentStyle && componentStyle.length > 0 && (
          <AccordionItem key={'style'} title={'Style'} open>
            {componentStyle.map((styleProps, idx) => {
              return (
                <Select labelText="Column Size" onChange={handleChange} defaultValue={styleProps.text} value={styleProps.text}>
                  {items.map((item, index) => {
                    return <SelectItem key={index} value={item.text} text={item.text} />;
                  })}
                </Select>
              );
            })}
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
