import React, { useEffect, useState } from 'react';
import {
  Toggle,
  TextInput,
  Button,
  Select,
  DatePicker,
  DatePickerInput,
  Dropdown,
  SelectItem,
  RadioButtonGroup,
  RadioButton,
  FormLabel,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  TreeView,
  TreeNode,
  Modal,
  Grid,
  Column,
  Accordion,
  AccordionItem,
  Checkbox,
  FileUploader,
  CheckboxGroup,
  Tooltip
} from '@carbon/react';
import { v4 as uuid } from 'uuid';
import './props-panel.scss';
import {
  CUSTOM_COLUMN,
  SUBTAB,
  CUSTOM_TITLE,
  OPTIONS,
  CUSTOMREGEX,
  TABLE_COLUMNS,
  TABLE_ROWS,
  TEXT_INPUT,
  MAPPING,
  SELECT,
  TOGGLE,
  TEXT,
  RADIO,
  CHECKBOX,
  FILE_UPLOAD,
  DROPDOWN,
  ADD_COLUMN_BTN,
  ISREQUIRED,
  ADD_TAB_BTN
} from '../../constants/constants';
import { collectPaletteEntries } from '../../utils/helpers';
import { ElippsisIcon } from '../../icon';
import { TrashCan, Information } from '@carbon/icons-react';

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
  const [tableColId, setTableColId] = useState('');
  const [tableColKey, setTableColKey] = useState('');
  const [mappedPropsName, setMappedPropsName] = useState('');
  const [mappedCurrentPathDetail, setMappedCurrentPathDetail] = useState('');
  const [selectedRadioValue, setSelectedRadioValue] = useState('');
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useState([]);

  const [tableHeader, setTableHeader] = React.useState([]);
  const [tableRows, setTableRows] = React.useState([]);

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
    setSelectedCheckboxValues(selectedFiledProps?.component?.editableProps?.Basic.find((prop) => prop.type === 'checkbox')?.value || []);
    setSelectedRadioValue(selectedFiledProps?.component?.editableProps?.Basic.find((prop) => prop.type === 'radio')?.value || '');
    setOptions(selectedFiledProps?.component?.editableProps?.Basic.find((prop) => prop.type === 'Options')?.value || []);
    setTableHeader(selectedFiledProps?.component?.editableProps?.Basic.find((prop) => prop.propsName === TABLE_COLUMNS)?.value || []);
    setTableRows(selectedFiledProps?.component?.editableProps?.Basic.find((prop) => prop.propsName === TABLE_ROWS)?.value || []);
  }, [selectedFiledProps, componentMapper, customRegexPattern]);

  const handleChange = (e) => {
    columnSizeCustomization(e.target.value, selectedFiledProps.currentPathDetail);
    setComponentStyle([{ labelText: 'Column Size', text: e.target.value }]);
  };

  const handleFileChange = (e, key, propsName, selectedFiledProps) => {
    const file = e.target?.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Get the base64 string
        handleSchemaChanges(selectedFiledProps?.id, key, propsName, file.name + '/' + base64String, selectedFiledProps?.currentPathDetail);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOption = () => {
    const index = options.length + 1;
    const newOptions = [...options, { label: `Label-${index - 1}`, id: index - 1, value: `Value-${index - 1}` }];
    setOptions(newOptions);
    handleSchemaChanges(selectedFiledProps?.id, 'Basic', 'options', newOptions, selectedFiledProps?.currentPathDetail);
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

  const handleDeleteOption = (index) => {
    setOptions((prevOptions) => {
      let newOptions = [...prevOptions];
      newOptions.splice(index, 1);
      if (newOptions.length == 0) {
        newOptions = [
          {
            label: 'Label-0',
            id: '',
            value: 'Value-0'
          }
        ];
      }
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
    const newRegex = items.filter((items) => items.value === e)[0];
    const newValue = { pattern: newRegex.label, value: newRegex.value, message: message };
    if (e === CUSTOMREGEX) {
      newValue.customRegex = '';
      setCustomRegexPattern(true);
    }
    handleSchemaChanges(id, 'advance', propsName, newValue, path);
  };

  const handleCheckboxGroupChange = (e, propsName) => {
    const value = e.target.value;
    setSelectedCheckboxValues((prevValues) => {
      const newValues = prevValues.includes(value) ? prevValues.filter((val) => val !== value) : [...prevValues, value];
      handleSchemaChanges(selectedFiledProps?.id, 'Basic', propsName, newValues, selectedFiledProps?.currentPathDetail);
      return newValues;
    });
  };

  const OpenMappingDialog = (id, key, propsName, currentPathDetail, columnId = null, columnKey = null) => {
    setOpenMappingDialog(true);
    setMappedId(id);
    setMappedKey(key);
    setMappedPropsName(propsName);
    setTableColId(columnId);
    setTableColKey(columnKey);
    setMappedCurrentPathDetail(currentPathDetail);
  };

  const mappingSelector = (selectedValue) => {
    mappedPropsName === TABLE_ROWS
      ? handleRowOpt(tableColId, selectedValue, tableColKey)
      : handleSchemaChanges(mappedId, mappedKey, mappedPropsName, selectedValue, mappedCurrentPathDetail);
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

  // ----------------------------------------------------------------Table Related Functions----------------------------------------------------------------

  const handleAddHeader = () => {
    setTableHeader((preHeader) => [
      ...preHeader,
      {
        key: '',
        header: '',
        colSpan: '6',
        searchable: false,
        sortable: false,
        required: false
      }
    ]);
  };

  const handleHeaderChange = (index, value, key = '') => {
    setTableHeader((prevOptions) => {
      const newOptions = [...prevOptions];
      newOptions[index][key] = value;
      handleSchemaChanges(selectedFiledProps?.id, 'Basic', TABLE_COLUMNS, newOptions, selectedFiledProps?.currentPathDetail);
      return newOptions;
    });
  };

  const handleAddRow = (tableolumns) => {
    const tableRow = {};
    tableolumns.map((item) => {
      tableRow[item.key] = '';
    });
    setTableRows((preRows) => [...preRows, { id: uuid(), ...tableRow }]);
  };

  const handleRowOpt = (index, value, key) => {
    setTableRows((prevRow) => {
      const rows = [...prevRow];
      rows[index][key] = value;
      handleSchemaChanges(selectedFiledProps?.id, 'Basic', TABLE_ROWS, rows, selectedFiledProps?.currentPathDetail);
      return rows;
    });
  };

  const handleTableRowdelete = (index) => {
    tableRows.splice(index, 1);
    setTableHeader(tableRows);
    handleSchemaChanges(selectedFiledProps?.id, 'Basic', TABLE_ROWS, tableRows, selectedFiledProps?.currentPathDetail);
  };

  const handleTableColumn = (index) => {
    tableHeader.splice(index, 1);
    setTableHeader(tableHeader);
    handleSchemaChanges(selectedFiledProps?.id, 'Basic', TABLE_COLUMNS, tableHeader, selectedFiledProps?.currentPathDetail);
  };

  return (
    <div className="right-palette-container">
      {selectedFiledProps && (
        <>
          <Tabs>
            <TabList aria-label="List of tabs" contained>
              <Tab>Properties</Tab>
              {advanceProps && advanceProps.length > 0 ? <Tab>Validators</Tab> : null}
              {/* <Tab>Condition</Tab> */}
            </TabList>
            <TabPanels>
              <TabPanel className="tab-panel">
                {editableProps &&
                  Object.keys(editableProps).map((key, idx) => {
                    return (
                      key === 'Basic' && (
                        <span key={idx}>
                          {editableProps[key] && editableProps[key].length > 0 && (
                            <Grid>
                              {editableProps[key].map((item, idx) => {
                                return (
                                  <>
                                    {/* Select */}
                                    {item.type === SELECT && (
                                      <Column lg={item.propsPanelColSize}>
                                        <Select
                                          className="component-types right-palette-form-item"
                                          id={String(selectedFiledProps.id)}
                                          labelText={item.label}
                                          onChange={handleComponentTypeChange}
                                          defaultValue={componentType}
                                          value={componentType}
                                          disabled={item?.value.length > 1 ? false : true}
                                        >
                                          {item.value.map((fieldName, index) => {
                                            return <SelectItem key={index} value={fieldName} text={fieldName} />;
                                          })}
                                        </Select>
                                      </Column>
                                    )}
                                    {/* TextInput */}
                                    {item.type === TEXT_INPUT && item.propsName != TABLE_COLUMNS && item.propsName != TABLE_ROWS && (
                                      <Column lg={item.propsPanelColSize}>
                                        <TextInput
                                          key={idx}
                                          readOnly={item?.readOnly}
                                          id={String(idx)}
                                          className="right-palette-form-item"
                                          labelText={item.label}
                                          placeholder={item.placeholder}
                                          value={item.value}
                                          invalid={item.invalid ? item.invalid : false}
                                          invalidText={item.invalidText ? item.invalidText : null}
                                          onChange={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, e.target.value, selectedFiledProps?.currentPathDetail)}
                                        />
                                      </Column>
                                    )}
                                    {/* Mapping */}
                                    {item.type === MAPPING && (
                                      <Column lg={item.propsPanelColSize}>
                                        <TextInput
                                          key={idx}
                                          id={String(idx)}
                                          className="right-palette-form-item-mapping right-palette-form-item"
                                          labelText={item.label}
                                          placeholder={item.placeholder}
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
                                      </Column>
                                    )}
                                    {/* Toggle */}
                                    {item.type === TOGGLE && item.propsName != ISREQUIRED && (
                                      <Column lg={item.propsPanelColSize}>
                                        <ul key={idx}>
                                          <li>
                                            <Toggle
                                              key={idx}
                                              size="sm"
                                              id={'toggle-' + key + '-' + String(idx) + '-' + selectedFiledProps?.id}
                                              className="right-palette-form-item"
                                              labelText={item.label}
                                              defaultToggled={Boolean(item.value)}
                                              toggled={Boolean(item.value)}
                                              labelA={item?.labelA}
                                              labelB={item?.labelB}
                                              onClick={(e) => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, !item.value, selectedFiledProps?.currentPathDetail)}
                                            />
                                          </li>
                                        </ul>
                                      </Column>
                                    )}
                                    {/* Toggle with required */}
                                    {item.type === TOGGLE && item.propsName == ISREQUIRED && (
                                      <Column lg={item.propsPanelColSize}>
                                        <ul key={idx}>
                                          <li>
                                            <Toggle
                                              key={idx}
                                              size="sm"
                                              id={'toggle-' + String(idx) + '-' + selectedFiledProps?.id}
                                              className="right-palette-form-item "
                                              labelText={item.label}
                                              defaultToggled={Boolean(item.value.value)}
                                              toggled={Boolean(item.value.value)}
                                              labelA={item?.labelA}
                                              labelB={item?.labelB}
                                              onClick={(e) =>
                                                handleSchemaChanges(
                                                  selectedFiledProps?.id,
                                                  key,
                                                  item.propsName,
                                                  {
                                                    value: !item.value.value,
                                                    message: getValidationMessage(selectedFiledProps?.component?.label, item.propsName, !item.value.value)
                                                  },
                                                  selectedFiledProps?.currentPathDetail
                                                )
                                              }
                                            />
                                          </li>
                                        </ul>
                                      </Column>
                                    )}
                                    {/* Text */}
                                    {item.type === TEXT && (
                                      <Column lg={7}>
                                        <div className="component-type-id">
                                          <FormLabel>{item.label}</FormLabel>
                                          <FormLabel className="component-type-id-label">{item.value}</FormLabel>
                                        </div>
                                      </Column>
                                    )}
                                    {/* Radio */}
                                    {item.type === RADIO && (
                                      <Column lg={item.propsPanelColSize}>
                                        <div className="right-palette-form-item">
                                          <RadioButtonGroup
                                            legendText={item.label}
                                            name={`radio-group-${selectedFiledProps?.id}`}
                                            valueSelected={selectedRadioValue}
                                            onChange={(value) => {
                                              setSelectedRadioValue(value);
                                              handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, value, selectedFiledProps?.currentPathDetail);
                                            }}
                                          >
                                            {item?.options.length > 0 &&
                                              item?.options.map((option, idx) => (option?.value ? <RadioButton key={idx} labelText={option.label} value={option.value} /> : null))}
                                          </RadioButtonGroup>
                                        </div>
                                      </Column>
                                    )}
                                    {/* CheckBox */}
                                    {item.type === CHECKBOX && (
                                      <div className="right-palette-form-item">
                                        <CheckboxGroup
                                          legendText={item.label}
                                          name={`checkbox-group-${selectedFiledProps?.id}`}
                                          onChange={(e) => handleCheckboxGroupChange(e, item.propsName)}
                                        >
                                          {item?.options.length > 0 &&
                                            item?.options.map((option, idx) =>
                                              option?.value ? (
                                                <Checkbox
                                                  id={selectedFiledProps?.id + idx}
                                                  labelText={option.label}
                                                  value={option.value}
                                                  checked={selectedCheckboxValues.includes(option.value)}
                                                />
                                              ) : null
                                            )}
                                        </CheckboxGroup>
                                      </div>
                                    )}
                                    {/* DropDown */}
                                    {item.type === DROPDOWN && (
                                      <Column lg={item.propsPanelColSize ? item.propsPanelColSize : 16} className="right-palette-form-item">
                                        <Dropdown
                                          id={item.propsName}
                                          items={item.options}
                                          selectedItem={item.value}
                                          titleText={item.label}
                                          onChange={({ selectedItem }) =>
                                            handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, selectedItem, selectedFiledProps?.currentPathDetail)
                                          }
                                        />
                                      </Column>
                                    )}
                                    {/* File Uploader */}
                                    {item.type === FILE_UPLOAD && (
                                      <div className="right-palette-form-item">
                                        <FileUploader
                                          labelTitle="File Attachment"
                                          labelDescription=""
                                          buttonLabel="Select"
                                          buttonKind="primary"
                                          size="sm"
                                          filenameStatus="edit"
                                          multiple={false}
                                          iconDescription="Delete file"
                                          name=""
                                          onChange={(e) => handleFileChange(e, key, item.propsName, selectedFiledProps)}
                                          onDelete={() => handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, '', selectedFiledProps?.currentPathDetail)}
                                        />
                                      </div>
                                    )}
                                    {/* Date Picker */}
                                    {item.type === 'Date' && (
                                      <Column lg={item.propsPanelColSize} className="right-palette-form-item">
                                        <DatePicker
                                          datePickerType="single"
                                          onChange={(e) => {
                                            handleSchemaChanges(selectedFiledProps?.id, key, item.propsName, e[0], selectedFiledProps?.currentPathDetail);
                                          }}
                                        >
                                          <DatePickerInput id="date-picker-single" labelText={item?.label} placeholder="mm/dd/yyyy" />
                                        </DatePicker>
                                      </Column>
                                    )}
                                    {/* Table Column */}
                                    {item.propsName === TABLE_COLUMNS && (
                                      <Column lg={16} className="table-col-header">
                                        <span>
                                          <label>Table Column</label>
                                          <Button size="sm" onClick={handleAddHeader} className="add-header">
                                            Add Column
                                          </Button>
                                        </span>
                                        <Accordion>
                                          {tableHeader.map((header, index) => (
                                            <AccordionItem title={`Column-${index + 1}`}>
                                              <TextInput
                                                key={`key-${idx}-${index}`}
                                                id={String(`key-${idx}`)}
                                                className="right-palette-form-item "
                                                labelText={'Key'}
                                                helperText={'Space is not allowed'}
                                                value={header?.key}
                                                onChange={(e) => handleHeaderChange(index, e.target.value.replace(/\s+/g, ''), 'key')}
                                              />
                                              <TextInput
                                                key={`value-${idx}-${index}`}
                                                id={String(`value-${idx}`)}
                                                className="right-palette-form-item "
                                                labelText={'Value'}
                                                value={header?.header}
                                                onChange={(e) => handleHeaderChange(index, e.target.value, 'header')}
                                              />
                                              <Checkbox
                                                key={`sortable-${idx}-${index}`}
                                                id={`sortable-${idx}-${index}`}
                                                labelText="Sortable"
                                                checked={header.sortable}
                                                onChange={(e) => handleHeaderChange(index, !header?.sortable, 'sortable')}
                                              />
                                              <Checkbox
                                                key={`searchable-${idx}-${index}`}
                                                id={`searchable-${idx}-${index}`}
                                                labelText="Searchable"
                                                checked={header.searchable}
                                                onChange={(e) => handleHeaderChange(index, !header?.searchable, 'searchable')}
                                              />
                                              <Button size="sm" className="delete-table-column" onClick={() => handleTableColumn(index)}>
                                                Delete Column
                                              </Button>
                                            </AccordionItem>
                                          ))}
                                        </Accordion>
                                      </Column>
                                    )}
                                    {/* Table Row */}
                                    {item.propsName === TABLE_ROWS && (
                                      <Column lg={16} className="table-row">
                                        <span>
                                          <label>Table Row</label>
                                          <Button size="sm" className="add-row" onClick={() => handleAddRow(tableHeader)}>
                                            Add Row
                                          </Button>
                                        </span>
                                        <Accordion>
                                          {tableRows.map((rowValue, index) => (
                                            <AccordionItem title={`Row-${index}`}>
                                              {tableHeader.map((rowitem, colidex) => {
                                                return (
                                                  <>
                                                    <TextInput
                                                      key={`${rowitem.key}-${idx}-${colidex}`}
                                                      id={String(`${rowitem.key}-${idx}`)}
                                                      className="right-palette-form-item-mapping"
                                                      labelText={rowitem.key}
                                                      value={rowValue[rowitem.key]}
                                                      onChange={(e) => handleRowOpt(index, e.target.value, rowitem.key)}
                                                    />
                                                    <Button
                                                      size="md"
                                                      className="opt-btn"
                                                      kind="secondary"
                                                      renderIcon={ElippsisIcon}
                                                      onClick={() =>
                                                        OpenMappingDialog(selectedFiledProps?.id, key, item.propsName, selectedFiledProps?.currentPathDetail, index, rowitem.key)
                                                      }
                                                    ></Button>
                                                    <br />
                                                  </>
                                                );
                                              })}

                                              {/* <Button size="sm" className="delete-table-column" onClick={()=> handleTableRowdelete(index)}>
                                              Delete Row
                                            </Button> */}
                                            </AccordionItem>
                                          ))}
                                        </Accordion>
                                      </Column>
                                    )}
                                    {/* Add Tab Button */}
                                    {item.propsName === ADD_TAB_BTN && (
                                      <Column lg={item.propsPanelColSize}>
                                        <Button
                                          onClick={(e) => {
                                            handleSchemaChanges(selectedFiledProps?.id, SUBTAB, '', 1, selectedFiledProps?.currentPathDetail);
                                          }}
                                        >
                                          {item.label}
                                        </Button>
                                      </Column>
                                    )}
                                    {/* Add Column in Group Button */}
                                    {item.propsName === ADD_COLUMN_BTN && (
                                      <Column lg={item.propsPanelColSize}>
                                        <Button
                                          onClick={(e) => {
                                            handleSchemaChanges(selectedFiledProps?.id, CUSTOM_COLUMN, '', 1, selectedFiledProps?.currentPathDetail);
                                          }}
                                        >
                                          {item.label}
                                        </Button>
                                      </Column>
                                    )}
                                  </>
                                );
                              })}
                            </Grid>
                          )}
                        </span>
                      )
                    );
                  })}
                {/* Option Section */}
                {options.length > 0 && (
                  <div className="options-section">
                    <label className="cds--label">Options</label>
                    {options.map((option, index) => {
                      return (
                        <Grid>
                          <Column lg={7}>
                            <TextInput
                              key={`text-label-${index}`}
                              className="mapping-text-field"
                              id={`option-label-${index}`}
                              value={option?.label}
                              placeholder={`Label-${index}`}
                              onChange={(e) => handleOptionChange(index, e.target.value, 'label')}
                            />
                            <Button
                              key={`text-map-${index}`}
                              size="md"
                              className="mapping-button"
                              kind="secondary"
                              renderIcon={ElippsisIcon}
                              onClick={() => OpenMappingDialog(selectedFiledProps?.id, 'Basic', 'mapping', selectedFiledProps?.currentPathDetail)}
                            ></Button>
                          </Column>
                          <Column lg={7}>
                            <TextInput
                              key={`text-value-${index}`}
                              className="mapping-text-field"
                              id={`option-value-${index}`}
                              value={option?.value}
                              placeholder={`Value-${index}`}
                              onChange={(e) => handleOptionChange(index, e.target.value, 'value')}
                            />
                            <Button
                              key={`text-value-${index}`}
                              size="md"
                              className="mapping-button"
                              kind="secondary"
                              renderIcon={ElippsisIcon}
                              onClick={() => OpenMappingDialog(selectedFiledProps?.id, 'Basic', 'options', selectedFiledProps?.currentPathDetail)}
                            ></Button>
                          </Column>
                          {/* Check if options length is greater than 1 before displaying delete icon */}
                          {options.length > 1 && (
                            <Column lg={2}>
                              <span className="delete-icon icon-margin">
                                <TrashCan onClick={() => handleDeleteOption(index)} />
                              </span>
                            </Column>
                          )}
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
                  <Grid>
                    {advanceProps.map((advncProps, idx) => {
                      return (
                        <>
                          {/* Min - Max validation */}
                          {advncProps.type === 'TextInput' && (
                            <Column lg={advncProps.propsPanelColSize}>
                              <TextInput
                                key={`${selectedFiledProps?.id}-${idx}`}
                                id={String(`${selectedFiledProps?.id}-${idx}`)}
                                className="right-palette-form-item"
                                labelText={
                                  <>
                                    {advncProps.label}
                                    <Tooltip className="min-max-tooltip" align="bottom" label={'It is the ' + advncProps.label + ' of use input'}>
                                      <Information />
                                    </Tooltip>
                                  </>
                                }
                                value={advncProps?.value?.value}
                                invalid={advncProps.invalid ? advncProps.invalid : false}
                                invalidText={advncProps.invalidText ? advncProps.invalidText : null}
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
                            </Column>
                          )}
                          {/* Regex Validation */}
                          {advncProps.type === OPTIONS && (
                            <>
                              <Column className="regx-opt" lg={advncProps.propsPanelColSize}>
                                <RadioButtonGroup
                                  legendText="Regex Pattern"
                                  name={`radio-group-${selectedFiledProps?.id}`}
                                  valueSelected={advncProps.value.value}
                                  orientation="vertical"
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
                                >
                                  {advncProps?.items.map((item, index) => {
                                    return <RadioButton key={index} labelText={item.label} value={item.value} />;
                                  })}
                                </RadioButtonGroup>
                              </Column>
                              {/* <Column lg={advncProps.propsPanelColSize}>
                                <Select
                                  className="regex-types right-palette-form-item"
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
                              </Column> */}
                              {/* Custom Regex Validation */}
                              {(advncProps?.value?.customRegex || advncProps?.value?.customRegex === '') && (
                                <Column lg={16}>
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
                                </Column>
                              )}
                              {/* Default Regex Error Message */}
                              <Column lg={advncProps.propsPanelColSize}>
                                <TextInput
                                  key={`${idx}-'message'`}
                                  id={String(`${idx}-message`)}
                                  className="right-palette-form-item"
                                  labelText={'Default Error Message'}
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
                              </Column>
                            </>
                          )}
                          {/* Min Date and Max Date*/}
                          {advncProps.type === 'Date' && (
                            <Column lg={advncProps.propsPanelColSize} className="right-palette-form-item">
                              <DatePicker
                                datePickerType="single"
                                onChange={(e) => {
                                  handleSchemaChanges(
                                    selectedFiledProps?.id,
                                    'advance',
                                    advncProps.propsName,
                                    {
                                      value: e[0],
                                      message: ''
                                    },
                                    selectedFiledProps?.currentPathDetail
                                  );
                                }}
                              >
                                <DatePickerInput id="date-picker-single" labelText={advncProps?.label} placeholder="mm/dd/yyyy" />
                              </DatePicker>
                            </Column>
                          )}
                          {/* Required Validation */}
                          {/* {advncProps.type === 'Toggle' && (
                            <Toggle
                              key={idx}
                              id={'toggle-' + String(idx) + '-' + selectedFiledProps?.id}
                              className="right-palette-form-item "
                              labelText={advncProps.label}
                              defaultToggled={Boolean(advncProps.value.value)}
                              toggled={Boolean(advncProps.value.value)}
                              labelA={advncProps?.labelA}
                              labelB={advncProps?.labelB}
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
                            />
                          )} */}
                        </>
                      );
                    })}
                  </Grid>
                )}
              </TabPanel>
              {/* <TabPanel className="tab-panel">Conditional Props</TabPanel> */}
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
  switch (propertiesName) {
    case 'isRequired':
      return 'This is a required field';
    case 'min':
      return label + ' must be at least ' + value + ' characters';
    case 'max':
      return label + ' must be no longer than ' + value + ' characters';
    case 'regexValidation':
      return value;
    default:
      return 'regexValidation';
  }
}
