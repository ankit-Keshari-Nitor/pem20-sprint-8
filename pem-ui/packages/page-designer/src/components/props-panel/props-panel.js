import React, { useEffect } from 'react';
import { Accordion, AccordionItem, Toggle, TextInput } from '@carbon/react';

import './props-panel.scss';

export default function PropsPanel({ selectedFiledProps, handleSchemaChanges }) {
  const [editableProps, setEditableProps] = React.useState({});
  const [advanceProps, setAdvanceProps] = React.useState([]);

  useEffect(() => {
    setEditableProps(selectedFiledProps?.component?.editableProps);
    setAdvanceProps(selectedFiledProps?.component?.advanceProps);
  }, [selectedFiledProps]);

  return (
    <div className="right-palette-container">
      {/* Form Field Id */}
      <div className="palette-header">{selectedFiledProps?.id}</div>
      <Accordion className="custom-class">
        {editableProps &&
          Object.keys(editableProps).map((key, idx) => {
            return (
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
            );
          })}
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
      </Accordion>
    </div>
  );
}
