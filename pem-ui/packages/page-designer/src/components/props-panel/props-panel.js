import React, { useEffect, useState } from 'react';
import { Toggle, TextInput, Button, Select, SelectItem, Tabs, TabList, Tab, TabPanels, TabPanel, TreeView, TreeNode, Modal, Grid, Column } from '@carbon/react';

import './props-panel.scss';
import { CUSTOM_COLUMN, SUBTAB, ROW, TAB, CUSTOM_TITLE, OPTIONS, CUSTOMREGEX } from '../../constants/constants';
import { collectPaletteEntries } from '../../utils/helpers';
import { ElippsisIcon } from '../../icon';

export default function PropsPanel({ layout, selectedFiledProps, handleSchemaChanges, columnSizeCustomization, onFieldDelete, componentMapper, replaceComponet }) {
  const [editableProps, setEditableProps] = React.useState({});
  const [advanceProps, setAdvanceProps] = React.useState([]);
  const [componentStyle, setComponentStyle] = React.useState([]);
  const [componentType, setComponentType] = React.useState();
  const [componentTypes, setComponentTypes] = React.useState([]);
  const [tabSubTitle, setTabSubTitle] = React.useState();
  const [options, setOptions] = React.useState([]);
  const [customRegexPattern, setCustomRegexPattern] = React.useState(false);
  const [openMappingDialog, setOpenMappingDialog] = useState(false);
  const [mappingSelectorValue, setMappingSelectorValue] = useState('');
  const [mappedId, setMappedId] = useState('');
  const [mappedKey, setMappedKey] = useState('');
  const [mappedPropsName, setMappedPropsName] = useState('');
  const [mappedCurrentPathDetail, setMappedCurrentPathDetail] = useState('');

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
    setOptions(selectedFiledProps?.component?.editableProps?.Basic.find((prop) => prop.type === 'Options')?.value || []);
  }, [selectedFiledProps, componentMapper, customRegexPattern]);

  const handleChange = (e) => {
    columnSizeCustomization(e.target.value, selectedFiledProps.currentPathDetail);
    setComponentStyle([{ labelText: 'Column Size', text: e.target.value }]);
  };

  const handleAddOption = () => {
    setOptions((prevOptions) => [...prevOptions, { label: '' }]);
  };

  const handleOptionChange = (index, value, key = '') => {
    setOptions((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index].id = `${selectedFiledProps?.id}-${index}`;
      key == 'label' ? (newOptions[index].label = value) : (newOptions[index].value = value);
      handleSchemaChanges(selectedFiledProps?.id, 'Basic', 'options', newOptions, selectedFiledProps?.currentPathDetail);
      return newOptions;
    });
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

  const handleRegexOption = (e, items, message, id, propsName, path) => {
    const newRegex = items.filter((items) => items.value === e.target.value)[0];
    const newValue = { pattern: newRegex.label, value: newRegex.value, message: message };
    if (e.target.value === CUSTOMREGEX) {
      newValue.customRegex = '';
      setCustomRegexPattern(true);
    }
    handleSchemaChanges(id, 'advance', propsName, newValue, path);
  };

  const OpenMappingDialog = (id, key, propsName, currentPathDetail) => {
    setOpenMappingDialog(true);
    setMappedId(id);
    setMappedKey(key);
    setMappedPropsName(propsName);
    setMappedCurrentPathDetail(currentPathDetail);
  };

  const mappingSelector = (selectedValue) => {
    handleSchemaChanges(mappedId, mappedKey, mappedPropsName, selectedValue, mappedCurrentPathDetail);
    setMappingSelectorValue(selectedValue);
    setOpenMappingDialog(false);
  };

  const Temp = (
    <TreeView label="Context Mapping">
      <TreeNode label="First-Name">
        <TreeNode label="Value-1" onClick={(e) => mappingSelector('Value-1')} />
        <TreeNode label="Value-2" onClick={(e) => mappingSelector('Value-2')} />
      </TreeNode>
      <TreeNode label="Last-Name">
        <TreeNode label="Value-1" onClick={(e) => mappingSelector('Value-1')} />
        <TreeNode label="Value-2" onClick={(e) => mappingSelector('Value-2')} />
      </TreeNode>
    </TreeView>
  );

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
                {/* {componentStyle === undefined && tabSubTitle === undefined && (
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
                )} */}
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
                                <>
                                  {/* TextInput */}
                                  {key === 'Basic' && item.type === 'TextInput' && (
                                    <TextInput
                                      key={idx}
                                      id={String(idx)}
                                      className="right-palette-form-item "
                                      labelText={item.label}
                                      value={item.value}
                                      invalid={item.invalid ? item.invalid : false}
                                      invalidText={item.invalidText ? item.invalidText : null}
                                      onChange={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, e.target.value, selectedFiledProps?.currentPathDetail)}
                                    />
                                  )}
                                  {/* Mapping */}
                                  {key === 'Basic' && item.type === 'mapping' && (
                                    <>
                                      <TextInput
                                        key={idx}
                                        id={String(idx)}
                                        className="right-palette-form-item-mapping"
                                        labelText={item.label}
                                        value={item.value}
                                        invalid={item.invalid ? item.invalid : false}
                                        invalidText={item.invalidText ? item.invalidText : null}
                                        onChange={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, e.target.value, selectedFiledProps?.currentPathDetail)}
                                      />
                                      <Button
                                        size="md"
                                        className="opt-btn"
                                        kind="secondary"
                                        renderIcon={ElippsisIcon}
                                        onClick={() => OpenMappingDialog(selectedFiledProps?.id, key, item.propsName, selectedFiledProps?.currentPathDetail)}
                                      ></Button>
                                    </>
                                  )}
                                  {/* Toggle */}
                                  {key === 'Basic' && item.type === 'Toggle' && (
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
                                  )}
                                </>
                              );
                            })}
                          </>
                        )}
                      </>
                    );
                  })}
                {/* Option Section */}
                {options.length > 0 && (
                  <div className="options-section">
                    <label className="cds--label">Options</label>
                    {options.map((option, index) => {
                      return (
                        <Grid>
                          <Column lg={8}>
                            <div key={index} className="option-input">
                              <TextInput
                                className="mapping-text-field"
                                id={`option-${index}`}
                                value={option?.label}
                                placeholder={`Label-${index}`}
                                onChange={(e) => handleOptionChange(index, e.target.value, 'label')}
                              />
                              <Button
                                size="md"
                                className="mapping-button"
                                kind="secondary"
                                renderIcon={ElippsisIcon}
                                onClick={() => OpenMappingDialog(selectedFiledProps?.id, 'Basic', 'mapping', selectedFiledProps?.currentPathDetail)}
                              ></Button>
                            </div>
                          </Column>
                          <Column lg={8}>
                            <div key={index} className="option-input">
                              <TextInput
                                className="mapping-text-field"
                                id={`option-${index}`}
                                value={option?.value}
                                placeholder={`Value-${index}`}
                                onChange={(e) => handleOptionChange(index, e.target.value, 'value')}
                              />
                              <Button
                                size="md"
                                className="mapping-button"
                                kind="secondary"
                                renderIcon={ElippsisIcon}
                                onClick={() => OpenMappingDialog(selectedFiledProps?.id, 'Basic', 'options', selectedFiledProps?.currentPathDetail)}
                              ></Button>
                            </div>
                          </Column>
                        </Grid>
                      );
                    })}
                    <Button size="sm" onClick={handleAddOption}>
                      Add Option
                    </Button>
                  </div>
                )}
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
              {/* Advance Properties Field  */}
              <TabPanel className="tab-panel">
                {advanceProps && advanceProps.length > 0 && (
                  <>
                    {advanceProps.map((advncProps, idx) => {
                      console.log('advanceProps', advanceProps);
                      return (
                        <>
                          {/* Min - Max validation */}
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
                                    { value: e.target.value, message: getValidationMessage(selectedFiledProps?.component?.label, advncProps.propsName, e.target.value) },
                                    selectedFiledProps?.currentPathDetail
                                  );
                                } else {
                                  handleSchemaChanges(
                                    selectedFiledProps?.id,
                                    'advance',
                                    advncProps.propsName,
                                    { value: e.target.value, message: getValidationMessage(selectedFiledProps?.component?.label, advncProps.propsName, e.target.value) },
                                    selectedFiledProps?.currentPathDetail
                                  );
                                }
                              }}
                            />
                          )}
                          {/* Regex Validation */}
                          {advncProps.type === OPTIONS && (
                            <>
                              <Select
                                className="regex-types"
                                id={String(selectedFiledProps.id)}
                                labelText={advncProps.label}
                                onChange={(e) =>
                                  handleRegexOption(
                                    e,
                                    advncProps?.items,
                                    advncProps.value.message,
                                    selectedFiledProps?.id,
                                    advncProps.propsName,
                                    selectedFiledProps?.currentPathDetail
                                  )
                                }
                                defaultValue={advncProps.value.value}
                                value={advncProps.value.value}
                              >
                                {advncProps?.items.map((item, index) => {
                                  return <SelectItem key={index} value={item.value} text={item.label} />;
                                })}
                              </Select>
                              <TextInput
                                key={`${idx}-'message'`}
                                id={String(idx)}
                                className="right-palette-form-item"
                                labelText={'Message'}
                                value={advncProps.value.message}
                                onChange={(e) => {
                                  if (isNaN(e.target.value)) {
                                    e.preventDefault();
                                    advncProps.type === OPTIONS
                                      ? handleSchemaChanges(
                                          selectedFiledProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          { ...advncProps.value, message: getValidationMessage(selectedFiledProps?.component?.label, advncProps.propsName, e.target.value) },
                                          selectedFiledProps?.currentPathDetail
                                        )
                                      : handleSchemaChanges(
                                          selectedFiledProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          {
                                            value: advncProps.value.value,
                                            message: getValidationMessage(selectedFiledProps?.component?.label, advncProps.propsName, e.target.value)
                                          },
                                          selectedFiledProps?.currentPathDetail
                                        );
                                  } else {
                                    advncProps.type === OPTIONS
                                      ? handleSchemaChanges(
                                          selectedFiledProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          {
                                            pattern: advncProps.value.pattern,
                                            value: advncProps.value.value,
                                            message: getValidationMessage(selectedFiledProps?.component?.label, advncProps.propsName, e.target.value)
                                          },
                                          selectedFiledProps?.currentPathDetail
                                        )
                                      : handleSchemaChanges(
                                          selectedFiledProps?.id,
                                          'advance',
                                          advncProps.propsName,
                                          {
                                            value: advncProps.value.value,
                                            message: getValidationMessage(selectedFiledProps?.component?.label, advncProps.propsName, e.target.value)
                                          },
                                          selectedFiledProps?.currentPathDetail
                                        );
                                  }
                                }}
                              />
                            </>
                          )}
                          {/* Custom Regex Validation */}
                          {(advncProps?.value?.customRegex || advncProps?.value?.customRegex === '') && (
                            <TextInput
                              key={`customregex-${idx}`}
                              id={`customregex-${String(idx)}`}
                              className="right-palette-form-item"
                              labelText={'Custom Regex'}
                              value={advncProps.value.customRegex}
                              onChange={(e) => {
                                if (isNaN(e.target.value)) {
                                  e.preventDefault();
                                  handleSchemaChanges(
                                    selectedFiledProps?.id,
                                    'advance',
                                    advncProps.propsName,
                                    { pattern: advncProps.value.pattern, value: advncProps.value.value, customRegex: e.target.value, message: advncProps.value.message },
                                    selectedFiledProps?.currentPathDetail
                                  );
                                } else {
                                  handleSchemaChanges(
                                    selectedFiledProps?.id,
                                    'advance',
                                    advncProps.propsName,
                                    { pattern: advncProps.value.pattern, value: advncProps.value.value, customRegex: e.target.value, message: advncProps.value.message },
                                    selectedFiledProps?.currentPathDetail
                                  );
                                }
                              }}
                            />
                          )}
                          {/* Required Validation */}
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
                                  {
                                    value: !advncProps.value.value,
                                    message: getValidationMessage(selectedFiledProps?.component?.label, advncProps.propsName, !advncProps.value.value)
                                  },
                                  selectedFiledProps?.currentPathDetail
                                )
                              }
                              hideLabel
                            />
                          )}
                        </>
                      );
                    })}
                  </>
                )}
              </TabPanel>
              <TabPanel className="tab-panel">Conditional Props</TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
      <Modal open={openMappingDialog} onRequestClose={() => setOpenMappingDialog(false)} passiveModal>
        {Temp}
      </Modal>
    </div>
  );
}

function getValidationMessage(label, propertiesName, value) {
  console.log('value', value);
  console.log('props', propertiesName);
  switch (propertiesName) {
    case 'isRequired':
      return 'This is a required field';
    case 'min':
      return label + ' must be at least ' + value + 'characters';
    case 'max':
      return label + ' must be no longer than ' + value + 'characters';
    case 'regexValidation':
      return value;
    default:
      return 'regexValidation';
  }
}
