import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';

import './page-designer.scss';
import { Canvas, ComponentTray, PropsPanel } from '../../components';

const PageDesigner = ({ mapper, getFormField, getIconByType }) => {
  const [schema, setSchema] = React.useState([]);
  const [selectedFiledProps, setSelectedFiledProps] = React.useState();
  const [valueTracker, setValueTracker] = React.useState(false);
  const [fieldDeleted, setFieldDeleted] = React.useState(false);

  const [{ canDrop, isOver }, drop] = useDrop({
    accept: 'form-field',
    drop: (item) => setSchema((schema) => [...schema, item]),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });

  // Logic to add background color
  const isActive = canDrop && isOver;
  let backgroundColor = '#ffffff';
  if (isActive) {
    backgroundColor = 'rgb(187 204 247)';
  } else if (canDrop) {
    backgroundColor = 'rgb(203 209 223)';
  }

  // Function to remove the form field from canvas
  const removeFormFieldFromCanvas = (id) => {
    setSchema((current) =>
      current.filter((item) => {
        return item.id !== id;
      })
    );
    setFieldDeleted(!fieldDeleted);
  };

  useEffect(() => {
    if (fieldDeleted) {
      setSelectedFiledProps({});
      setFieldDeleted(!fieldDeleted);
    }
  }, [fieldDeleted]);

  const selectedField = (fieldProps) => {
    let filedTypeConfig = getFormField(fieldProps.type).config;
    const fieldData = schema.filter((fieldItem) => fieldItem.id === fieldProps.id)[0];
    filedTypeConfig?.editableProps?.Basic.map((baiscEditPops) => {
      if (fieldData[baiscEditPops.propsName]) {
        return (baiscEditPops.value = fieldData[baiscEditPops?.propsName]);
      } else {
        return (baiscEditPops.value = '');
      }
    });
    filedTypeConfig?.editableProps?.Condition?.map((conditionEditPops) => {
      if (fieldData[conditionEditPops.propsName]) {
        return (conditionEditPops.value = fieldData[conditionEditPops?.propsName]);
      } else {
        return (conditionEditPops.value = false);
      }
    });

    filedTypeConfig?.advanceProps.map((advancePops) => {
      if (fieldData[advancePops.propsName]) {
        return (advancePops.value = fieldData[advancePops?.propsName]);
      } else {
        return (advancePops.value = '');
      }
    });

    setSelectedFiledProps({ ...filedTypeConfig, id: fieldProps.id });
  };

  const handleSchemaChanges = (idx, key, propsName, newValue) => {
    let objCopy = selectedFiledProps;
    if (key !== 'advance') {
      objCopy.editableProps[key].map((config) => {
        if (config.propsName === propsName) {
          config.value = newValue;
        }
      });
    } else {
      objCopy.advanceProps.map((config) => {
        if (config.propsName === propsName) {
          config.value = newValue;
        }
      });
    }
    setSelectedFiledProps(objCopy);

    schema.map((schemaItem) => {
      if (schemaItem.id === idx) {
        schemaItem[propsName] = newValue;
      }
    });
    setValueTracker(!valueTracker);
  };

  return (
    <div className="PageDesigner-container">
      <div className="layout-container">
        <div className="left-palette-container">
          <ComponentTray mapper={mapper} getIconByType={getIconByType} />
        </div>
        <div ref={drop} style={{ backgroundColor }} className="canvas-container">
          <Canvas schema={schema} removeFormField={removeFormFieldFromCanvas} selectedField={selectedField} getFormField={getFormField} />
        </div>
        <div className="right-container">{selectedFiledProps && <PropsPanel selectedFiledProps={selectedFiledProps} handleSchemaChanges={handleSchemaChanges} />}</div>
      </div>
    </div>
  );
};

export default PageDesigner;
