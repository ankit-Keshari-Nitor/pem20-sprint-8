import React, { useEffect } from 'react';
import { Toggle, TextInput, Button, Select, SelectItem, Tabs, TabList, Tab, TabPanels, TabPanel } from '@carbon/react';

import './props-panel.scss';
import { CUSTOM_COLUMN, SUBTAB, ROW, TAB, CUSTOM_TITLE } from '../../constants/constants';
import { collectPaletteEntries } from '../../utils/helpers';

export default function PropsPanel({ layout, selectedFiledProps, handleSchemaChanges, columnSizeCustomization, onFieldDelete, componentMapper, replaceComponet }) {
  const [editableProps, setEditableProps] = React.useState({});
  const [advanceProps, setAdvanceProps] = React.useState([]);
  const [componentStyle, setComponentStyle] = React.useState([]);
  const [componentType, setComponentType] = React.useState();
  const [componentTypes, setComponentTypes] = React.useState([]);
  const [tabSubTitle, setTabSubTitle] = React.useState();
  const items = [
    { text: '1' },
    { text: '2' },
    { text: '3' },
    { text: '4' },
    { text: '5' },
    { text: '6' },
    { text: '7' },
    { text: '8' },
    { text: '9' },
    { text: '10' },
    { text: '11' },
    { text: '12' },
    { text: '13' },
    { text: '14' },
    { text: '15' },
    { text: '16' }
  ];
  useEffect(() => {
    setEditableProps(selectedFiledProps?.component?.editableProps);
    setAdvanceProps(selectedFiledProps?.component?.advanceProps);
    setComponentStyle(selectedFiledProps?.component?.style);
    setTabSubTitle(selectedFiledProps?.component?.tabTitle);
    setComponentType(selectedFiledProps.component.type);
    setComponentTypes(collectPaletteEntries(componentMapper));
  }, [selectedFiledProps, componentMapper]);

  const handleChange = (e) => {
    columnSizeCustomization(e.target.value, selectedFiledProps.currentPathDetail);
    setComponentStyle([{ labelText: 'Column Size', text: e.target.value }]);
  };

  const isLastChild = (path, layout) => {
    if (path && path.length > 0) {
      let childLength = false;
      let index = path[0];
      if (path.length === 1) {
        childLength = layout[0]?.children?.length > 1 ? true : false;
      } else {
        path.shift();
        return isLastChild(path, layout[index]?.children);
      }
      return childLength;
    }
  };

  const handleComponentTypeChange = (e) => {
    const newComponent = componentTypes.filter((items) => items.component.type === e.target.value)[0];
    replaceComponet(e, selectedFiledProps.currentPathDetail, newComponent);
    setComponentType(e.target.value);
  };
  return (
    <div className="right-palette-container">
      {selectedFiledProps && (
        <>
          <Tabs>
            <TabList aria-label="List of tabs" contained>
              <Tab>Properties</Tab>
              <Tab>Validators</Tab>
              <Tab>Condition</Tab>
            </TabList>
            <TabPanels>
              <TabPanel className="tab-panel">
                {/* Component Types Select */}
                {componentStyle === undefined && tabSubTitle === undefined && (
                  <Select
                    className="component-types"
                    id={String(selectedFiledProps.id)}
                    labelText="Component Types"
                    onChange={handleComponentTypeChange}
                    defaultValue={componentType}
                    value={componentType}
                  >
                    {componentTypes.map((item, index) => {
                      return <SelectItem key={index} value={item.component.type} text={item.component.type} />;
                    })}
                  </Select>
                )}
                {/* To Show the Add Tab Button */}
                {selectedFiledProps?.type === TAB && (
                  <Button
                    onClick={(e) => {
                      handleSchemaChanges(selectedFiledProps?.id, SUBTAB, '', 1, selectedFiledProps?.currentPathDetail);
                    }}
                  >
                    Add Tab
                  </Button>
                )}
                {/* To Show the Add Column Button */}
                {selectedFiledProps?.type === ROW && (
                  <Button
                    onClick={(e) => {
                      handleSchemaChanges(selectedFiledProps?.id, CUSTOM_COLUMN, '', 1, selectedFiledProps?.currentPathDetail);
                    }}
                  >
                    Add Column
                  </Button>
                )}
                {/* Basic Properties Field  */}
                {editableProps &&
                  Object.keys(editableProps).map((key, idx) => {
                    return (
                      <>
                        {editableProps[key] && editableProps[key].length > 0 && (
                          <>
                            {editableProps[key].map((item, idx) => {
                              return (
                                key === 'Basic' &&
                                (item.type === 'TextInput' ? (
                                  <TextInput
                                    key={idx}
                                    id={String(idx)}
                                    className="right-palette-form-item "
                                    labelText={item.label}
                                    value={item.value}
                                    onChange={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, e.target.value, selectedFiledProps?.currentPathDetail)}
                                  />
                                ) : (
                                  item.type === 'Toggle' && (
                                    <ul key={idx}>
                                      <li>
                                        <Toggle
                                          key={idx}
                                          id={'toggle-' + key + '-' + String(idx) + '-' + selectedFiledProps?.id}
                                          className="right-palette-form-item "
                                          labelText={item.label}
                                          defaultToggled={Boolean(item.value)}
                                          toggled={Boolean(item.value)}
                                          onClick={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, !item.value, selectedFiledProps?.currentPathDetail)}
                                          hideLabel
                                        />
                                      </li>
                                    </ul>
                                  )
                                ))
                              );
                            })}
                          </>
                        )}
                      </>
                    );
                  })}
                {/* Column Size Style  */}
                {componentStyle && componentStyle.length > 0 && (
                  <>
                    {componentStyle.map((styleProps, idx) => {
                      return (
                        <Select id={String(idx)} labelText="Column Size" onChange={handleChange} defaultValue={styleProps.text} value={styleProps.text}>
                          {items.map((item, index) => {
                            return <SelectItem key={index} value={item.text} text={item.text} />;
                          })}
                        </Select>
                      );
                    })}
                    {/* Column Delete  */}
                    {isLastChild(selectedFiledProps?.currentPathDetail.split('-').slice(0, -1), layout) && (
                      <div className="delete-column">
                        <Button
                          kind="danger--tertiary"
                          onClick={(e) => {
                            onFieldDelete(e, selectedFiledProps?.currentPathDetail);
                          }}
                        >
                          Delete Column
                        </Button>
                      </div>
                    )}
                  </>
                )}
                {/* Tab SubTitle  */}
                {(tabSubTitle || tabSubTitle === '') && (
                  <>
                    <TextInput
                      key="TabTitle"
                      id="TabTitle"
                      className="right-palette-form-item"
                      labelText="Tab Title"
                      value={tabSubTitle}
                      onChange={(e) => {
                        handleSchemaChanges(selectedFiledProps?.id, CUSTOM_TITLE, 'tabTitle', e.target.value, selectedFiledProps?.currentPathDetail);
                      }}
                    />
                  </>
                )}
              </TabPanel>
              <TabPanel className="tab-panel">
                {/* Advance Properties Field  */}
                {advanceProps && advanceProps.length > 0 && (
                  <>
                    {advanceProps.map((advncProps, idx) => {
                      return (
                        <>
                          {advncProps.type === 'TextInput' && (
                            <TextInput
                              key={idx}
                              id={String(idx)}
                              className="right-palette-form-item"
                              labelText={advncProps.label}
                              value={advncProps.value.value}
                              onChange={(e) => {
                                if (isNaN(e.target.value)) {
                                  e.preventDefault();
                                  handleSchemaChanges(
                                    selectedFiledProps?.id,
                                    'advance',
                                    advncProps.propsName,
                                    { value: e.target.value, message: advncProps.value.message },
                                    selectedFiledProps?.currentPathDetail
                                  );
                                } else {
                                  handleSchemaChanges(
                                    selectedFiledProps?.id,
                                    'advance',
                                    advncProps.propsName,
                                    { value: e.target.value, message: advncProps.value.message },
                                    selectedFiledProps?.currentPathDetail
                                  );
                                }
                              }}
                            />
                          )}
                          {advncProps.type === 'Toggle' && (
                            <Toggle
                              key={idx}
                              id={'toggle-' + String(idx) + '-' + selectedFiledProps?.id}
                              className="right-palette-form-item "
                              labelText={advncProps.label}
                              defaultToggled={Boolean(advncProps.value.value)}
                              toggled={Boolean(advncProps.value.value)}
                              onClick={(e) =>
                                handleSchemaChanges(
                                  selectedFiledProps?.id,
                                  'advance',
                                  advncProps.propsName,
                                  { value: !advncProps.value.value, message: advncProps.value.message },
                                  selectedFiledProps?.currentPathDetail
                                )
                              }
                              hideLabel
                            />
                          )}
                          <TextInput
                            key={`${idx}-'message'`}
                            id={String(idx)}
                            className="right-palette-form-item"
                            labelText={'Message'}
                            value={advncProps.value.message}
                            onChange={(e) => {
                              if (isNaN(e.target.value)) {
                                e.preventDefault();
                                handleSchemaChanges(
                                  selectedFiledProps?.id,
                                  'advance',
                                  advncProps.propsName,
                                  { value: advncProps.value.value, message: e.target.value },
                                  selectedFiledProps?.currentPathDetail
                                );
                              } else {
                                handleSchemaChanges(
                                  selectedFiledProps?.id,
                                  'advance',
                                  advncProps.propsName,
                                  { value: advncProps.value.value, messag: e.target.value },
                                  selectedFiledProps?.currentPathDetail
                                );
                              }
                            }}
                          />
                        </>
                      );
                    })}
                  </>
                )}
                {/* Validation Properties Field  */}
                {editableProps &&
                  Object.keys(editableProps).map((key, idx) => {
                    return (
                      <>
                        {editableProps[key] && editableProps[key].length > 0 && (
                          <>
                            {/* {editableProps[key].map((item, idx) => {
                              return (
                                key === 'Condition' && (
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
                                )
                              );
                            })} */}
                          </>
                        )}
                      </>
                    );
                  })}
              </TabPanel>
              <TabPanel className="tab-panel">Conditional Props</TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </div>
  );
}
