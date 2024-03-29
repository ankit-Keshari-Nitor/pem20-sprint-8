import React, { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import './designer.scss';

import Row from '../../elements/Row';
import Canvas from '../canvas';
import ComponentsTray from '../components-tray/components-tray';
import PropsPanel from '../props-panel/props-panel';

import { handleMoveWithinParent, handleMoveToDifferentParent, handleMoveSidebarComponentIntoParent, handleRemoveItemFromLayout, updateChildToChildren } from '../../utils/helpers';
import { SIDEBAR_ITEM, COMPONENT, COLUMN, INITIAL_DATA } from '../../constants/constants';

export default function Designer({ componentMapper }) {
  const initialLayout = INITIAL_DATA.layout;
  const initialComponents = INITIAL_DATA.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);
  const [selectedFiledProps, setSelectedFiledProps] = useState();

  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split('-');
      const pathToDropZone = splitDropZonePath.slice(0, -1).join('-');

      const newItem = { id: item.id, type: item.type, component: item.component };
      if (item.type === COLUMN) {
        newItem.children = item.children;
      }

      // sidebar into
      if (item.type === SIDEBAR_ITEM) {
        // 1. Move sidebar item into page
        const newComponent = {
          id: uuid(),
          ...item.component
        };
        setComponents({
          ...components,
          [newComponent.id]: newComponent
        });
        const newItem = {
          id: newComponent.id,
          type: COMPONENT,
          component: item.component
        };
        setLayout(handleMoveSidebarComponentIntoParent(layout, splitDropZonePath, newItem));
        return;
      }

      // move down here since sidebar items dont have path
      const splitItemPath = item.path.split('-');
      const pathToItem = splitItemPath.slice(0, -1).join('-');

      // 2. Pure move (no create)
      if (splitItemPath.length === splitDropZonePath.length) {
        // 2.a. move within parent
        if (pathToItem === pathToDropZone) {
          setLayout(handleMoveWithinParent(layout, splitDropZonePath, splitItemPath));
          return;
        }

        // 2.b. OR move different parent
        // TODO FIX columns. item includes children
        setLayout(handleMoveToDifferentParent(layout, splitDropZonePath, splitItemPath, newItem));
        return;
      }

      // 3. Move + Create
      setLayout(handleMoveToDifferentParent(layout, splitDropZonePath, splitItemPath, newItem));
    },
    [layout, components]
  );

  const selectedField = (e, componentDetail, currentPathDetail) => {
    e.stopPropagation();
    if(componentDetail.type === COMPONENT){
      let filedTypeConfig = componentMapper[componentDetail.component.type].config;
    let fieldData = findById(layout, componentDetail.id);

    filedTypeConfig?.editableProps?.Basic.map((basicEditPops) => {
      if (fieldData.component[basicEditPops.propsName]) {
        return (basicEditPops.value = fieldData.component[basicEditPops?.propsName]);
      } else {
        return (basicEditPops.value = '');
      }
    });

    filedTypeConfig?.editableProps?.Condition?.map((conditionEditPops) => {
      if (fieldData.component[conditionEditPops.propsName]) {
        return (conditionEditPops.value = fieldData.component[conditionEditPops?.propsName]);
      } else {
        return (conditionEditPops.value = false);
      }
    });

    filedTypeConfig?.advanceProps.map((advancePops) => {
      if (fieldData.component[advancePops.propsName]) {
        return (advancePops.value = fieldData.component[advancePops?.propsName]);
      } else {
        return (advancePops.value = '');
      }
    });

    setSelectedFiledProps({ id: componentDetail.id, type: componentDetail.type, component: { ...filedTypeConfig }, currentPathDetail: currentPathDetail });
  
    }
    };

  function findById(array, id) {
    for (const item of array) {
      if (item.id === id) return item;
      if (item.children?.length) {
        const innerResult = findById(item.children, id);
        if (innerResult) return innerResult;
      }
    }
  }

  const handleSchemaChanges = (id, key, propsName, newValue, currentPathDetail) => {
    const componentPosition = currentPathDetail.split('-');
    let objCopy = selectedFiledProps;
    if (key !== 'advance') {
      objCopy.component.editableProps[key].map((config) => {
        if (config.propsName === propsName) {
          config.value = newValue;
        }
      });
    } else {
      objCopy.component.advanceProps.map((config) => {
        if (config.propsName === propsName) {
          config.value = newValue;
        }
      });
    }
    setSelectedFiledProps({ ...objCopy });
    const newLayout = updateChildToChildren(layout, componentPosition, propsName, newValue);
    setLayout([...newLayout]);
  };

  const deleteFormField = (e, path) => {
    e.stopPropagation();
    const splitDropZonePath = path.split('-');
    setLayout(handleRemoveItemFromLayout(layout, splitDropZonePath));
    setSelectedFiledProps();
  };

  const renderRow = (row, currentPath, renderRow) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        path={currentPath}
        componentMapper={componentMapper}
        selectedField={selectedField}
        renderRow={renderRow}
        deleteFormField={deleteFormField}
      />
    );
  };

  return (
    <div className="designer-container">
      <div className="layout-container">
        {/* TopNav Will come her */}
        <div className="leftSideBar">
          <ComponentsTray componentMapper={componentMapper} />
        </div>
        <div className="pageContainer">
          <Canvas layout={layout} handleDrop={handleDrop} renderRow={renderRow} componentMapper={componentMapper} selectedField={selectedField} deleteFormField={deleteFormField} />
        </div>
        <div className="rightSideBar">
          <PropsPanel selectedFiledProps={selectedFiledProps} handleSchemaChanges={handleSchemaChanges} />
        </div>
      </div>
    </div>
  );
}
