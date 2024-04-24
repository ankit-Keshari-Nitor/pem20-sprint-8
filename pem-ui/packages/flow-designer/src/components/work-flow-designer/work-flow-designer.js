import React, { useState, useRef, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { addEdge, MarkerType, useNodesState, useEdgesState } from 'reactflow';

import './work-flow-designer.scss';

import Designer from '../../../../page-designer/src';
import componentMapper from '../../../../carbon-mappers/src';
import { CustomEdge } from '../edges';
import TaskFlowDesigner from '../task-flow-designer';
import { StartNode, EndNode, GatewayNode, TaskNode } from '../nodes';

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
    position: { x: 250, y: 300 },
    sourcePosition: 'right'
  },
  {
    id: '2',
    type: 'end',
    data: { label: 'End' },
    position: { x: 450, y: 300 },
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
  buttonedge: CustomEdge
};

let taskId = 0;
const getNewTaskId = () => `Task_Name_${taskId++}`;

export default function WorkFlowDesigner() {
  const [isPageDesignerActive, setIsPageDesignerActive] = useState(false);

  // --------------------------------- Task Flow States -----------------------------------
  const [openTaskPropertiesBlock, setOpenTaskPropertiesBlock] = useState(false);
  const taskFlowWrapper = useRef(null);
  const [taskNodes, setTaskNodes, onTaskNodesChange] = useNodesState(TASK_INITIAL_NODES);
  const [taskEdges, setTaskEdges, onTaskEdgesChange] = useEdgesState([]);
  const [taskFlowInstance, setTaskFlowInstance] = useState(null);
  const [selectedTaskNode, setSelectedTaskNode] = useState(null);

  const onTaskNodeConnect = useCallback((params) => {
    let newParam = params;
    newParam.type = 'buttonedge';
    newParam.markerEnd = endMarks;
    setTaskEdges((eds) => addEdge({ ...newParam, animated: true, style: { stroke: '#000' } }, eds));
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
        data: { ...nodeData }
      };

      console.log('newTask', newTask);
      setTaskNodes((nds) => nds.concat(newTask));
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
        <>
          <div className="work-flow-designer">
           
              <TaskFlowDesigner
                connectionLineStyle={connectionLineStyle}
                defaultViewport={defaultViewport}
                snapGrid={snapGrid}
                taskFlowWrapper={taskFlowWrapper}
                taskNodes={taskNodes}
                taskEdges={taskEdges}
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
          
          </div>
        </>
      )}
    </>
  );
}
