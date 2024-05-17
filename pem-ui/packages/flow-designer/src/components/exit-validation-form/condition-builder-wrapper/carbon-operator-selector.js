import * as React from 'react';
import { toOptions, useValueEditor } from 'react-querybuilder';
import { Button, Modal, Select, TextInput, TreeView, TreeNode } from '@carbon/react';
import { ElippsisIcon } from '../../../icons';
import { useState } from 'react';
import WrapperModal from '../../helpers';

const CarbonOperatorSelector = ({
  className,
  handleOnChange,
  options,
  value,
  title,
  disabled,
  testID: _testID,
  rule: _rule,
  rules: _rules,
  level: _level,
  path: _path,
  context: _context,
  validation: _validation,
  operator: _operator,
  field: _field,
  fieldData: _fieldData,
  multiple: _multiple,
  listsAsArrays: _listsAsArrays,
  schema: _schema,
  ...extraProps
}) => {
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const { valueAsArray, multiValueHandler } = useValueEditor({
    handleOnChange,
    inputType: 'text',
    operator: 'between',
    value: Array.isArray(value) ? value : ['', value],
    type: 'text',
    listsAsArrays: 'false',
    parseNumbers: 'false',
    values: []
  });

  const operandSelector = (selectedValue) => {
    multiValueHandler(selectedValue, 0);
    setOpenCancelDialog(false);
  };

  const Temp = (
    <TreeView label="Demo Data">
      <TreeNode label="Enabled-1">
        <TreeNode label="Disabled-1" onClick={(e) => operandSelector('Disabled-1')} />
      </TreeNode>
      <TreeNode label="Enabled-2">
        <TreeNode label="Disabled-2" onClick={(e) => operandSelector('Disabled-2')} />
      </TreeNode>
    </TreeView>
  );

  return (
    <>
      <TextInput
        id="txt-input"
        type="text"
        value={valueAsArray.length > 1 ? valueAsArray[0] : ''}
        title={title}
        className={className}
        placeholder={'Operand'}
        labelText={''}
        onChange={(e) => multiValueHandler(e.target.value, 0)}
        {...extraProps}
      />
      <Button size="md" className="opt-btn" kind="secondary" renderIcon={ElippsisIcon} onClick={() => setOpenCancelDialog(true)}></Button>
      <WrapperModal openCancelDialog={openCancelDialog} setOpenCancelDialog={setOpenCancelDialog}>
        {Temp}
      </WrapperModal>
      <Select
        id="selector-label"
        className={className}
        title={title}
        value={valueAsArray.length > 1 ? valueAsArray[1] : valueAsArray[0]}
        disabled={disabled}
        onChange={(e) => multiValueHandler(e.target.value, 1)}
        {...extraProps}
      >
        {toOptions(options)}
      </Select>
    </>
  );
};

export default CarbonOperatorSelector;
