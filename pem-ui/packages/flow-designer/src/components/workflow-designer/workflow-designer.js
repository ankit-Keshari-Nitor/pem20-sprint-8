import React, { useState, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import { isNode } from 'reactflow';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addEdge, MarkerType, useNodesState, useEdgesState } from 'reactflow';

import './workflow-designer.scss';

import Designer from '../../../../page-designer/src';
import componentMapper from '../../../../carbon-mappers/src';
import { CrossEdge, PlusEdge } from '../edges';
import TaskFlowDesigner from '../task-flow-designer';
import { StartNode, EndNode, GatewayNode, TaskNode } from '../nodes';
import { getUpdatedElementsAfterNodeAddition, testElements } from '../../utils/workflow-element-utils';

const connectionLineStyle = { stroke: '#000' };
const defaultViewport = { x: 0, y: 0, zoom: 1 };
const snapGrid = [10, 10];
const endMarks = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#FF0072'
};

const TASK_INITIAL_NODES = [
  {
    id: '1',
    type: 'start',
    data: { label: 'Start' },
    position: { x: 350, y: 200 },
    sourcePosition: 'right'
  },
  {
    id: '2',
    type: 'end',
    data: { label: 'End' },
    position: { x: 550, y: 200 },
    targetPosition: 'left'
  }
];

const TASK_NODE_TYPES = {
  start: StartNode,
  end: EndNode,
  partner: TaskNode,
  approval: TaskNode,
  attribute: TaskNode,
  sponsor: TaskNode,
  custom: TaskNode,
  system: TaskNode,
  gateway: GatewayNode
};

const TASK_EDGE_TYPES = {
  crossEdge: CrossEdge,
  plusEdge: PlusEdge
};

const getNewTaskId = () => `Task_Name_${uuidv4()}`;

export default function WorkFlowDesigner() {
  const [isDialogFlowActive, setIsDialogFlowActive] = useState(false);
  const [isPageDesignerActive, setIsPageDesignerActive] = useState(false);
  const [elements, setElements] = React.useState([]);

  // --------------------------------- Task Flow States -----------------------------------
  const [openTaskPropertiesBlock, setOpenTaskPropertiesBlock] = useState(false);
  const taskFlowWrapper = useRef(null);
  const [taskNodes, setTaskNodes, onTaskNodesChange] = useNodesState(TASK_INITIAL_NODES);
  const [taskEdges, setTaskEdges, onTaskEdgesChange] = useEdgesState([]);
  const [taskEdgesClone, setTaskEdgesClone] = useState([]);
  const [taskFlowInstance, setTaskFlowInstance] = useState(null);
  const [selectedTaskNode, setSelectedTaskNode] = useState(null);

  React.useEffect(() => {
    const nodes = taskNodes
      .filter((x) => !x.target)
      .map((x) => ({
        ...x,
        data: { ...x.data, onDeleteNodeCallback, onNodeClickCallback }
      }));
    const edges = taskEdges.filter((x) => x.target).map((x) => ({ ...x, data: { ...x.data, onAddNodeCallback } }));
    setElements([...nodes, ...edges]);
  }, []);

  React.useEffect(() => {
    let tempNodes = [];
    let tempEdges = [];
    elements.forEach((el) => {
      if (isNode(el)) {
        tempNodes.push(el);
      } else {
        tempEdges.push(el);
      }
    });
    setTaskNodes([...tempNodes]);
    setTaskEdges([...tempEdges]);
  }, [elements]);

  React.useEffect(() => {
    if (taskEdgesClone.length > 0) {
      const clonedElements = testElements(taskEdgesClone, elements);
      setElements([...clonedElements]);
    }
  }, [taskEdgesClone]);

  const onAddNodeCallback = ({ id, type, position }) => {
    setElements((elements) =>
      getUpdatedElementsAfterNodeAddition({
        elements,
        targetEdgeId: id,
        type,
        position,
        onDoubleClick,
        onDeleteNodeCallback,
        onNodeClickCallback,
        onAddNodeCallback
      })
    );
  };

  const onDeleteNodeCallback = (id) => {
    setElements((elements) => {
      const clonedElements = _.cloneDeep(elements);
      const incomingEdges = clonedElements.filter((x) => x.target === id);
      const outgoingEdges = clonedElements.filter((x) => x.source === id);
      const updatedIncomingEdges = incomingEdges.map((x) => ({
        ...x,
        target: outgoingEdges[0].target
      }));
      const filteredElements = clonedElements.filter((x) => x.id !== id && x.target !== incomingEdges[0].target && x.source !== outgoingEdges[0].source);
      filteredElements.push(...updatedIncomingEdges);
      return filteredElements;
    });
  };

  const onNodeClickCallback = (id) => {
    setElements((elements) => {
      const currentNode = elements.find((x) => x.id === id);
      const nodes = elements.filter((x) => x.position);
      const edges = elements.filter((x) => !x.position);
      return elements;
    });
  };

  // --------------------------------- Task Flow Methods -----------------------------------
  const onDoubleClick = (event) => {
    setIsDialogFlowActive(true);
  };

  const onTaskNodeConnect = useCallback((params) => {
    let newParam = params;
    newParam.type = 'plusEdge';
    newParam.markerEnd = endMarks;
    setTaskEdges((eds) => addEdge({ ...newParam, animated: true, style: { stroke: '#000' }, data: { ...eds.data, onAddNodeCallback } }, eds));
    setTaskEdgesClone((eds) => addEdge({ ...newParam, animated: true, style: { stroke: '#000' }, data: { ...eds.data, onAddNodeCallback } }, eds));
  }, []);

  const onTaskNodeDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onTaskNodeDrop = useCallback(
    (event) => {
      event.preventDefault();

      const nodeData = JSON.parse(event.dataTransfer.getData('application/nodeData'));

      // check if the dropped element is valid
      if (typeof nodeData === 'undefined' || !nodeData) {
        return;
      }

      // Get the position of the task
      const position = taskFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const newTask = {
        id: getNewTaskId(),
        position,
        type: nodeData.type,
        data: { ...nodeData, onDoubleClick, onDeleteNodeCallback, onNodeClickCallback }
      };

      setElements((nds) => nds.concat(newTask));
    },
    [taskFlowInstance]
  );

  const onTaskNodeClick = (event, node) => {
    let copyNodes = taskNodes;
    copyNodes.map((copyNode) => {
      if (node.id === copyNode.id) {
        copyNode.data.borderColor = '#023FB2';
      } else {
        copyNode.data.borderColor = '#0585FC';
      }
      return copyNode;
    });
    setTaskNodes([...copyNodes]);
    setSelectedTaskNode(node);
    setOpenTaskPropertiesBlock(true);
  };

  return (
    <>
      {isPageDesignerActive ? (
        <DndProvider debugMode={true} backend={HTML5Backend}>
          <Designer componentMapper={componentMapper} />
        </DndProvider>
      ) : (
        <TaskFlowDesigner
          connectionLineStyle={connectionLineStyle}
          defaultViewport={defaultViewport}
          snapGrid={snapGrid}
          taskFlowWrapper={taskFlowWrapper}
          taskNodes={taskNodes}
          taskEdges={taskEdges}
          elements={elements}
          onTaskNodesChange={onTaskNodesChange}
          onTaskEdgesChange={onTaskEdgesChange}
          taskFlowInstance={taskFlowInstance}
          setTaskFlowInstance={setTaskFlowInstance}
          onTaskNodeConnect={onTaskNodeConnect}
          onTaskNodeDrop={onTaskNodeDrop}
          onTaskNodeDragOver={onTaskNodeDragOver}
          onTaskNodeClick={onTaskNodeClick}
          TASK_NODE_TYPES={TASK_NODE_TYPES}
          TASK_EDGE_TYPES={TASK_EDGE_TYPES}
          selectedTaskNode={selectedTaskNode}
          openTaskPropertiesBlock={openTaskPropertiesBlock}
          setOpenTaskPropertiesBlock={setOpenTaskPropertiesBlock}
        />
      )}
    </>
  );
}
