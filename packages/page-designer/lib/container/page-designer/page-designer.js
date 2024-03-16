/**
   PRIVATE LICENSE
   */
  
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var reactDnd = require('react-dnd');
require('./page-designer.scss.js');
require('@carbon/icons-react');
require('../../components/canvas/field-renderer/field-renderer.scss.js');
var canvas = require('../../components/canvas/canvas.js');
var componentsTray = require('../../components/components-tray/components-tray.js');
require('../../components/components-tray/component-item/component-item.scss.js');
var propsPanel = require('../../components/props-panel/props-panel.js');

const PageDesigner = _ref => {
  let {
    componentMapper
  } = _ref;
  const [schema, setSchema] = React.useState([]);
  const [selectedFiledProps, setSelectedFiledProps] = React.useState();
  const [valueTracker, setValueTracker] = React.useState(false);
  const [fieldDeleted, setFieldDeleted] = React.useState(false);
  const [{
    canDrop,
    isOver
  }, drop] = reactDnd.useDrop({
    accept: 'form-field',
    drop: item => setSchema(schema => [...schema, item]),
    collect: monitor => ({
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
  const getFormField = type => {
    return componentMapper[type];
  };

  // Function to remove the form field from canvas
  const removeFormFieldFromCanvas = id => {
    setSchema(current => current.filter(item => {
      return item.id !== id;
    }));
    setFieldDeleted(!fieldDeleted);
  };
  React.useEffect(() => {
    if (fieldDeleted) {
      setSelectedFiledProps({});
      setFieldDeleted(!fieldDeleted);
    }
  }, [fieldDeleted]);
  const selectedField = fieldProps => {
    let filedTypeConfig = getFormField(fieldProps.type).config;
    const fieldData = schema.filter(fieldItem => fieldItem.id === fieldProps.id)[0];
    filedTypeConfig?.editableProps?.Basic.map(baiscEditPops => {
      if (fieldData[baiscEditPops.propsName]) {
        return baiscEditPops.value = fieldData[baiscEditPops?.propsName];
      } else {
        return baiscEditPops.value = '';
      }
    });
    filedTypeConfig?.editableProps?.Condition?.map(conditionEditPops => {
      if (fieldData[conditionEditPops.propsName]) {
        return conditionEditPops.value = fieldData[conditionEditPops?.propsName];
      } else {
        return conditionEditPops.value = false;
      }
    });
    filedTypeConfig?.advanceProps.map(advancePops => {
      if (fieldData[advancePops.propsName]) {
        return advancePops.value = fieldData[advancePops?.propsName];
      } else {
        return advancePops.value = '';
      }
    });
    setSelectedFiledProps({
      ...filedTypeConfig,
      id: fieldProps.id
    });
  };
  const handleSchemaChanges = (idx, key, propsName, newValue) => {
    let objCopy = selectedFiledProps;
    if (key !== 'advance') {
      objCopy.editableProps[key].map(config => {
        if (config.propsName === propsName) {
          config.value = newValue;
        }
      });
    } else {
      objCopy.advanceProps.map(config => {
        if (config.propsName === propsName) {
          config.value = newValue;
        }
      });
    }
    setSelectedFiledProps(objCopy);
    schema.map(schemaItem => {
      if (schemaItem.id === idx) {
        schemaItem[propsName] = newValue;
      }
    });
    setValueTracker(!valueTracker);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "PageDesigner-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "layout-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "left-palette-container"
  }, /*#__PURE__*/React.createElement(componentsTray.default, {
    componentMapper: componentMapper
  })), /*#__PURE__*/React.createElement("div", {
    ref: drop,
    style: {
      backgroundColor
    },
    className: "canvas-container"
  }, /*#__PURE__*/React.createElement(canvas.default, {
    schema: schema,
    removeFormField: removeFormFieldFromCanvas,
    selectedField: selectedField,
    getFormField: getFormField
  })), /*#__PURE__*/React.createElement("div", {
    className: "right-container"
  }, selectedFiledProps && /*#__PURE__*/React.createElement(propsPanel.default, {
    selectedFiledProps: selectedFiledProps,
    handleSchemaChanges: handleSchemaChanges
  }))));
};

exports.default = PageDesigner;
