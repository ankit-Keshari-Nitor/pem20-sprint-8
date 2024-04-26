import { v4 as uuid } from 'uuid';
import { ROW, COLUMN, COMPONENT, GROUP, TAB, ACCORDION, CUSTOM_SIZE, SUBTAB, DEFAULTTITLE, SIDEBAR_ITEM } from '../constants/constants';

// a little function to help us with reordering the result
export const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed); // inserting task in new index

  return result;
};

export const remove = (arr, index) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // part of the array after the specified index
  ...arr.slice(index + 1)
];

export const insert = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index)
];

export const update = (arr, index, propsName, newValue) => {
  arr[index][propsName] = newValue;
  return arr;
};

export const reorderChildren = (children, splitDropZonePath, splitItemPath) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    const itemIndex = Number(splitItemPath[0]);
    return reorder(children, itemIndex, dropZoneIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitDropZoneChildrenPath = splitDropZonePath.slice(1);
  const splitItemChildrenPath = splitItemPath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: reorderChildren(nodeChildren.children, splitDropZoneChildrenPath, splitItemChildrenPath)
  };

  return updatedChildren;
};

export const removeChildFromChildren = (children, splitDropZonePath) => {
  if (splitDropZonePath.length === 1) {
    const itemIndex = Number(splitDropZonePath[0]);
    return remove(children, itemIndex);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: removeChildFromChildren(nodeChildren.children, splitItemChildrenPath)
  };

  return updatedChildren;
};

export const updateConfigChildToChildren = (children, splitDropZonePath, item, rest) => {
  const { component, ...others } = item;
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    let newLayoutStructure = { ...others, component: { ...item.component, ...rest } };
    if (children[0]?.type === COLUMN) {
      newLayoutStructure = {
        type: COLUMN,
        id: uuid(),
        defaultsize: '16',
        children: item.length ? [item] : []
      };
    }
    return insert(children, dropZoneIndex, newLayoutStructure);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: updateConfigChildToChildren(nodeChildren.children, splitItemChildrenPath, item, rest)
  };

  return updatedChildren;
};

export const indexForChild = (layout, splitDropZonePath, idx) => {
  if (splitDropZonePath.length === 1) {
    idx = layout[splitDropZonePath[0]].children.length;
    return idx;
  }
  const updatedChildren = [...layout];
  const curIndex = Number(splitDropZonePath.slice(0, 1));
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  return indexForChild(nodeChildren.children, splitItemChildrenPath, idx);
};

export const addChildToChildren = (children, splitDropZonePath, item) => {
  if (splitDropZonePath.length === 1) {
    const dropZoneIndex = Number(splitDropZonePath[0]);
    let newLayoutStructure = item;
    if (children[0]?.type === 'column') {
      newLayoutStructure = {
        type: COLUMN,
        id: uuid(),
        defaultsize: '16',
        children: item.length ? [item] : []
      };
    }
    return insert(children, dropZoneIndex, newLayoutStructure);
  }

  const updatedChildren = [...children];

  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: addChildToChildren(nodeChildren.children, splitItemChildrenPath, item)
  };

  return updatedChildren;
};

export const updateChildToChildren = (children, splitDropZonePath, propsName, newValue) => {
  if (splitDropZonePath.length === 1) {
    if (propsName === CUSTOM_SIZE || propsName === 'tabTitle') {
      const dropZoneIndex = Number(splitDropZonePath[0]);
      return update(children, dropZoneIndex, propsName, newValue);
    } else {
      const updatedItem = { ...children[splitDropZonePath[0]] };
      const deletedLayout = handleRemoveItemFromLayout(children, splitDropZonePath);
      return updateConfigChildToChildren(deletedLayout, splitDropZonePath, updatedItem, { [propsName]: newValue });
    }
  }

  const updatedChildren = [...children];
  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: updateChildToChildren(nodeChildren.children, splitItemChildrenPath, propsName, newValue)
  };

  return updatedChildren;
};

export const updatePreviewChildToChildren = (children, splitDropZonePath, newValue) => {
  if (splitDropZonePath.length === 1) {
    const updatedItem = { ...children[splitDropZonePath[0]] };
    const deletedLayout = handleRemoveItemFromLayout(children, splitDropZonePath);
    return updateConfigChildToChildren(deletedLayout, splitDropZonePath, updatedItem, newValue);
  }

  const updatedChildren = [...children];
  const curIndex = Number(splitDropZonePath.slice(0, 1));

  // Update the specific node's children
  const splitItemChildrenPath = splitDropZonePath.slice(1);
  const nodeChildren = updatedChildren[curIndex];
  updatedChildren[curIndex] = {
    ...nodeChildren,
    children: updatePreviewChildToChildren(nodeChildren.children, splitItemChildrenPath, newValue)
  };

  return updatedChildren;
};

export const handleMoveWithinParent = (layout, splitDropZonePath, splitItemPath) => {
  return reorderChildren(layout, splitDropZonePath, splitItemPath);
};

export const handleAddColumDataToRow = (layout) => {
  const layoutCopy = [...layout];
  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: uuid(),
    children: []
  };

  return layoutCopy.map((row) => {
    if (!row.children.length) {
      row.children = [COLUMN_STRUCTURE];
    }
    return row;
  });
};

export const handleMoveToDifferentParent = (layout, splitDropZonePath, splitItemPath, item) => {
  let newLayoutStructure;
  const COLUMN_STRUCTURE = {
    type: COLUMN,
    id: uuid(),
    children: [item]
  };

  const ROW_STRUCTURE = {
    type: ROW,
    id: uuid()
  };

  switch (splitDropZonePath.length) {
    case 1: {
      // moving column outside into new row made on the fly
      if (item.type === COLUMN) {
        newLayoutStructure = {
          ...ROW_STRUCTURE,
          children: [item]
        };
      } else {
        // moving component outside into new row made on the fly
        if (item.component.type === GROUP || item.component.type === ACCORDION) {
          newLayoutStructure = {
            ...ROW_STRUCTURE,
            maintype: item.component.type,
            children: [COLUMN_STRUCTURE]
          };
        }
        newLayoutStructure = {
          ...item
        };
      }
      break;
    }
    case 2: {
      // moving component outside into a row which creates column
      if (item.type === COMPONENT) {
        newLayoutStructure = COLUMN_STRUCTURE;
      } else {
        // moving column into existing row
        newLayoutStructure = item;
      }

      break;
    }
    default: {
      newLayoutStructure = item;
    }
  }

  let updatedLayout = layout;
  updatedLayout = removeChildFromChildren(updatedLayout, splitItemPath);
  updatedLayout = addChildToChildren(updatedLayout, splitDropZonePath, newLayoutStructure);

  return updatedLayout;
};

export const handleMoveSidebarComponentIntoParent = (layout, splitDropZonePath, item) => {
  let newLayoutStructure;
  if (item.component.type === GROUP) {
    switch (splitDropZonePath.length) {
      case 1: {
        newLayoutStructure = {
          type: ROW,
          id: uuid(),
          maintype: item.component.type,
          children: [{ type: COLUMN, id: uuid(), defaultsize: '16', children: [] }]
        };
        break;
      }
      case 2: {
        if (item.component.type === GROUP) {
          newLayoutStructure = {
            type: ROW,
            id: uuid(),
            maintype: item.component.type,
            children: [{ type: COLUMN, id: uuid(), defaultsize: '16', children: [] }]
          };
        } else {
          newLayoutStructure = {
            type: COLUMN,
            id: uuid(),
            children: [item]
          };
        }
        break;
      }
      default: {
        newLayoutStructure = {
          type: ROW,
          id: uuid(),
          maintype: item.component.type,
          children: [{ type: COLUMN, id: uuid(), defaultsize: '16', children: [] }]
        };
      }
    }
  } else {
    if (item.component.type === GROUP) {
      newLayoutStructure = {
        maintype: item.component.type,
        ...item
      };
    } else if (item.component.type === ACCORDION) {
      newLayoutStructure = {
        id: uuid(),
        type: item.component.type,
        maintype: item.component.type,
        children: [],
        component: item.component
      };
    } else if (item.component.type === TAB) {
      newLayoutStructure = {
        id: uuid(),
        type: item.component.type,
        maintype: item.component.type,
        component: item.component,
        children: [
          {
            id: uuid(),
            tabTitle: DEFAULTTITLE,
            type: SUBTAB,
            children: []
          }
        ]
      };
    } else {
      newLayoutStructure = {
        ...item
      };
    }
  }
  return addChildToChildren(layout, splitDropZonePath, newLayoutStructure);
};

export const handleRemoveItemFromLayout = (layout, splitItemPath) => {
  return removeChildFromChildren(layout, splitItemPath);
};

export const getFormFieldDetails = (path, layout) => {
  let res = {};
  if (path.length > 1) {
    if (layout && layout.type === ROW) {
      layout = layout.children[path[0]];
    } else {
      layout = layout[path[0]];
    }
    path.shift();
    getFormFieldDetails(path, layout);
  } else {
    if (layout.children && layout.children.length > 0) {
      res = layout.children[+path];
    } else {
      res = layout[+path];
    }
  }
  return res;
};

export const nestedLayoutView = (childLayout, childSchema) => {
  childLayout.forEach((item, index) => {
    switch (item.type) {
      case ROW: {
        childSchema.push({
          id: item.id,
          type: item.type,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case COLUMN: {
        childSchema.push({
          id: item.id,
          type: item.type,
          size: item?.customsize ? item?.customsize : item?.defaultsize,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case ACCORDION: {
        const { icon, label, group, ...others } = item.component;
        childSchema.push({
          id: item.id,
          type: item.type,
          ...others,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case TAB: {
        childSchema.push({
          id: item.id,
          type: item.type,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      case SUBTAB: {
        const { id, tabTitle } = item;
        childSchema.push({
          id,
          tabTitle,
          children: []
        });
        nestedLayoutView(childLayout[index]?.children, childSchema[index].children);
        break;
      }
      default: {
        const { icon, label, group, ...others } = item.component;
        childSchema.push({
          id: item.id,
          ...others
        });
      }
    }
  });
  return childSchema;
};

export const convertToSchema = (layout) => {
  const schema = nestedLayoutView(layout, []);
  return { fields: schema };
};

export const findChildComponentById = (array, id) => {
  for (const item of array) {
    if (item.id === id) return item;
    if (item.children?.length) {
      const innerResult = findChildComponentById(item.children, id);
      if (innerResult) return innerResult;
    }
  }
};

export const formValidation = (formLayout) => {
  formLayout.forEach((fieldItem, index) => {
    switch (fieldItem.type) {
      case COMPONENT: {
        fieldItem.component.invalid = false;
        if (fieldItem.component?.isRequired?.value && (fieldItem.component?.value === undefined || fieldItem.component?.value.length <= 0)) {
          fieldItem.component.invalid = true;
          fieldItem.component.invalidText = fieldItem.component?.isRequired.message;
        }
        if (fieldItem.component?.min?.value && fieldItem.component?.value !== undefined && fieldItem.component?.value.length < Number(fieldItem.component?.min?.value.trim())) {
          fieldItem.component.invalid = true;
          fieldItem.component.invalidText = fieldItem.component?.min.message;
        }
        if (fieldItem.component?.max?.value && fieldItem.component?.value !== undefined && fieldItem.component?.value.length > Number(fieldItem.component?.max?.value.trim())) {
          fieldItem.component.invalid = true;
          fieldItem.component.invalidText = fieldItem.component?.max.message;
        }
        break;
      }
      default: {
        formValidation(formLayout[index]?.children);
      }
    }
  });
  return formLayout;
};

export const collectPaletteEntries = (formFields) => {
  return Object.entries(formFields)
    .map(([type, formField]) => {
      const { config: fieldConfig } = formField;
      return {
        type: SIDEBAR_ITEM,
        component: {
          type: type,
          label: fieldConfig.label,
          group: fieldConfig.group,
          icon: fieldConfig.icon
        }
      };
    })
    .filter(({ type }) => type !== 'default');
};
