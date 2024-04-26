import React, { useState, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import './designer.scss';

import Row from '../../elements/custom-row';
import Canvas from '../canvas';
import ComponentsTray from '../components-tray/components-tray';
import PropsPanel from '../props-panel/props-panel';

import {
  handleMoveWithinParent,
  handleMoveToDifferentParent,
  handleMoveSidebarComponentIntoParent,
  handleRemoveItemFromLayout,
  updateChildToChildren,
  addChildToChildren,
  findChildComponentById,
  indexForChild
} from '../../utils/helpers';
import { SIDEBAR_ITEM, COMPONENT, COLUMN, INITIAL_DATA, ACCORDION, CUSTOM_COLUMN, CUSTOM_SIZE, SUBTAB, CUSTOM_TITLE, DEFAULTTITLE, TAB } from '../../constants/constants';
import ViewSchema from './../view-schema';
import { Button, Grid, Modal, Column } from '@carbon/react';
import FormPreview from '../preview-mode';

export default function Designer({ componentMapper }) {
  const initialLayout = INITIAL_DATA.layout;
  const initialComponents = INITIAL_DATA.components;
  const [layout, setLayout] = useState(initialLayout);
  const [components, setComponents] = useState(initialComponents);
  const [selectedFiledProps, setSelectedFiledProps] = useState();
  const [open, setOpen] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [deletedFieldPath, setDeletedFieldPath] = useState();

  const handleDrop = useCallback(
    (dropZone, item) => {
      const splitDropZonePath = dropZone.path.split('-');
      const pathToDropZone = splitDropZonePath.slice(0, -1).join('-');

      let newItem = { id: item.id, type: item.type, component: item.component };
      if (item.maintype) {
        newItem = { id: item.id, type: item.type, maintype: item.maintype, children: item.children };
      }
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

  const onFieldSelect = (e, componentDetail, currentPathDetail) => {
    e.stopPropagation();
    let filedTypeConfig;
    if (componentDetail.type === COMPONENT || componentDetail.type === ACCORDION || componentDetail.type === TAB) {
      if (componentDetail.maintype) {
        filedTypeConfig = componentMapper[componentDetail.maintype].config;
      } else {
        filedTypeConfig = componentMapper[componentDetail.component.type].config;
      }
      let fieldData = findChildComponentById(layout, componentDetail.id);

      filedTypeConfig?.editableProps?.Basic.map((basicEditPops) => {
        if (fieldData?.component[basicEditPops?.propsName]) {
          return (basicEditPops.value = fieldData.component[basicEditPops?.propsName]);
        } else {
          return (basicEditPops.value = '');
        }
      });

      filedTypeConfig?.editableProps?.Condition?.map((conditionEditPops) => {
        if (fieldData?.component[conditionEditPops?.propsName]) {
          return (conditionEditPops.value = fieldData.component[conditionEditPops?.propsName]);
        } else {
          return (conditionEditPops.value = false);
        }
      });

      filedTypeConfig?.advanceProps.map((advancePops) => {
        if (fieldData?.component[advancePops?.propsName]) {
          return (advancePops.value = fieldData.component[advancePops?.propsName]);
        } else {
          return (advancePops.value = { value: '', message: '' });
        }
      });
    } else if (componentDetail.type === COLUMN) {
      const size = componentDetail.customsize ? componentDetail.customsize : componentDetail.defaultsize;
      filedTypeConfig = { ...componentDetail, style: [{ labelText: 'Column Size', text: size }], currentPathDetail: currentPathDetail };
    } else if (componentDetail.type === SUBTAB) {
      filedTypeConfig = { ...componentDetail };
    }
    setSelectedFiledProps({ id: componentDetail.id, type: componentDetail.type, component: { ...filedTypeConfig }, currentPathDetail: currentPathDetail });
  };

  const columnSizeCustomization = (colsize, path) => {
    const newLayout = updateChildToChildren(layout, path.split('-'), CUSTOM_SIZE, colsize);
    setLayout([...newLayout]);
  };

  const handleSchemaChanges = (id, key, propsName, newValue, currentPathDetail) => {
    const componentPosition = currentPathDetail.split('-');
    if (key === SUBTAB) {
      const position = indexForChild(layout, componentPosition, 0);
      componentPosition.push(position);
      const newLayout = addChildToChildren(layout, componentPosition, { id: uuid(), tabTitle: DEFAULTTITLE, type: SUBTAB, children: [] });
      setLayout([...newLayout]);
    } else if (key === CUSTOM_COLUMN) {
      const position = indexForChild(layout, componentPosition, 0);
      componentPosition.push(position);
      const newLayout = addChildToChildren(layout, componentPosition, []);
      setLayout([...newLayout]);
    } else if (key === CUSTOM_TITLE) {
      let objCopy = selectedFiledProps;
      objCopy.component[propsName] = newValue;
      setSelectedFiledProps({ ...objCopy });
      setLayout(updateChildToChildren(layout, componentPosition, propsName, newValue));
    } else {
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
      setLayout(updateChildToChildren(layout, componentPosition, propsName, newValue));
    }
  };

  const onFieldDelete = (e, path) => {
    e.stopPropagation();
    setDeletedFieldPath(path);
    const splitDropZonePath = path.split('-');
    setLayout(handleRemoveItemFromLayout(layout, splitDropZonePath));
    setSelectedFiledProps();
  };

  const replaceComponet = (e, path, newItem) => {
    e.stopPropagation();
    setDeletedFieldPath(path);
    const splitDropZonePath = path.split('-');
    const oldLayout = handleRemoveItemFromLayout(layout, splitDropZonePath);
    const updatedLayout = handleMoveSidebarComponentIntoParent(oldLayout, splitDropZonePath, { id: uuid(), type: COMPONENT, component: { ...newItem.component } });
    setLayout(updatedLayout);
    onFieldSelect(e, { id: uuid(), type: COMPONENT, component: { ...newItem.component } }, path);
  };

  const renderRow = (row, currentPath, renderRow, previewMode, onChangeHandle) => {
    return (
      <Row
        key={row.id}
        data={row}
        handleDrop={handleDrop}
        path={currentPath}
        componentMapper={componentMapper}
        onFieldSelect={onFieldSelect}
        renderRow={renderRow}
        onFieldDelete={onFieldDelete}
        previewMode={previewMode}
        onChangeHandle={onChangeHandle}
      />
    );
  };
  return (
    <>
      <div className="page-designer">
        <div className="header-container">
          <Grid>
            <Column sm={4}>
              <span className="header-title">Form builder name 01</span>
            </Column>
            <Column sm={{ span: 2, offset: 12 }} style={{ marginLeft: '0.5rem' }}>
              <Button kind="secondary" size="sm" onClick={() => setOpen(true)}>
                View Schema
              </Button>
            </Column>
            <Column sm={2} style={{ marginLeft: '1.5rem' }}>
              <Button kind="secondary" size="sm" onClick={() => setOpenPreview(true)}>
                Preview
              </Button>
            </Column>
          </Grid>
        </div>
        <div className="layout-container">
          <div className="layout-container-wrapper">
            <div className="components-tray">
              <ComponentsTray componentMapper={componentMapper} />
            </div>
            <div className="canvas-wrapper">
              <Canvas layout={layout} handleDrop={handleDrop} renderRow={renderRow} componentMapper={componentMapper} onFieldSelect={onFieldSelect} onFieldDelete={onFieldDelete} />
            </div>
          </div>
          {selectedFiledProps && (
            <div className="props-panel">
              <PropsPanel
                layout={layout}
                selectedFiledProps={selectedFiledProps}
                handleSchemaChanges={handleSchemaChanges}
                columnSizeCustomization={columnSizeCustomization}
                onFieldDelete={onFieldDelete}
                componentMapper={componentMapper}
                replaceComponet={replaceComponet}
              />
            </div>
          )}
        </div>
        <Grid>
          <Column sm={{ span: 2, offset: 12 }}>
            <Button kind="secondary" className="cancel-button" size="sm">
              Cancel
            </Button>
          </Column>
          <Column sm={2}>
            <Button kind="secondary" className="save-button" size="sm">
              Save
            </Button>
          </Column>
        </Grid>
      </div>

      <Modal open={open} onRequestClose={() => setOpen(false)} passiveModal modalLabel="Schema" primaryButtonText="Close" secondaryButtonText="Cancel">
        <ViewSchema layout={layout} />
      </Modal>
      <Modal
        open={openPreview}
        onRequestClose={() => setOpenPreview(false)}
        passiveModal
        modalLabel="Form Preview"
        primaryButtonText="Close"
        secondaryButtonText="Cancel"
        className="preview-modal"
      >
        <FormPreview
          layout={layout}
          deletedFieldPath={deletedFieldPath}
          handleDrop={handleDrop}
          renderRow={renderRow}
          componentMapper={componentMapper}
          onFieldSelect={onFieldSelect}
          onFieldDelete={onFieldDelete}
          openPreview={openPreview}
          dataTestid={'form-preview-id'}
        />
      </Modal>
    </>
  );
}
