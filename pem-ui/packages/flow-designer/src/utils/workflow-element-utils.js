import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { NODE_TYPES } from '../constants';

const getNewTaskId = () => `Task_Name_${uuidv4()}`;

const getUpdatedElementsAfterActionNodeAddition = ({ elements, newNodeId, targetNodeId, onAddNodeCallback }) => {
  const clonedElements = _.cloneDeep(elements);
  const newEdge = {
    id: getNewTaskId(),
    source: newNodeId,
    target: targetNodeId,
    type: 'plusEdge',
    animated: true,
    style: { stroke: '#000' },
    data: { onAddNodeCallback }
  };
  clonedElements.push(newEdge);
  return clonedElements;
};

const testElements = (taskEdgesClone, elements) => {
  const clonedElements = _.cloneDeep(elements);
  const clonedTaskEdgesClone = _.cloneDeep(taskEdgesClone);

  clonedTaskEdgesClone &&
    clonedTaskEdgesClone.forEach((entry1) => {
      let isNewEntry = true; // says if entry1 is not present in array2
      clonedElements.forEach((entry2) => {
        if (entry1.id === entry2.id) {
          isNewEntry = false; // the entry1 was found in array2
        }
      });

      if (isNewEntry) {
        clonedElements.push(entry1);
        // the entry1 was not found in array2 - do whatever you want here
      }
    });
  return clonedElements;
};

const getUpdatedElementsAfterNodeAddition = ({ elements, targetEdgeId, type, position, onDoubleClick, onDeleteNodeCallback, onNodeClickCallback, onAddNodeCallback }) => {
  const newNodeId = getNewTaskId();
  const nodeData = NODE_TYPES.filter((node) => node.type === type);
  const newNode = {
    id: newNodeId,
    type,
    data: {
      ...nodeData[0],
      onDoubleClick,
      onNodeClickCallback,
      onDeleteNodeCallback
    },
    position
  };
  const clonedElements = _.cloneDeep(elements);
  const targetEdgeIndex = clonedElements.findIndex((x) => x.id === targetEdgeId);
  const targetEdge = elements[targetEdgeIndex];
  const { target: targetNodeId } = targetEdge;
  const updatedTargetEdge = { ...targetEdge, target: newNodeId };
  clonedElements[targetEdgeIndex] = updatedTargetEdge;
  clonedElements.push(newNode);

  return getUpdatedElementsAfterActionNodeAddition({
    elements: clonedElements,
    newNodeId,
    newNode,
    targetNodeId,
    onAddNodeCallback
  });
};

export { getUpdatedElementsAfterNodeAddition, testElements };
