/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, MarkerType, useNodesState, useEdgesState, Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './workflow-designer.css';
import BlockTray from './blocktray';
import { CustomEdge } from './edges';
import { StartNode, EndNode, TaskNode } from './nodes';

const connectionLineStyle = { stroke: '#000' };
const defaultViewport = { x: 0, y: 0, zoom: 1 };
const snapGrid = [10, 10];

const initialNodes = [
  {
    id: '1',
    type: 'start',
    data: { label: 'Start' },
    position: { x: 150, y: 100 },
    sourcePosition: 'right'
  },
  {
    id: '2',
    type: 'end',
    data: { label: 'End' },
    position: { x: 450, y: 100 },
    targetPosition: 'left'
  }
];


const endMark = {
  type: MarkerType.ArrowClosed,
  width: 20,
  height: 20,
  color: '#FF0072',
};
const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
    type: 'buttonedge',
    markerEnd: endMark
  }
];

const nodeTypes = {
  start: StartNode,
  end: EndNode,
  partner: TaskNode,
  approval: TaskNode,
  attribute: TaskNode,
  sponsor: TaskNode,
  custom: TaskNode,
  system: TaskNode,
  gateway: TaskNode
};



const edgeTypes = {
  buttonedge: CustomEdge
};

let id = 0;
const getId = () => `dnd-node_${id++}`;

const WorkflowDnDDesigner = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  console.log('edges', edges);

  const onConnect = useCallback((params) => {
    let newparam = params;
    newparam.type = 'buttonedge';
    newparam.markerEnd = endMark;
    setEdges((eds) => addEdge({ ...newparam, animated: true, style: { stroke: '#000' } }, eds));
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Get the position of the task
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      });

      const taskLabel = type[0].toUpperCase() + type.slice(1);

      console.log('type', type, event);
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${taskLabel}` }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="dnd-flow">
      <div className="task-tray-container">
        <BlockTray blockType="group1" />
      </div>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            connectionLineStyle={connectionLineStyle}
            defaultViewport={defaultViewport}
            snapGrid={snapGrid}
            fitView
            attributionPosition="bottom-left"
          >
            <Background color="#ccc" variant="dots" />
            <Controls position="bottom-right" showZoom={true} showFitView={true} showInteractive={false} />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default WorkflowDnDDesigner;
