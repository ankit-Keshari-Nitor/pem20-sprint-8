import React, { useEffect, useState } from 'react';
import Canvas from '../canvas';
import { Form } from '@carbon/react';
import { Button } from '@carbon/react';
import './preview-mode.scss';
import { updatePreviewChildToChildren } from '../../utils/helpers';

const FormPreview = ({ layout, deletedFieldPath, handleDrop, renderRow, componentMapper, onFieldSelect, onFieldDelete, openPreview }) => {
  const [formRenderSchema, setFormRenderSchema] = useState([]);
  const [formFieldsData, setFormFieldsData] = useState([]);
  useEffect(() => {
    setFormRenderSchema([...layout]);
  }, [layout, openPreview, onFieldDelete]);

  useEffect(() => {
    formFieldsData.filter((item, index) => {
      if (item.currentPath === deletedFieldPath) {
        const preArray = formFieldsData.slice(0, index);
        const postArray = formFieldsData.slice(Number(index) + 1, formFieldsData.length);
        setFormFieldsData([...preArray, ...postArray]);
      }
      return true;
    });
  }, [deletedFieldPath]);

  const onChangeHandle = (fieldData) => {
    let check = true;
    formFieldsData.filter((item, index) => {
      if (item.currentPath === fieldData.currentPath) {
        const preArray = formFieldsData.slice(0, index);
        const postArray = formFieldsData.slice(Number(index) + 1, formFieldsData.length);
        setFormFieldsData([...preArray, { ...fieldData }, ...postArray]);
        check = false;
      }
    });
    if (check) {
      setFormFieldsData((pre) => [...pre, fieldData]);
    }
  };

  const handSubmit = () => {
    let schema = formRenderSchema;
    let errorHandler = { invalidText: '' };
    formFieldsData.map((fieldItem) => {
      errorHandler.invalid = false;
      if (fieldItem.isRequired && fieldItem.value.length <= 0) {
        errorHandler.invalid = true;
        errorHandler.invalidText = 'This field is required!!';
      }
      if (fieldItem.value.length < fieldItem.min) {
        errorHandler.invalid = true;
        errorHandler.invalidText = `Input value must not be less than ${fieldItem.min} characters!!`;
      }
      if (fieldItem.value.length > fieldItem.max) {
        errorHandler.invalid = true;
        errorHandler.invalidText = `Input value must not be exceed ${fieldItem.max} characters!!`;
      }
      schema = updatePreviewChildToChildren(schema, fieldItem.currentPath.split('-'), { value: fieldItem.value, ...errorHandler });
      return schema;
    });
    setFormRenderSchema(schema);
  };

  return (
    <div className="view-schema-container">
      <Form aria-label="form">
        {/* <TextInput invalid={true} id="text-input-1" type="text" labelText="Text input label" helperText="Optional help text" /> */}
        <Canvas layout={formRenderSchema} renderRow={renderRow} componentMapper={componentMapper} previewMode onChangeHandle={onChangeHandle} />

        <div className="preview-submit-btn">{formRenderSchema.length ? <Button onClick={(e) => handSubmit()}>Submit</Button> : ''}</div>
      </Form>
    </div>
  );
};

export default FormPreview;
